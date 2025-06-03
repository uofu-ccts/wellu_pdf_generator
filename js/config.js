// CREATE PDF GENERATOR OBJECT
if (typeof PDF === "undefined") {
  var PDF = {};
}

const styles = {
  font: "helvetica",
  textColor: "#000",
  h1: {
    fontSize: 22,
    fontStyle: "bold",
  },
  h2: {
    fontSize: 18,
    fontStyle: "bold",
  },
  h3: {
    fontSize: 16,
    fontStyle: "bold",
  },
  h4: {
    fontSize: 14,
    fontStyle: "bold",
  },
  h5: {
    fontSize: 12,
    fontStyle: "bold",
  },
  h6: {
    fontSize: 10,
    fontStyle: "bold",
  },
  p: {
    fontSize: 12,
    fontStyle: "normal",
  },
  box: {
    backgroundColor: "#2196d9",
    headerBackgroundColor: "#1b8cbd",
    font: "helvetica",
    textColor: "#FFF",
    fontSize: 12,
    fontStyle: "normal",
  },
  sectionBox: {
    backgroundColor: "#fff",
    headerBackgroundColor: "#e7e7e7",
    font: "helvetica",
    textColor: "#000",
    fontSize: 12,
    fontStyle: "normal",
  },
  prioritiesSection: {
    headerColor: "#2c3e50", // dark blue
    headerTextColor: "#fff", // white
    bodyTextColor: "#333", // dark gray
    fontSizeBody: 10,
  },
  riskKey: {
    low: "#2dc26b",
    medium: "#f1c40f",
    high: "#e03e2d",
    unknown: "#b96ad9",
  },
};

PDF.post = function (action, pdfData, record_id, name) {
  console.log("Posting PDF data to server...");
  
  // Use AJAX instead of form submission to prevent reloading of survey page
  $.ajax({
    type: "POST",
    url: window.location.href,
    data: {
      action: action,
      pdfData: pdfData,
      record_id: record_id,
      name: name
    },
    success: function() {
      console.log("PDF successfully saved to server");
    },
    error: function(error) {
      console.error("Error saving PDF:", error);
    }
  });
};

PDF.addEventHandlers = function () {
    // Handle the ADD button
    $(".generate-pdf").on("click", function () {
        var record_id = $(this).attr("data-record-id");
        var name = $(this).attr("data-name");

        PDF.generatePDF(record_id, name);
    });

    // Auto-generate PDF when document is ready
    $(document).ready(function () {
        if (typeof PDF_RECORD_ID !== 'undefined' && typeof PDF_NAME !== 'undefined') {
            console.log("Auto-generating PDF on page load");
            PDF.generatePDF(PDF_RECORD_ID, PDF_NAME);
        }
    });
};

