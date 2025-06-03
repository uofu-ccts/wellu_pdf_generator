// CREATE PDF GENERATOR OBJECT
if (typeof PDF === "undefined") {
  var PDF = {};
}

const styles = {
  font: "centurygothic",
  fontStyle: "normal",
  textColor: "#39383a",
  headerFont: "centurygothic_bold",
  headerFontStyle: "bold",
  fontItalic: "centurygothic_italic",
  fontItalicStyle: "italic",
  h1: {
    font: "centurygothic_bold",
    fontSize: 22,
    fontStyle: "bold",
  },
  h2: {
    font: "centurygothic_bold",
    fontSize: 18,
    fontStyle: "bold",
  },
  h3: {
    font: "centurygothic_bold",
    fontSize: 16,
    fontStyle: "bold",
  },
  h4: {
    font: "centurygothic",
    fontSize: 14,
    fontStyle: "normal",
  },
  h5: {
    font: "centurygothic_bold",
    fontSize: 12,
    fontStyle: "bold",
  },
  h6: {
    font: "centurygothic_bold",
    fontSize: 10,
    fontStyle: "bold",
  },
  p: {
    font: "centurygothic",
    fontSize: 12,
    fontStyle: "normal",
  },
  box: {
    backgroundColor: "#dff0ef",
    headerBackgroundColor: "#94d3d1",
    font: "centurygothic",
    headerTextColor: "#FFF",
    fontSize: 12,
    fontStyle: "normal",
    headerFontSize: 16,
  },
  goalSubbox: {
    backgroundColor: "#358584",
    font: "centurygothic",
    textColor: "#fff",
    fontSize: 10,
    fontStyle: "normal",
  },
  sectionBox: {
    backgroundColor: "#fff",
    headerBackgroundColor: "#e7e7e7",
    font: "centurygothic",
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
  var action = $("<input>").attr("name", "action").val(action);
  var pdfData = $("<input>").attr("name", "pdfData").val(pdfData);
  var record_id = $("<input>").attr("name", "record_id").val(record_id);
  var name = $("<input>").attr("name", "name").val(name);
  var form = $("#action-form")
    .append(action)
    .append(pdfData)
    .append(record_id)
    .append(name)
    .submit();
};

PDF.addEventHandlers = function () {
  // Handle the ADD button
  $(".generate-pdf").on("click", function () {
    var record_id = $(this).attr("data-record-id");
    var name = $(this).attr("data-name");

    // PDF.loadFonts();
    PDF.generatePDF(record_id, name);
  });
};

PDF.generatePDF = async function (record_id, name) {
  // Default export is a4 paper, portrait, using millimeters for units
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const startingX = 5; // Starting X coordinate
  const startingY = 10; // Starting Y coordinate
  let coordinates = [startingX, startingY];
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  coordinates = createHeader(
    doc,
    "Thank you for completing your WellU Health Risk Assessment.",
    [pageWidth, coordinates[1]],
    "h3",
    10
  );
  coordinates = createHeader(
    doc,
    "You’ve taken an important step in minimizing health risks. Below, you’ll find a personalized action plan based on your responses, your prioritized health areas and activities of interest that you selected.",
    coordinates,
    "h4",
    10
  );

  coordinates = [startingX, coordinates[1] + 10];
  const boxX = coordinates[0];
  const boxY = coordinates[1];
  const boxWidth = 45; // Width of the box
  const boxHeight = 60; // Height of the box

  coordinates = createGoalBox(
    doc,
    "??",
    "A1c",
    coordinates,
    boxWidth,
    boxHeight
  );

  coordinates = createGoalBox(
    doc,
    "??",
    "Depression",
    [coordinates[0] + boxWidth + 5, boxY],
    boxWidth,
    boxHeight
  );

  coordinates = createGoalBox(
    doc,
    "7-9 hours per night",
    "Allergies",
    [coordinates[0] + boxWidth + 5, boxY],
    boxWidth,
    boxHeight
  );

  coordinates = createGoalBox(
    doc,
    "150-300+ minutes per week",
    "Cancer",
    [coordinates[0] + boxWidth + 5, boxY],
    boxWidth,
    boxHeight
  );

  coordinates[0] = startingX; // Reset X coordinate for next section
  coordinates[1] -= 10;
  const subboxHeight = 20;

  coordinates = createGoalSubbox(
    doc,
    "Click here to find a Diabetes Prevention Program cohort.",
    coordinates,
    boxWidth,
    subboxHeight,
    "https://en.wikipedia.org/wiki/Main_Page"
  );

  coordinates = createGoalSubbox(
    doc,
    "Click here to engage with the Employee Assistance Program.",
    coordinates,
    boxWidth,
    subboxHeight,
    "https://en.wikipedia.org/wiki/Main_Page"
  );

  coordinates = createGoalSubbox(
    doc,
    "Click here to engage with the Employee Assistance Program.",
    coordinates,
    boxWidth,
    subboxHeight,
    "https://en.wikipedia.org/wiki/Main_Page"
  );

  coordinates = createGoalSubbox(
    doc,
    "Click here to schedule your Personal Training Appointment​.",
    coordinates,
    boxWidth,
    subboxHeight,
    "https://en.wikipedia.org/wiki/Main_Page"
  );

  coordinates[0] = startingX; // Reset X coordinate for next section
  coordinates[1] += 30; // Move down for the next section
  doc.setTextColor(styles.textColor);

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
    pageWidth - 10
  );

  doc.addPage();
  coordinates = [startingX, startingY];

  coordinates = createPrioritiesSectionBox(
    doc,
    "Your Priorities",
    coordinates,
    pageWidth - 10,
    100
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
  title = doc.splitTextToSize(title, 210);
  const headerStyles = styles[headerType];
  doc.setTextColor(styles.textColor);
  doc.setFontSize(headerStyles.fontSize);
  doc.setFont(headerStyles.font, headerStyles.fontStyle);
  doc.text(title, coordinates[0] / 2, coordinates[1], { align: "center" });
  coordinates[1] += coordinateHeight;
  return coordinates;
};

const createText = function (doc, text, coordinates, coordinateHeight = 6) {
  text = doc.splitTextToSize(text, 200);
  doc.setTextColor(styles.textColor);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0], coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};

