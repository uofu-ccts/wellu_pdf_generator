<?php

/* this page remains here for testing purposes       */
/* it is not used in the final version of the module */
/* will delete once jsPDF testing is complete        */

namespace Utah\PDFGenerator;

$user = $module->getUser();
$username = $user->getUsername();

// Handle calls from the generator page

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // $module->emDebug($_POST);

    // Parse required fields
    $pdfData    = !empty($_POST['pdfData'])     ? htmlspecialchars( $_POST['pdfData'], ENT_QUOTES) : "";
    $record_id  = !empty($_POST['record_id'])   ? htmlspecialchars( $_POST['record_id'], ENT_QUOTES) : "";
    $name       = !empty($_POST['name'])        ? htmlspecialchars( $_POST['name'], ENT_QUOTES) : "";
    $action     = !empty($_POST['action'])      ? htmlspecialchars( $_POST['action'], ENT_QUOTES) : "";

    if ($action == 'generate_pdf') {
        $module->emDebug("Generating PDF for record: " . $record_id . " with name: " . $name);
        $module->emDebug("Action: " . $action);

        $module->emDebug("PDF Data: " . $pdfData);

        $pdfFilePath = __DIR__ . '/' . $record_id . '.pdf';

        $response = $module->savePdfFile($pdfData, $pdfFilePath);
        $module->emDebug("PDF file saved to: " . $pdfFilePath);
        if ($response === false) {
            $module->emError("Failed to save PDF file.");
        } else {
            $module->emDebug("PDF file saved successfully.");
        }
        // $doc_id = $module->saveToEdocs($record_id, $doc);
        // $module->emDebug("Document ID: " . $doc_id);
    } else {
        $module->emDebug("Unknown action: " . $action);
    }
}

?>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Generator</title>
    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"> -->
    <style>
        .event-list {
            display: none;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h3>PDF Generator</h3>

    <h5>Welcome, <?php echo $username; ?>!</h5>

    <p>
        This is a test EM that generates a simple PDF file.
    </p>

    <div class="pdf-table">
        <div class="btn-group">
            <button type="button" class="btn btn-sm btn-primaryrc dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
                Select record to create PDF <span class="caret"></span>
            </button>
            <div class="dropdown-menu generate-pdf">
                <div class="dropdown-header">
                    Select a record below:
                </div>
                <div class="dropdown-divider"></div>
                <?php echo $module->getOptions(); ?>
            </div>
        </div>
    </div>

    <form id="action-form" name="action" class="hidden" method="POST"></form>
</body>

<script src="<?php echo $module->getUrl('js/config.js'); ?>"></script>

<script>
    PDF.addEventHandlers();
</script>

<!-- TODO: add $_SERVER['REQUEST_METHOD']=='POST' handler, and add more PHP in this page -->