PDF.generatePDF = async function (record_id, name) {
  // Default export is a4 paper, portrait, using millimeters for units
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const startingX = 10; // Starting X coordinate
  const startingY = 10; // Starting Y coordinate
  let coordinates = [startingX, startingY];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  coordinates = createHeader(
    doc,
    "Thank you for completing your WellU Health Risk Assessment.",
    coordinates,
    "h2",
    20
  );
  coordinates = createHeader(
    doc,
    "You will find your personalized action plan below!",
    coordinates,
    "h3",
    15
  );

  const boxX = coordinates[0];
  const boxY = coordinates[1];
  const boxWidth = 40; // Width of the box
  const boxHeight = 50; // Height of the box

  coordinates = createBox(
    doc,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "A1c",
    coordinates,
    boxWidth,
    boxHeight
  );

  coordinates = createBox(
    doc,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Depression",
    [coordinates[0] + boxWidth + 10, boxY],
    boxWidth,
    boxHeight
  );

  coordinates = createBox(
    doc,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Allergies",
    [coordinates[0] + boxWidth + 10, boxY],
    boxWidth,
    boxHeight
  );

  coordinates = createBox(
    doc,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Cancer",
    [coordinates[0] + boxWidth + 10, boxY],
    boxWidth,
    boxHeight
  );

  coordinates = [startingX, coordinates[1]];

  coordinates = createGridSectionBox(
    doc,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Your Numbers",
    coordinates,
    pageWidth - 20,
    100
  );

  doc.addPage();
  coordinates = [startingX, startingY];

  coordinates = createPrioritiesSectionBox(
    doc,
    "Your Priorities",
    coordinates,
    pageWidth - 20,
    100
  );

  doc.addPage();
  coordinates = [startingX, startingY];

  const labels = [
    "Height",
    "Weight",
    "BMI",
    "Waist",
    "Cholesterol",
    "HDL",
    "LDL",
    "Triglycerides",
  ];
  const referenceRange = [
    "4'9\" - 7'0\"",
    "150 - 180 lbs",
    "18.5 - 24.9",
    "31 - 37 inches",
    "< 200 mg/dL",
    "> 40 mg/dL",
    "< 130 mg/dL",
    "< 150 mg/dL",
  ];
  const individualData = [
    "5'11\"",
    "160 lbs",
    "23 kg/m²",
    "32 inches",
    "160 mg/dL",
    "55 mg/dL",
    "150 mg/dL",
    "130 mg/dL",
  ];
  const riskKeys = [
    "low",
    "medium",
    "high",
    "unknown",
    "low",
    "medium",
    "high",
    "unknown",
  ];

  coordinates = summaryTable(
    doc,
    "Summary Table",
    labels,
    referenceRange,
    individualData,
    riskKeys,
    coordinates,
    pageWidth - 20
  );

  doc.output("dataurlnewwindow");
  const pdfData = doc.output("datauristring");

  PDF.post("generate_pdf", pdfData, record_id, name);
};

const createHeader = function (
  doc,
  title,
  coordinates,
  headerType = "h1",
  coordinateHeight = 10
) {
  title = doc.splitTextToSize(title, 180);
  const headerStyles = styles[headerType];
  doc.setTextColor(styles.textColor);
  doc.setFontSize(headerStyles.fontSize);
  doc.text(title, coordinates[0], coordinates[1]);
  coordinates[1] += coordinateHeight;
  return coordinates;
};

const createText = function (doc, text, coordinates, coordinateHeight = 6) {
  text = doc.splitTextToSize(text, 180);
  doc.setTextColor(styles.textColor);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0], coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};

const createBullet = function (doc, text, coordinates, coordinateHeight = 6) {
  text = doc.splitTextToSize("\u2022 " + text, 160);
  doc.setTextColor(styles.textColor);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0] + 5, coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};

const createBox = function (doc, text, header, coordinates, width, height) {
  const headerHeight = 8; // Height for the header
  doc.setFillColor(styles.box.headerBackgroundColor);
  doc.rect(coordinates[0], coordinates[1], width, headerHeight, "F");
  doc.setFillColor(styles.box.backgroundColor);
  doc.rect(
    coordinates[0],
    coordinates[1] + headerHeight,
    width,
    height - headerHeight,
    "F"
  );

  // Add header to the box
  const textX = coordinates[0] + 4;
  const headerText = doc.splitTextToSize(header, width - 8);
  doc.setTextColor(styles.box.textColor);
  doc.setFontSize(styles.box.fontSize);
  doc.setFont(styles.box.font, styles.box.fontStyle);
  doc.text(headerText, textX, coordinates[1] + 5.33);
  coordinates[1] += headerHeight; // Move down for the text

  // Add text to the box
  text = doc.splitTextToSize(text, width - 8);
  doc.setTextColor(styles.box.textColor);
  doc.setFontSize(styles.box.fontSize);
  doc.setFont(styles.box.font, styles.box.fontStyle);
  doc.text(text, textX, coordinates[1] + 6);

  coordinates[1] += height;
  return coordinates;
};