const createBullet = function (doc, text, coordinates, coordinateHeight = 6) {
  text = doc.splitTextToSize("\u2022 " + text, 180);
  doc.setTextColor(styles.textColor);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0] + 5, coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};

const createGoalBox = function (doc, text, header, coordinates, width, height) {
  const headerHeight = 12; // Height for the header
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
  const textX = coordinates[0];
  const headerText = doc.splitTextToSize(header, width - 8);
  doc.setTextColor(styles.box.headerTextColor);
  doc.setFontSize(styles.box.headerFontSize);
  doc.setFont(styles.box.font, styles.box.fontStyle);
  doc.text(headerText, textX + width / 2, coordinates[1] + 8, {
    align: "center",
  });
  coordinates[1] += headerHeight; // Move down for the text

  // Add text to the box
  text = doc.splitTextToSize(`Goal: ${text}`, width - 8);
  doc.setTextColor(styles.textColor);
  doc.setFontSize(styles.box.fontSize);
  doc.setFont(styles.fontItalic, styles.fontItalicStyle);
  doc.text(text, textX + width / 2, coordinates[1] + 6, {
    align: "center",
  });

  coordinates[1] += height;
  return coordinates;
};

const createGoalSubbox = function (doc, text, coordinates, width, height, url) {
  doc.setFillColor(styles.goalSubbox.backgroundColor);
  doc.rect(coordinates[0], coordinates[1], width, height, "F");

  // Split text for wrapping
  text = doc.splitTextToSize(text, width - 8);
  // Add link if URL is provided
  // Add text to the subbox
  doc.setTextColor(styles.goalSubbox.textColor);
  doc.setFontSize(styles.goalSubbox.fontSize);
  doc.setFont(styles.goalSubbox.font, styles.goalSubbox.fontStyle);
  doc.textWithLink(text, coordinates[0] + width / 2, coordinates[1] + 5.33, {
    align: "center",
    url: url,
  });
  coordinates[0] += width + 5; // Move right for the next box

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
  doc.setTextColor(styles.textColor);
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
      doc.setTextColor(styles.textColor);
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
  doc.setTextColor(styles.textColor);
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
    [coordinates[0] + 5, coordinates[1] + 10],
    width - 10,
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
    [coordinates[0] + 5, coordinates[1]],
    width - 10,
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
    [coordinates[0] + 5, coordinates[1]],
    width - 10,
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
  doc.setFont(styles.headerFont, styles.headerFontStyle);
  doc.text(header, x + badgeW + 6, y + headerH / 2 + 1);

  // ——— Content ———
  let cursorY = y + headerH + 6;
  doc.setFont(styles.font, styles.fontStyle);
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
  doc.setFont(styles.headerFont, styles.headerFontStyle);
  doc.setFontSize(12);
  doc.text(title, originX, originY);

  // Label the columns
  doc.setFont(styles.font, styles.fontStyle);
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
    doc.setFont(styles.font, styles.fontStyle);
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
