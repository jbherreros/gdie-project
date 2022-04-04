<?php
    header("Content-Type: application/json; charset=utf-8");
    $data = file_get_contents("php://input");
    if (!$data) {
        echo "No se han enviado datos";
    }else{
        // build a PHP variable from JSON sent using POST method
        $v = json_decode(stripslashes($data));

        $file_content = "WEBVTT FILE\n\n";
        //var_dump($v);
        foreach($v as $cue) {
            //var_dump($cue->text);
            $file_content .= $cue->id . "\n" .
            $cue->time . "\n" . 
            json_encode($cue->text, JSON_UNESCAPED_UNICODE) . "\n\n" ;
        }
        $file = './resources/plays.vtt';
        $result = file_put_contents($file, $file_content);
        if (!$result) {
            echo 'No se escribió con éxito';
        }else{
            echo 'Se escribió con éxito';
        }   
    }

?>