const createGridSectionBox = function (
  doc,
  text,
  header,
  coordinates,
  width,
  height
) {
  const headerHeight = 8; // Height for the header
  doc.setFillColor(styles.sectionBox.headerBackgroundColor);
  doc.rect(coordinates[0], coordinates[1], width, headerHeight, "F");

  // Add header to the box
  const textX = coordinates[0] + 4;
  const headerText = doc.splitTextToSize(header, width - 8);
  doc.setTextColor(styles.sectionBox.textColor);
  doc.setFontSize(styles.sectionBox.fontSize);
  doc.setFont(styles.sectionBox.font, styles.sectionBox.fontStyle);
  doc.text(headerText, textX, coordinates[1] + 5.33);
  coordinates[1] += headerHeight; // Move down for the text

  const gridX = coordinates[0];
  const gridY = coordinates[1]; // 10pt gap
  const cols = 4;
  const rows = 2;
  const gridW = width;
  const gridH = height; // total height for two rows
  const cellW = gridW / cols;
  const cellH = gridH / rows;

  // draw outer box
  doc.setDrawColor(styles.sectionBox.headerBackgroundColor);
  doc.rect(gridX, gridY, gridW, gridH);

  // draw vertical lines
  for (let c = 1; c < cols; c++) {
    const x = gridX + cellW * c;
    doc.line(x, gridY, x, gridY + gridH);
  }

  // draw horizontal line
  const yMid = gridY + cellH;
  doc.line(gridX, yMid, gridX + gridW, yMid);

  // --- 3) Fill in each cell with a label and a value ---
  // doc.setFontColor(styles.sectionBox.textColor);
  const labels = [
    ["Height", "Weight", "BMI", "Waist"],
    ["Cholesterol", "HDL", "LDL", "Triglycerides"],
  ];
  const values = [
    ["5'11\"", "160", "23", null],
    ["160", "55", "150", "130"],
  ];
  const units = [
    ["", "lbs", "kg/m²", "inches"],
    ["mg/dL", "mg/dL", "mg/dL", "mg/dL"],
  ];

  const valueColor = "#6195CF";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const xCenter = gridX + c * cellW + cellW / 2;
      const yTop = gridY + r * cellH + 20;

      // label
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor("#666");
      doc.text(labels[r][c], xCenter, yTop, { align: "center" });

      // value
      doc.setTextColor(valueColor);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      let valueText = values[r][c]
        ? `${values[r][c]} ${units[r][c] || ""}`.trim()
        : "?";
      doc.text(valueText, xCenter, yTop + 18, { align: "center" });
    }
  }

  coordinates[1] += height;
  return coordinates;
};

