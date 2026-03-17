# Engineer Onboarding

This module generates a participant-facing PDF on the REDCap `final_report` survey, saves it back to REDCap, and attaches it to the `wellu_pdf` file field. It is tightly coupled to the WellU HRA project and should be treated as a project feature, not a generic PDF utility.

## Key Files

- [`config.json`](../config.json): EM manifest and settings.
- [`PDFGenerator.php`](../PDFGenerator.php): server-side hook, mapping, and save flow.
- [`js/config.js`](../js/config.js): PDF layout, scoring, and browser POST logic.
- [`resources/resources.json`](../resources/resources.json): resource copy and links used in the PDF.
- [`resources/lookup.json`](../resources/lookup.json): resource category labels.
- [`process_resources.py`](../process_resources.py): regenerates `resources/resources.json` from a spreadsheet source.
- [`pages/pdfgenerator.php`](../pages/pdfgenerator.php): old test page; not part of normal runtime.
- [`generated_pdfs/README.md`](../generated_pdfs/README.md): temp-output directory requirement.

## Runtime Flow

1. `PDFGenerator::redcap_survey_page()` injects PDF assets when the current instrument is `final_report`.
2. `prepPdfGenerator()` loads record data, computes goal tiles, selects resource content, and passes everything to the page.
3. `js/config.js` builds the PDF with `jsPDF`, opens a preview, and POSTs the PDF back to the survey page.
4. PHP writes a temp file to `generated_pdfs/`, stores it in REDCap edocs, attaches it to `wellu_pdf`, and removes the temp file.

## Coupling with REDCap project structure

These assumptions are hard-coded today:

- Survey instrument: `final_report`
- Tailored care survey: `tcp_intake_survey`
- Event: `fy_202627_arm_1`
- File field: `wellu_pdf`
- Name fields: `first_name`, `last_name`
- Priority/ranking fields: defined in the private `$lookup` array in [`PDFGenerator.php`](../PDFGenerator.php)
- Resource-state fields: expected to follow `<prefix>_action`, `<prefix>_yn`, and `<prefix>_is_green`

Two important implementation details:

- PHP often reads event data by array index like `$record[1]`
- JS selects a record by `redcap_event_name`, `redcap_repeat_instrument`, and `affirmative`

If the REDCap structure changes, those two selection strategies can drift out of sync.

## Where To Update Code When The Project Changes

| Change | Start here |
| --- | --- |
| PDF should render on a different survey | `PDFGenerator::redcap_survey_page()` |
| Tailored care survey/instrument changed | `PDFGenerator::getTcpLink()` |
| Event name or longitudinal structure changed | `getTcpLink()`, `prepPdfGenerator()`, `processPriorities()`, `getPdfContent()`, `PDF.addEventHandlers()` |
| File-upload destination changed | `savePdfToFileField()` |
| Name fields changed | `prepPdfGenerator()` |
| Priority/ranking fields changed | private `$lookup` array in [`PDFGenerator.php`](../PDFGenerator.php) |
| Resource field naming changed | `getPdfContent()` |
| Scoring thresholds or logic changed | `qualifiedTCP`, `calculateIndividualData()`, `calculateRiskKeyBubbles()`, `calculateRiskKeysTable()`, `calculateA1CValue()` |
| Front-page tile count/design changed | `PDF.generatePDF()`, `createGoalBox()`, `createGoalSubbox()` |

## If Resources Change

### Existing copy or links changed

Update:

- the spreadsheet source used by [`process_resources.py`](../process_resources.py), if available
- or [`resources/resources.json`](../resources/resources.json) directly

### New choice under an existing category

Update:

- [`resources/resources.json`](../resources/resources.json)
- the REDCap response options that feed the matching `<prefix>_action` field

Check that the choice value matches the JSON key pattern used by `getPdfContent()`.

### Entirely new category

Update:

- [`resources/lookup.json`](../resources/lookup.json)
- [`resources/resources.json`](../resources/resources.json)
- the matching REDCap field family
- `getPdfContent()` if the new category does not follow the current `_action` / `_yn` / `_is_green` pattern

### New tile/icon

Update:

- the private `$lookup` array in [`PDFGenerator.php`](../PDFGenerator.php)
- image assets in [`js/img`](../js/img)
- the image list in `prepPdfGenerator()`
- `imageToIndex` in [`js/config.js`](../js/config.js)

### New summary metric

Update:

- `labels` and `recommendations` in `PDF.generatePDF()`
- the matching value logic in `calculateIndividualData()`
- the matching risk logic in `calculateRiskKeysTable()` or `calculateRiskKeyBubbles()`

## Biggest Risks

- Mixed event-selection logic between PHP and JS.
- Hard-coded fiscal-year event name.
- Save flow trusts browser-supplied `record_id` and `name`.
- Resource spreadsheet source is not present in this repo.
- `pages/pdfgenerator.php` and some loaded dependencies appear to be leftover or unused.
- Local logging can create very large files like `pdf_generator_log.txt`.

## Recommended Update Order

1. Confirm the new REDCap structure and field coding with the project owner.
2. Update server-side mappings in [`PDFGenerator.php`](../PDFGenerator.php).
3. Update client-side selection and scoring in [`js/config.js`](../js/config.js).
4. Update resource data files if content or choice coding changed.
5. Run an end-to-end manual PDF test on representative records.

## See Also

- [`maintenance.md`](./maintenance.md): ramp-up, smoke tests, and backlog guidance
- [`README.md`](../README.md): setup and general module notes
