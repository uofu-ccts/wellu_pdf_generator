# Engineer Onboarding

## Purpose

This document is a practical onboarding guide for engineers maintaining the WellU HRA PDF Generator External Module.

Snapshot date: March 17, 2026.

The goal is to help a new engineer understand:

- what the module does
- how data flows from REDCap into the generated PDF
- which files matter most
- what is brittle or project-specific
- where to start safely

## Module Summary

This module injects PDF-generation behavior into a REDCap survey instrument named `final_report`.

When a participant reaches that survey page:

1. PHP loads record data and computes priority/resource inputs.
2. The page injects fonts, images, JS config, and serialized data.
3. Browser-side JavaScript generates a branded PDF with `jsPDF`.
4. The browser POSTs the PDF back to the same survey page as base64 data.
5. PHP writes a temporary PDF to `generated_pdfs/`, stores it in REDCap edocs, attaches it to the `wellu_pdf` file field, and deletes the temp file.

The module is not a general-purpose PDF engine. It is tightly coupled to the WellU HRA project’s instrument names, event names, field names, resource catalog, and branding.

## Main Files

- [`config.json`](./config.json): REDCap EM manifest, metadata, and debug settings.
- [`PDFGenerator.php`](./PDFGenerator.php): main module class and server-side orchestration.
- [`js/config.js`](./js/config.js): client-side PDF layout, rendering, scoring, and POST behavior.
- [`resources/resources.json`](./resources/resources.json): large generated resource catalog used to populate PDF sections.
- [`resources/lookup.json`](./resources/lookup.json): category-to-label mapping used when selecting resources.
- [`process_resources.py`](./process_resources.py): script that generates `resources/resources.json` from a spreadsheet.
- [`pages/pdfgenerator.php`](./pages/pdfgenerator.php): old test page that is explicitly marked unused.
- [`generated_pdfs/README.md`](./generated_pdfs/README.md): reminder that the temp-output directory must exist.
- [`emLoggerTrait.php`](./emLoggerTrait.php): optional logging integration with the `em_logger` external module.
- [`README.md`](./README.md): minimal setup notes; useful but incomplete.

## Runtime Flow

### 1. Survey hook

`PDFGenerator::redcap_survey_page()` is the main runtime entry point.

- If the current instrument is `final_report`, the module injects HTML/JS into the page.
- On POST, the same method handles incoming base64 PDF data and saves it.

### 2. Data gathering in PHP

`prepPdfGenerator()` loads:

- record data from REDCap
- participant name
- processed priority tiles
- resource content selections
- a tailored-care-pathway survey link
- local font and image assets

This data is serialized into the page and handed to `PDF.addEventHandlers(...)`.

### 3. Record selection in JavaScript

Client-side logic chooses a single “logic record” from the serialized REDCap payload using:

- `redcap_event_name === "fy_202627_arm_1"`
- `redcap_repeat_instrument === ""`
- `affirmative === "1"`

This is important: the JS logic is event-name-based, while some PHP logic relies on array index positions such as `$record[1]`.

### 4. PDF generation

`js/config.js` builds:

- header and branding
- four priority tiles with icons and short action text
- an optional tailored care pathway section
- “Results at a Glance” metrics and summary table
- full-length resource sections on following pages

The resource text mostly comes from `resources/resources.json`.

### 5. Save back into REDCap

The browser sends:

- `action`
- `pdfData`
- `record_id`
- `name`

PHP then:

- writes a temp PDF into `generated_pdfs/`
- stores it with `REDCap::storeFile(...)`
- attaches it to the `wellu_pdf` file field
- removes the temp file if attachment succeeds

## Critical REDCap Contract

This module depends on specific REDCap project structure. Before changing code, verify these assumptions still hold.

### Instrument names

- `final_report`: survey page where PDF generation is injected
- `tcp_intake_survey`: survey used for the tailored-care-pathway enrollment link

### Event names

- `fy_202627_arm_1` is hard-coded in both PHP and JS

If the project rolls to a new fiscal year or event naming scheme, the module will likely break or partially misread data.

### File field

- `wellu_pdf` is hard-coded as the destination file-upload field

### Field naming conventions

The module assumes many specific fields exist, including:

- priority fields such as `dbt_priority_numb_2`, `phys_priority_numb_2`
- ranking fields such as `dbt_priority`, `stress_priority`
- checkbox fields such as `top_3___15`
- action fields such as `stress_action`, `gen_action`
- yes/no fields such as `stress_yn`
- green-state fields such as `stress_is_green`
- summary/scoring fields such as `bmi`, `gad_total`, `phq9_total_score`, `alc_total`, `general_health`

This is not exhaustive. Treat the current code as the source of truth for the field contract.

## What Is Project-Specific vs Reusable

### Project-specific

- event name and survey names
- WellU branding and static images
- University of Utah and SupportLinc resource links
- tailored care pathway wording and qualification rules
- score-to-risk thresholds embedded in `js/config.js`
- resource selection rules in `getPdfContent()`

### Potentially reusable

- overall pattern of client-side PDF generation plus server-side attachment
- temp-file to edocs flow
- asset injection pattern
- resource-catalog approach