const createPrioritiesSectionBox = function (
  doc,
  header,
  coordinates,
  width,
  height
) {
  const headerHeight = 8; // Height for the header
  doc.setFillColor(styles.sectionBox.headerBackgroundColor);
  doc.rect(coordinates[0], coordinates[1], width, headerHeight, "F");

  // Add header to the box
  const textX = coordinates[0] + 4;
  const headerText = doc.splitTextToSize(header, width - 8);
  doc.setTextColor(styles.sectionBox.textColor);
  doc.setFontSize(styles.sectionBox.fontSize);
  doc.setFont(styles.sectionBox.font, styles.sectionBox.fontStyle);
  doc.text(headerText, textX, coordinates[1] + 5.33);
  coordinates[1] += headerHeight; // Move down for the text

  coordinates[1] = createSubsection(
    doc,
    1,
    "Hemoglobin A1c",
    [
      {
        type: "paragraph",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        type: "bullet",
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        type: "bullet",
        text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
    [coordinates[0] + 10, coordinates[1] + 10],
    width - 20,
    height,
    "#c0392b" // red badge color
  );

  coordinates[1] = createSubsection(
    doc,
    2,
    "Depression",
    [
      {
        type: "paragraph",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        type: "bullet",
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        type: "bullet",
        text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
    [coordinates[0] + 10, coordinates[1]],
    width - 20,
    height,
    "#f39c12" // orange badge color
  );
  coordinates[1] = createSubsection(
    doc,
    3,
    "Allergies",
    [
      {
        type: "paragraph",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      {
        type: "bullet",
        text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        type: "bullet",
        text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
    [coordinates[0] + 10, coordinates[1]],
    width - 20,
    height,
    "#27ae60" // green badge color
  );

  return coordinates;
};

const createSubsection = function (
  doc,
  num,
  header,
  content,
  coordinates,
  width,
  height,
  badgeColor
) {
  const headerH = 10;
  const badgeW = 10;
  const headerColor = styles.prioritiesSection.headerColor; // dark blue
  const headerTextColor = styles.prioritiesSection.headerTextColor; // white
  const bodyTextColor = styles.prioritiesSection.bodyTextColor; // dark gray
  const fontSizeBody = styles.prioritiesSection.fontSizeBody;
  const lineHeight = fontSizeBody * 1.2;
  let x = coordinates[0];
  let y = coordinates[1];
  const w = width;

  // ——— Badge box ———
  doc.setFillColor(badgeColor);
  doc.rect(x, y, badgeW, headerH, "F");
  doc.setTextColor(headerTextColor);
  doc.setFontSize(12);
  doc.text(String(num), x + badgeW / 2, y + headerH / 2 + 1, {
    align: "center",
  });

  // ——— Header bar ———
  doc.setFillColor(headerColor);
  doc.rect(x + badgeW, y, w - badgeW, headerH, "F");
  doc.setFont("helvetica", "bold");
  doc.text(header, x + badgeW + 6, y + headerH / 2 + 1);

  // ——— Content ———
  let cursorY = y + headerH + 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSizeBody);
  doc.setTextColor(bodyTextColor);

  content.forEach((item) => {
    if (item.type === "paragraph") {
      // wrap text within width
      const lines = doc.splitTextToSize(item.text, w);
      doc.text(lines, x, cursorY);
      cursorY += lines.length * lineHeight;
    } else if (item.type === "bullet") {
      let ignoredX;
      [ignoredX, cursorY] = createBullet(
        doc,
        item.text,
        [x, cursorY],
        lineHeight
      );
    }
  });

  return cursorY;
};

const drawRiskBox = function (doc, riskKey, x, y) {
  console.log("Drawing risk box for: ", riskKey);
  const boxWidth = 40;
  const boxHeight = 4;

  const color = styles.riskKey[riskKey]; // Default to unknown if riskKey is not defined
  doc.setFillColor(color);
  doc.rect(x, y, boxWidth, boxHeight, "F");
};

const summaryTable = function (
  doc,
  title,
  labels,
  referenceRange,
  individualData,
  riskKeys,
  coordinates,
  width
) {
  const originX = coordinates[0];
  const originY = coordinates[1];
  const rowHeight = 10;
  const cellPadding = 4;

  // Draw table header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, originX, originY);

  // Label the columns
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Metric", originX + cellPadding, originY + 10);
  doc.text("Reference Range", originX + width / 4 + cellPadding, originY + 10);
  doc.text("Score", originX + (2 * width) / 4 + cellPadding, originY + 10);
  doc.text("Risk", originX + (3 * width) / 4 + cellPadding, originY + 10);
  // Draw horizontal line after header
  doc.line(originX, originY + 12, originX + width, originY + 12);
  // Draw vertical lines
  const verticalLineHeight = 10 + labels.length * rowHeight + cellPadding / 2;
  doc.line(originX, originY + 12, originX, originY + verticalLineHeight);
  doc.line(
    originX + width / 4,
    originY + 12,
    originX + width / 4,
    originY + verticalLineHeight
  );
  doc.line(
    originX + (2 * width) / 4,
    originY + 12,
    originX + (2 * width) / 4,
    originY + verticalLineHeight
  );
  doc.line(
    originX + (3 * width) / 4,
    originY + 12,
    originX + (3 * width) / 4,
    originY + verticalLineHeight
  );
  doc.line(
    originX + width,
    originY + 12,
    originX + width,
    originY + verticalLineHeight
  );
  // Draw outer box

  // Draw table rows
  let yStart = originY + 20; // Start y position for rows
  labels.forEach((label, index) => {
    const y = yStart + index * rowHeight;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, originX + cellPadding, y);
    doc.text(referenceRange[index], originX + width / 4 + cellPadding, y);
    doc.text(individualData[index], originX + (2 * width) / 4 + cellPadding, y);
    // Draw risk box
    const riskKey = riskKeys[index].toLowerCase();
    drawRiskBox(doc, riskKey, originX + (3 * width) / 4 + cellPadding, y - 5);
    // Draw horizontal line for each row
    doc.line(originX, y + 2, originX + width, y + 2);
  });
};
