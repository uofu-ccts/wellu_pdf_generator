# Maintenance Playbook

This document contains the team-oriented maintenance material that used to live in `onboarding.md`.

Use this alongside [`onboarding.md`](./onboarding.md):

- `onboarding.md` explains the module structure and change-impact areas
- `maintenance.md` covers ramp-up, testing, and near-term maintenance guidance

## Suggested Ramp-Up By Complexity

### Low complexity

Focuses:

- read `PDFGenerator.php` and `js/config.js` end to end
- trace one record from survey render to saved file field
- learn the resource JSON structure and how one category gets rendered
- make content-only and documentation-only changes safely
- use manual verification after every change

Deliverables:

- inline comments where non-obvious logic needs quick explanation
- documented field dependencies and data assumptions
- small content updates in `resources/resources.json`
- doc cleanup for stale references and known setup steps

### Medium complexity

Focuses:

- map and stabilize the REDCap contract
- update instrument, event, and field-name constants or mappings
- clean up dead test code and unused dependencies after verification
- improve maintainability without changing the user-facing PDF design
- define repeatable manual QA steps for future maintainers

Deliverables:

- a manual smoke-test script or checklist
- a constants/config layer for instrument, event, and file-field names
- a documented resource update workflow
- removal or quarantine of confirmed-dead code such as the old test page

### High complexity

Focuses:

- remove index-based data access and centralize event selection
- harden the POST/save flow and validate record context server-side
- refactor `js/config.js` into clearer units without breaking layout
- decide whether the module remains project-specific or moves toward configurability
- establish a safer source-of-truth workflow for the resource catalog

Deliverables:

- unified record/event selection shared across PHP and JS
- hardened server-side save logic with clearer assumptions
- a short architecture decision record for future refactors
- a split or modularized front-end rendering/scoring structure
- a documented plan for spreadsheet/source-of-truth recovery and content operations

## Safe First Changes

These are good early tasks for the team:

- add clear constants for `final_report`, `tcp_intake_survey`, `fy_202627_arm_1`, and `wellu_pdf`
- document the spreadsheet source for resources
- remove or quarantine dead test code in `pages/pdfgenerator.php`
- add guardrails around POST handling and filename construction
- split scoring logic from rendering logic

## Manual Test Checklist

Use this list whenever changing behavior.

1. Enable the module on a project with the expected WellU instruments and fields.
2. Confirm the `generated_pdfs/` directory exists and is writable by the web process.
3. Open a record that should render the `final_report` survey.
4. Verify the page auto-generates a PDF and that the manual “Download Your Results” button also works.
5. Confirm the browser preview opens or, if blocked, that the PDF is still saved server-side.
6. Verify the file is attached to the `wellu_pdf` field on the correct record.
7. Check at least one record that qualifies for the tailored care pathway and one that does not.
8. Check at least one record for each major content path: green/default, no action, explicit action, and mental-health/substance-use pathways.
9. Review the generated PDF for broken links, missing images, text overlap, and page-break issues.
10. Confirm no unexpected temp PDFs remain in `generated_pdfs/`.

## Questions New Engineers Should Ask Early

- Where is the canonical spreadsheet or content source for `resources/resources.json`?
- Who owns changes to the REDCap field contract?
- How often do event names roll forward, and who updates them?
- Is the module expected to stay WellU-specific, or should it become configurable?
- What is the expected behavior when a participant regenerates the PDF multiple times?

## Recommended Near-Term Backlog

### Stability

- unify record/event selection
- validate POSTed record context
- remove hard-coded year/event drift where possible

### Maintainability

- split `js/config.js` into smaller modules
- replace magic strings with constants
- document field mappings and scoring rules

### Content operations

- recover and store the spreadsheet source-of-truth
- define a repeatable resource update workflow
- audit live external links periodically

## Final Notes

This module is understandable once the flow is traced, but it currently behaves more like a tightly-coupled product feature than a generalized REDCap utility.

That is not necessarily a problem. It just means future changes should start by protecting the project-specific contract instead of assuming the module is loosely configurable.
