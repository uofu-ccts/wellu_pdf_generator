// CREATE PDF GENERATOR OBJECT
if(typeof PDF === 'undefined') { var PDF = {}; }

//TODO: also add POST javascript method to call on config.php page
PDF.post = function(action, form_id) {
    // console.log("Creating " + field_name);
    var action = $('<input>')
        .attr('name','action')
        .val(action);
    var form_id = $('<input>')
        .attr('name','form_id')
        .val(form_id);
    var form = $('#action-form').append(action).append(form_id).submit();
};

//TODO: create event handler for config.php page

PDF.addEventHandlers = function() {
    // Handle the ADD button
    $('.generate-pdf a').on('click', function() {
        PDF.generatePDF();
    });
}

PDF.generatePDF = function() {
    // Default export is a4 paper, portrait, using millimeters for units
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
}