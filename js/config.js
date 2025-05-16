// CREATE PDF GENERATOR OBJECT
if(typeof PDF === 'undefined') { var PDF = {}; }

PDF.post = function(action, pdfData, record_id, name) {
    // console.log("Creating " + field_name);
    var action = $('<input>')
        .attr('name','action')
        .val(action);
    var pdfData = $('<input>')
        .attr('name','pdfData')
        .val(pdfData);
    var record_id = $('<input>')
        .attr('name','record_id')
        .val(record_id);
    var name = $('<input>')
        .attr('name','name')
        .val(name);
    var form = $('#action-form').append(action).append(pdfData).append(record_id).append(name).submit();
};

PDF.addEventHandlers = function() {
    // Handle the ADD button
    $('.generate-pdf').on('click', function() {
        console.log("Button was clicked");
        var record_id = $(this).attr("data-record-id");
        var name = $(this).attr("data-name");

        PDF.generatePDF(record_id, name);
    });
}

PDF.generatePDF = function(record_id, name) {
    // Default export is a4 paper, portrait, using millimeters for units
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.text("This PDF was generated for " + name, 10, 20);
    doc.text("Record ID: " + record_id, 10, 30);

    // doc.save("test" + record_id + ".pdf");
    doc.output('dataurlnewwindow');
    const pdfData = doc.output('datauristring');

    // console.log("PDF output from client:", pdfData);

    PDF.post("generate_pdf", pdfData, record_id, name);
}
