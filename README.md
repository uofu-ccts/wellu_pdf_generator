# jsPDF Generator

This is an external module to generate a PDF when prompted using the JSPDF library.

## Setup for Development
1. Clone repo into the `modules` directory for a `REDCap` instance.
2. Modify name to follow REDCap EM naming conventions: `wellu_pdf_generator_v[version_number]`
3. `chown` the `generated_pdfs` directory to be owned the appropriate user. During local
   development this is most likely not needed.
4. Enable EM for the REDCap instance an project.

## Overview of Componenets
- `PDFGenerator.php`: Main PHP class that handles logic for the EM. Contains goals with their priority level, label, image names, etc. Sorts and processes goals before passing them to the `config.js` file to be rendered into a PDF
- `js/`: Contains Javascript code, fonts, and images for the PDF
      - `js/config.js`: Javascript code to render the PDF. Uses jsPDF and has a lot of self defined helper functions.
      - `js/img/`: Directory with images/icons.
- `resources/`: Has resources, copy, and a lookup table based on study team logic.
      - `lookup.json`: Header for the extended "narrative section" of the PDF. After the first page.
      - `resources/resources.json`: JSONifed version of the PDF copy from the spreadsheet provided by the study team.
      - `resources/resources.old.json`: Probably should delete
- `emLoggerTrait.php`: EM Logger Class. [Docs](https://github.com/susom/redcap-em-logger)
- `process_resources.py`: Python script to process Excel sheet with PDF copy from study team. [Please see confluence documentation.](https://utahctsi.atlassian.net/wiki/spaces/bmicproj/pages/3879665665/PDF+Generator+EM)
- `pages/pdfgenerator.php`: Page for testing project
  