If the team ever wants a reusable PDF module, expect a real refactor rather than a simple rename.

## Known Risks And Maintenance Hotspots

### 1. Mixed record-selection strategies

This is the biggest correctness risk.

- PHP commonly reads from `$record[1]`
- JS filters records by event name and `affirmative`

If record ordering changes, PHP and JS may operate on different rows of the same REDCap export.

Recommendation: standardize record/event selection in one place and remove index-based assumptions.

### 2. Hard-coded year/event dependency

`fy_202627_arm_1` is embedded directly in code. This will need maintenance every time the project’s event naming changes.

Recommendation: move event/instrument names into constants, project settings, or a clearly documented configuration block.

### 3. POST save flow trusts client-supplied identifiers

The save endpoint accepts `record_id` and `name` from the browser and uses them in the temp filename and attachment flow.

Recommendation: validate the incoming record against the current survey context before saving anything.

### 4. Resource source-of-truth is incomplete in the repo

`process_resources.py` expects a spreadsheet named `wellu_resources_final_mm.xlsx`, but that spreadsheet is not committed here.

Implication: the repo contains generated JSON, but not the full editable source needed to regenerate it.

Recommendation: locate the spreadsheet source and document where it lives, or migrate to a version-controlled structured source.

### 5. Minimal/stale documentation

The current `README.md` is short and does not describe:

- the survey hook
- the field contract
- the event dependency
- manual testing steps
- resource regeneration workflow

This onboarding doc closes part of that gap, but additional docs would still help.

### 6. Dead code and unused dependencies

- `pages/pdfgenerator.php` is marked as test-only and unused.
- `html2canvas` and `DOMPurify` are loaded but do not appear to be used by current JS.
- Some assets and older resource files may be historical leftovers.

Recommendation: remove or document anything intentionally retained.

### 7. Logging can create huge local files

There is local file-based logging support in `simple_log()`, and `pdf_generator_log.txt` can become very large. During this review, the local log file was approximately 961 MB.

The repo’s `.gitignore` ignores `*_log.txt`, so the file should not be committed, but engineers should still watch disk usage during debugging.

### 8. No automated tests in the module

Current maintenance is mostly dependent on careful reading and manual verification inside REDCap.

Recommendation: at minimum, add a written smoke-test checklist and consider extracting pure logic into testable helpers over time.

## Resource Data Model

The resource system is a major part of the module.

`resources/resources.json` stores entries keyed like:

- `activity_3`
- `anx_2`
- `gen_1`

Each entry can include:

- `name`
- `link`
- `pdf_box`
- `full`

The `full` array is rendered as paragraphs, bullets, or links in the PDF.

`getPdfContent()` determines which resource key to use by combining:

- category prefix from `lookup.json`
- `_action`
- `_yn`
- `_is_green`

This means content behavior is driven by REDCap response state, not just one chosen field.

## Front-End Layout Notes

`js/config.js` is large and does several jobs at once:

- configuration constants
- event wiring
- PDF page layout
- risk scoring
- value formatting
- section height estimation

For future maintenance, it may help to split this file into smaller units such as:

- rendering/layout helpers
- scoring logic
- data formatting
- resource/goal selection glue

## If The REDCap Project Structure Changes

When the REDCap project changes, start by identifying which kind of contract changed. Most breakages fall into one of the groups below.

### Instrument names changed

Review these places first:

- `PDFGenerator::redcap_survey_page()`: update the instrument that should trigger PDF generation
- `PDFGenerator::getTcpLink()`: update the enrollment survey instrument if the tailored-care-pathway survey changes
- any documentation that still references the old instrument names

Typical examples:

- `final_report` renamed or replaced
- `tcp_intake_survey` renamed or moved

### Event names or longitudinal structure changed

Review these places first:

- `PDFGenerator::getTcpLink()`: currently hard-codes `fy_202627_arm_1`
- `PDF.addEventHandlers()` in `js/config.js`: filters the “logic record” by `redcap_event_name`
- `PDFGenerator::processPriorities()`: commonly reads from `$record[1]`
- `PDFGenerator::getPdfContent()`: also commonly reads from `$record[1]`
- `prepPdfGenerator()`: reads name fields from `$record[0]`

This is the highest-risk project-structure change, because the module currently mixes:

- event-name-based selection in JavaScript
- array-index-based selection in PHP

If the project adds events, reorders events, or changes which event contains the relevant data, PHP and JS can drift out of sync.

Recommended update strategy:

1. Decide which REDCap event should be the authoritative source for the PDF.
2. Update both PHP and JS to select that same event explicitly.
3. Remove as many `$record[0]` and `$record[1]` assumptions as possible while making the change.

### File-upload destination changed

Review this place first:

- `PDFGenerator::savePdfToFileField()`

If the destination field name changes from `wellu_pdf`, update it there and then confirm the field still exists on the right instrument/event context.

### Participant identity fields changed

Review this place first:

- `prepPdfGenerator()`

The module currently uses `first_name` and `last_name` when building the display name and temp filename. If those fields are renamed, moved, or replaced by a single full-name field, update that logic.

