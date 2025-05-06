<?php
namespace Utah\PDFGenerator;

$user = $module->getUser();
$username = $user->getUsername();

// Handle calls from the generator page

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Parse required fields
	$form_id = !empty($_POST['form_id'])  ? htmlspecialchars( $_POST['field_name'], ENT_QUOTES) : "";
	$action     = !empty($_POST['action'])      ? htmlspecialchars( $_POST['action'], ENT_QUOTES)     : "";

    // Get form information
    global $Proj;
    $module->console_log($Proj->forms);
    $module->console_log("project info after POST");

    if ($action == 'add_ema') {
        $instrument = $_POST['instrument'];
        $event_id = $_POST['event_id'];
        $event_name = $_POST['event_name'];

        $module->addEMA($instrument, $event_id, $event_name);
    } else if ($action == 'remove_ema') {
        $instrument = $_POST['instrument'];
        $event_id = $_POST['event_id'];

        $module->removeEMA($instrument, $event_id);
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

<script src="<?php echo $module->getUrl('js/jspdf.umd.min.js'); ?>"></script>
<script src="<?php echo $module->getUrl('js/config.js'); ?>"></script>

<script>
    PDF.addEventHandlers();
</script>

<script>
    // import { jsPDF } from "js/jspdf.umd.min.js";
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
</script>

<!-- TODO: add $_SERVER['REQUEST_METHOD']=='POST' handler, and add more PHP in this page -->