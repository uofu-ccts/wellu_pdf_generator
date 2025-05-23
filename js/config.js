// CREATE PDF GENERATOR OBJECT
if (typeof PDF === "undefined") {
  var PDF = {};
}

var proj;

const styles = {
  font: "helvetica",
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
};

PDF.post = function (action, pdfData, record_id, name) {
  // console.log("Creating " + field_name);
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

PDF.addEventHandlers = function (projData) {
  // Handle the ADD button
  proj = projData;
  console.log("proj: ", proj.metadata.risk_key.element_label);
  $(".generate-pdf").on("click", function () {
    var record_id = $(this).attr("data-record-id");
    var name = $(this).attr("data-name");

    PDF.generatePDF(record_id, name);
  });
};

PDF.generatePDF = async function (record_id, name) {
  // Default export is a4 paper, portrait, using millimeters for units
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let coordinates = [10, 10];

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
  coordinates = createText(doc, "Next steps:", coordinates, 5);
  coordinates = createText(
    doc,
    "1. Please take your time and review your personalized action plan.",
    coordinates
  );
  coordinates = createBullet(
    doc,
    "All recommendations are based off of your specific health profile identified from your responses on the HRA.",
    [coordinates[0], coordinates[1]]
  );
  coordinates = createText(
    doc,
    "2. If you have indicated that you wanted help connecting with a provider or employee assistance program, you will be contacted to schedule an appointment.",
    coordinates
  );
  coordinates = createText(
    doc,
    "3. Please use the links included in your action plan to register or learn more about any of the recommended programs and services.",
    coordinates
  );
  coordinates = createText(
    doc,
    "Additionally, you chose not to enroll in a Tailored Care Pathway, if you change your mind and want some help creating a custom health and well-being plan, please contact us at wellness@utah.edu.",
    coordinates
  );

  coordinates = [coordinates[0], coordinates[1] + 5];

  coordinates = createHeader(
    doc,
    name + "'s WellU Action Plan:",
    coordinates,
    "h2",
    20
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
  doc.setFontSize(headerStyles.fontSize);
  doc.text(title, coordinates[0], coordinates[1]);
  coordinates[1] += coordinateHeight;
  return coordinates;
};

const createText = function (doc, text, coordinates, coordinateHeight = 6) {
  console.log("text: ", text);
  text = doc.splitTextToSize(text, 180);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0], coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};

const createBullet = function (doc, text, coordinates, coordinateHeight = 6) {
  text = doc.splitTextToSize("\u2022 " + text, 160);
  doc.setFontSize(styles.p.fontSize);
  doc.setFont(styles.font, styles.p.fontStyle);
  doc.text(text, coordinates[0] + 10, coordinates[1]);
  coordinates[1] += coordinateHeight * text.length;
  return coordinates;
};
