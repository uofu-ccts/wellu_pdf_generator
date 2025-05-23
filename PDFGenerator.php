<?php

namespace Utah\PDFGenerator;

use \REDCap as REDCap;

class PDFGenerator extends \ExternalModules\AbstractExternalModule {
    public $project_id = null;
    public $list_of_records = array();

    public function __construct() {
        parent::__construct();
    }

    // This is generally where your module's hooks will live
    function redcap_every_page_top($project_id) {
        $this->project_id = $project_id;
    }

    function redcap_survey_page($project_id, $record, $instrument) {
        if ($instrument == 'pdf_placeholder') {
            echo $this->renderDownloadButton($record);
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            // Parse required fields
            $pdfData    = !empty($_POST['pdfData'])     ? htmlspecialchars( $_POST['pdfData'], ENT_QUOTES) : "";
            $record_id  = !empty($_POST['record_id'])   ? htmlspecialchars( $_POST['record_id'], ENT_QUOTES) : "";
            $name       = !empty($_POST['name'])        ? htmlspecialchars( $_POST['name'], ENT_QUOTES) : "";
            $action     = !empty($_POST['action'])      ? htmlspecialchars( $_POST['action'], ENT_QUOTES) : "";

            if ($action == 'generate_pdf') {
                $this->console_log("Generating PDF for record: " . $record_id . " with name: " . $name);
                $this->console_log("Action: " . $action);

                $this->console_log("PDF Data: " . $pdfData);

                $pdfFilePath = __DIR__ . '/generated_pdfs' . '/' . $record_id . '.pdf';

                $response = $this->savePdfFile($pdfData, $pdfFilePath);
                $this->console_log("PDF file saved to: " . $pdfFilePath);
                if ($response === false) {
                    $this->console_log("Failed to save PDF file.");
                } else {
                    $this->console_log("PDF file saved successfully.");
                }
            } else {
                $this->console_log("Unknown action: " . $action);
            }
        }
    }

    function renderDownloadButton($record_id) {
        $jsUrl = $this->getUrl('js/config.js');

        $record = $this->getCurrentRecordData($record_id);

        $name = $record[0]['first_name'] . " " . $record[0]['last_name'];
        global $Proj;
        $projJson = json_encode($Proj);

        $html  = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>';
        $html .= '<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>';
        $html .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.6/purify.min.js"></script>';
        $html .= "<button type='button' class='btn btn-primary generate-pdf' data-record-id='$record_id' data-name='$name'>Download PDF</button>";
        $html .= "<form id='action-form' name='action' class='hidden' method='POST'></form>";
        $html .= "<script src='$jsUrl'></script>";
        $html .= "<script>PDF.addEventHandlers($projJson);</script>";

        return $html;
    }

    function getCurrentRecordData($record_id) {
        $params = array(
            'project_id' => $this->project_id,
            'records' => $record_id,
            'return_format' => 'json',
            // 'fields' => 'record_id'
          );
        $record = json_decode(\REDCap::getData($params), true);
        return $record;
    }

    function savePdfFile($base64Data, $filePath) {
        // Extract the base64 part (remove the data:application/pdf;base64, prefix)
        $base64Data = preg_replace('/^data:application\/pdf;filename=generated.pdf;base64,/', '', $base64Data);

        // Decode the base64 string
        $pdfContent = base64_decode($base64Data);

        // Save to file
        return file_put_contents($filePath, $pdfContent);
    }

    // Save PDF to REDCap edocs
    public function saveToEdocs($filePath) {
        $doc_id = \REDCap::storeFile($filePath, $this->project_id);
        return json_decode($doc_id, true);
    }

    // TODO: Save PDF (with docid) to file field
    // TODO: Have EM triggered by survey completion
    // TODO: Set up emailing of PDF to user after generation

    public function console_log($data, $level = 'INFO') {
        $output = json_encode($data);
        echo "<script>console.log($output);</script>";

        $this->simple_log($output, $level);
    }

    public function simple_log($message, $level = 'INFO') {
        $logFile = __DIR__ . '/pdf_generator_log.txt';
        $timestamp = date('Y-m-d H:i:s');
        $formattedMessage = "[$timestamp][$level] $message\n";
        file_put_contents($logFile, $formattedMessage, FILE_APPEND);
    }

    /* methods below are needed for the page/pdfgenerator.php page to work */
    /* will delete once jsPDF testing is complete                          */

    // Get all records for this project
    function getRecords() {
        $params = array(
            'project_id' => $this->project_id,
            'return_format' => 'json',
            // 'fields' => 'record_id'
          );
        $records = json_decode(\REDCap::getData($params), true);
        $this->list_of_records = $records;
    }

    public function getOptions() {
        if (empty($this->list_of_records)) $this->getRecords();

        $html = '';
	    foreach ($this->list_of_records as $record) {

            $record_id= $record['record_id'];
            $name = $record['name'];

	        $html .= "<a class='dropdown-item' data-record-id='$record_id' data-name='$name' href='#'>" . $record_id . "</a>";
        }
        $html .= "<div class='dropdown-divider'></div>";
		$html .= "<div class='dropdown-header pdf-descriptive'>Create a record to have it appear here.</div>";
        return $html;
    }

    function returnProcessedString($string) {
        $length = 50;

        $string = strip_tags2($string);
        if (strlen($string) > $length) {
            $string = substr($string,0,$length) . "...";
        }
        $string = preg_replace('/[\n\r]+/', " ", $string);
        return $string;
    }

    private function includeJs($path){
        echo "<script type='text/javascript' src={$this->getUrl($path)}></script>";
    }

}