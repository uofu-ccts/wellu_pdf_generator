# Maintenance Playbook

Use this with [`onboarding.md`](./onboarding.md):

- [`onboarding.md`](./onboarding.md) explains the module structure and code touchpoints
- [`maintenance.md`](./maintenance.md) covers how to approach changes safely

## Work By Complexity

### Low

Focus:

- content-only updates in [`resources/resources.json`](../resources/resources.json)
- doc cleanup
- tracing one record through the existing flow

Deliverables:

- corrected copy or links
- clarified docs and comments
- documented assumptions discovered during review

### Medium

Focus:

- updating field, instrument, event, or file-field mappings
- cleaning up confirmed-dead code
- improving maintainability without changing PDF behavior

Deliverables:

- constants or mapping cleanup
- a documented resource update workflow
- a small smoke-test checklist

### High

Focus:

- unifying PHP and JS event selection
- hardening the POST/save flow
- refactoring `js/config.js`
- making the module more configurable or less brittle

Deliverables:

- shared record-selection strategy
- safer server-side save logic
- modularized rendering/scoring logic
- an architecture note for future refactors

## Safe First Changes

- move hard-coded instrument, event, and file-field names into clear constants
- document the spreadsheet source for resources
- remove or quarantine dead test code after confirming it is unused
- add guardrails around POST handling and filename construction
- separate scoring logic from layout logic where practical

## JSON File Updates

### For SDOH changes

- update [`resources/resources.json`](../resources/resources.json) with SDOH content in the same object shape already used by the PDF: `name`, `link`, `pdf_box`, and `full`
- update [`resources/lookup.json`](../resources/lookup.json) if SDOH needs a new heading/lookup key in the detailed PDF
- keep any new SDOH JSON keys aligned with whatever lookup key and choice mapping `getPdfContent()` uses

### For priority changes

- update [`resources/lookup.json`](../resources/lookup.json) when combined or renamed priorities need different section labels or a different shared lookup key
- update [`resources/resources.json`](../resources/resources.json) so the detailed resource blocks match the new priority grouping, naming, and lookup keys
- if multiple top-of-PDF priorities now roll up to one detailed section, consolidate the matching entries under the shared lookup key and remove or rename obsolete JSON keys

## Manual Smoke Test

1. Confirm `generated_pdfs/` exists and is writable.
2. Open a record that should render `final_report`.
3. Verify auto-generation and the manual download button both work.
4. Confirm the PDF is saved to the correct record’s `wellu_pdf` field.
5. Test one record that qualifies for tailored care and one that does not.
6. Check for broken links, missing images, layout overlap, and leftover temp files.

## Near-Term Backlog

- unify record/event selection across PHP and JS
- validate POSTed record context server-side
- remove hard-coded year/event drift where possible
- split `js/config.js` into smaller units
- document field mappings and scoring rules
- recover or document the spreadsheet source-of-truth for resources

## Key Questions

- Where is the canonical spreadsheet behind `resources/resources.json`?
- Who owns REDCap field-contract changes?
- How often do event names roll forward?
- Is this module staying WellU-specific, or should it become configurable?
