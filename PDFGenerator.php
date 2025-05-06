<?php

namespace Utah\PDFGenerator;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;
use REDCap;

class PDFGenerator extends AbstractExternalModule {

    public $list_of_records = array();

    public function __construct() {
        parent::__construct();
    }

    // This is generally where your module's hooks will live
    function redcap_every_page_top($project_id) {
        $this->loadREDCapJS();
        $this->includeJs('js/jspdf.umd.min.js');
        (app_path_webroot+"Resources/js/Libraries/jspdf.umd.min.js");
    }

    // Get all records for this project
    function getRecords() {
        global $Proj;

        $params = array(
            'project_id' => $Proj->project_id,
            'return_format' => 'json',
            'fields' => 'record_id'
          );
        $records = json_decode(\REDCap::getData($params), true);
        $this->list_of_records = $records;
    }

    public function getOptions() {
        if (empty($this->list_of_records)) $this->getRecords();

        $this->console_log($this->list_of_records);

        $html = '';
	    foreach ($this->list_of_records as $record) {

            $this->console_log($record);

            $record_id= $record['record_id'];

	        $html .= "<a class='dropdown-item' data-record-id='$record_id' 'href='#'>" . $record_id . "</a>";
        }
        $html .= "<div class='dropdown-divider'></div>";
		$html .= "<div class='dropdown-header ema-descriptive'>Create a record to have it appear here.</div>";
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

    function loadjsPDF(){
		?>
		<script src='<?=APP_PATH_WEBROOT?>Resources/webpack/js/bundle.js'></script>
		<?php
	}

    private function includeJs($path){
        echo "<script type='text/javascript' src={$this->getUrl($path)}></script>";
        $output = "<script type=\"text/javascript\" src=\"{$js_file}\"{$async}></script>\n";
    }

    public function console_log($data) {
        $output = json_encode($data);
        echo "<script>console.log($output);</script>";
    }

}