# jsPDF Generator

This is an external module to generate a PDF when prompted using the JSPDF library.

## Setup for Development
1. Clone repo into the `modules` directory for a `REDCap` instance.
2. Modify name to follow REDCap EM naming conventions: `wellu_pdf_generator_v[version_number]`
3. Create `generated_pdfs` directory in the root of the EM's directory and `chown` the `generated_pdfs` directory to be
   owned the appropriate user. During local development this is most likely not needed.
4. Enable EM for the REDCap instance an project.