### Priority/ranking field structure changed

Review this place first:

- the private `$lookup` array in `PDFGenerator.php`

This array is the main mapping layer for:

- tile labels
- priority field names
- top-three checkbox field names
- ranking field names
- tile images
- resource-action family mapping

If REDCap priority fields are renamed or recoded, this is the first server-side structure to update.

### Summary or scoring fields changed

Review these places first in `js/config.js`:

- `qualifiedTCP` logic inside `PDF.generatePDF()`
- `calculateIndividualData()`
- `calculateRiskKeyBubbles()`
- `calculateRiskKeysTable()`
- `calculateA1CValue()`

These functions hard-code field names and often hard-code answer coding as well. If the project changes:

- variable names
- coded values
- thresholds
- eligibility rules

then these functions need to be updated together.

### Resource-state field conventions changed

Review this place first:

- `PDFGenerator::getPdfContent()`

That method assumes each content area follows a naming convention like:

- `<prefix>_action`
- `<prefix>_yn`
- `<prefix>_is_green`

If the REDCap project changes those conventions, resource selection will stop matching the intended content.

## If New Resources Are Added

The right update path depends on what kind of “new resource” is being added.

### Case 1: New resource text for an existing category and existing choice

Update:

- the source spreadsheet used by `process_resources.py`, if available
- or `resources/resources.json` directly, if the spreadsheet is unavailable

No PHP or JS changes are usually needed if:

- the category prefix already exists
- the choice key already fits the current naming pattern
- the rendered layout does not change

Examples:

- updating copy for an existing stress resource
- swapping a link for an existing anxiety resource
- adding richer paragraph/bullet content to an existing choice

### Case 2: New resource choice under an existing category

Update:

- `resources/resources.json`
- the spreadsheet source, if that is still the team’s authoring workflow
- the REDCap response options that feed the relevant `<prefix>_action` field

Check:

- whether `getPdfContent()` can already derive the new resource key correctly
- whether the new choice value matches the key format used in `resources/resources.json`

If the new choice value is not part of the existing field coding, update REDCap first and then sync the JSON keys to match.

### Case 3: Entirely new resource category

Update:

- `resources/lookup.json`
- `resources/resources.json`
- the REDCap field family for that category
- `getPdfContent()` if the new category does not follow the current `_action`, `_yn`, `_is_green` pattern

For a new category to work cleanly, the project usually needs:

- a category prefix in `lookup.json`
- matching REDCap fields
- matching resource keys in `resources/resources.json`

### Case 4: New top-priority tile or icon

Update:

- the private `$lookup` array in `PDFGenerator.php`
- image assets under `js/img/`
- the image filename list in `prepPdfGenerator()`
- the `imageToIndex` map in `js/config.js`

Also review the PDF layout itself. The current front page is designed around four tile slots. If the design needs to show more tiles or different tile types, update the layout loop and box sizing in `PDF.generatePDF()`.

### Case 5: New summary metric or recommendation row

Update:

- the `labels` array in `PDF.generatePDF()`
- the `recommendations` array in `PDF.generatePDF()`
- the corresponding value logic in `calculateIndividualData()`
- the corresponding risk logic in `calculateRiskKeysTable()` or `calculateRiskKeyBubbles()`

## Change Impact Map

Use this as a quick “where do I touch the code?” reference.

| Change type | Primary files/functions to review |
| --- | --- |
| PDF should render on a different survey instrument | `PDFGenerator::redcap_survey_page()` |
| Tailored care survey link changed | `PDFGenerator::getTcpLink()` |
| Primary event changed | `PDFGenerator::getTcpLink()`, `PDF.addEventHandlers()`, `processPriorities()`, `getPdfContent()` |
| Longitudinal structure changed | `prepPdfGenerator()`, `processPriorities()`, `getPdfContent()`, `PDF.addEventHandlers()` |
| File-upload field renamed | `savePdfToFileField()` |
| Name fields renamed | `prepPdfGenerator()` |
| Priority fields or ranking scheme changed | private `$lookup` array in `PDFGenerator.php` |
| Resource field naming convention changed | `getPdfContent()` |
| Scoring thresholds changed | `qualifiedTCP`, `calculateRiskKeyBubbles()`, `calculateRiskKeysTable()`, `calculateA1CValue()` |
| Existing resource content changed | `resources/resources.json`, spreadsheet source, `process_resources.py` |
| New resource category added | `resources/lookup.json`, `resources/resources.json`, REDCap field family, `getPdfContent()` |
| New tile/icon added | private `$lookup`, `js/img/`, `prepPdfGenerator()`, `imageToIndex`, PDF layout loop |

## Recommended Change Sequence

When the REDCap project contract changes, the safest order is usually:

1. Confirm the new REDCap structure and field naming with the project owner.
2. Update the server-side mapping layers in `PDFGenerator.php`.
3. Update client-side selection/scoring logic in `js/config.js`.
4. Update resource data files if content or choice coding changed.
5. Run a manual end-to-end PDF generation test on representative records.

## See Also

For ramp-up by complexity, testing checklists, and near-term backlog notes, see [`maintenance.md`](./maintenance.md).
