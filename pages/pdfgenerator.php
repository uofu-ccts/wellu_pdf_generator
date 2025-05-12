<?php

namespace Utah\PDFGenerator;

$user = $module->getUser();
$username = $user->getUsername();

// Handle calls from the generator page

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $module->console_log($_POST);

    // Parse required fields
    $doc        = !empty($_POST['doc'])         ? htmlspecialchars( $_POST['doc'], ENT_QUOTES) : "";
    $record_id  = !empty($_POST['record_id'])   ? htmlspecialchars( $_POST['record_id'], ENT_QUOTES) : "";
    $name       = !empty($_POST['name'])        ? htmlspecialchars( $_POST['name'], ENT_QUOTES) : "";
    $action     = !empty($_POST['action'])      ? htmlspecialchars( $_POST['action'], ENT_QUOTES) : "";

    if ($action == 'generate_pdf') {
        $module->console_log("Generating PDF for record: " . $record_id . " with name: " . $name);
        $module->console_log("Document: " . $doc);
        $module->console_log("Action: " . $action);

        $doc_id = $module->saveToEdocs($record_id, $doc);
        $module->console_log("Document ID: " . $doc_id);
    } else {
        $module->console_log("Unknown action: " . $action);
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