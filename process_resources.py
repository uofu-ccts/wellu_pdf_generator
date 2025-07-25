# Read in Excel file using Pandas
import pandas as pd
import unicodedata
import json

df = pd.read_excel('./wellu_resources_final_mm.xlsx', sheet_name='WellU V2 resource map FINAL')

def normalize_text(text):
    # Replace smart apostrophes with straight ones.
    normalized = unicodedata.normalize('NFKD', text)
    normalized = normalized.replace("\u2019", "'")  # Add other replacements as needed.
    normalized = normalized.replace("\u2014", "-")  # Replace em dash with hyphen
    normalized = normalized.replace("\u2013", "-")  # Replace en dash with hyphen
    return normalized

# Print first 20 rows
df.head(20)

# Replace all nan values with empty strings
df.fillna('', inplace=True)
# Normalize text in specific columns
df['Resource Name'] = df['Resource Name'].apply(normalize_text)
df['Resource Link'] = df['Resource Link'].apply(normalize_text)
df['PDF Box Verbiage'] = df['PDF Box Verbiage'].apply(normalize_text)
df['Full Verbiage'] = df['Full Verbiage'].apply(normalize_text)

# Loop through the DataFrame and create the desired structure
resources = {}
for index, row in df.iterrows():
    resource_key = '{}_{}'.format(row["Field"].lower(), str(row["Choice"]).lower())
    resource_content = {
        "name": row["Resource Name"].strip(),
        "link": row["Resource Link"].strip() if row["Resource Link"] else None,
        "pdf_box": row["PDF Box Verbiage"].strip() if row["PDF Box Verbiage"] else None,
        "full": []
    }
    full_verbiage = row["Full Verbiage"]
    if type(full_verbiage) != str:
        continue
    else:
        full_verbiage = full_verbiage.split("\n")
        for verb in full_verbiage:
            verb = verb.strip()
            t = "paragraph"
            url = None
            if len(verb) == 0:
                continue
            elif verb[0] == "-":
                t = "bullet"
                verb = verb[1:].strip()
            # If verb contains a URL, treat it as a link
            if "http://" in verb or "https://" in verb:
                t = "link"
                # Extract the URL from verb, but leave verb unchanged
                url_start = verb.find("http://")
                if url_start == -1:
                    url_start = verb.find("https://")
                if url_start != -1:
                    url_end = verb.find(" ", url_start)
                    if url_end == -1:
                        url_end = len(verb)
                    url = verb[url_start:url_end]
                    verb = verb[:url_start].strip() + " " + verb[url_end:].strip()
                    verb = verb.strip()

            resource_content["full"].append({"type": t, "text": verb, "url": url})
    resources[resource_key] = resource_content


# Write the resources to a JSON file
with open('./resources/resources.json', 'w') as f:
    json.dump(resources, f, indent=4)