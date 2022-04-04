<?php
    if(!isset($_POST['saveCueBtn'])){
        echo "no econtrado";
        header('Location: admin.html');
        die();
    } 

    $fichero = './resources/plays.vtt';
    // Abre el fichero para obtener el contenido existente
    $actual = file_get_contents($fichero);
    //Información jugador
    $player = array(
        "name" => $_POST['full-name'],
        "height" => $_POST['player-height'],
        "weight" => $_POST['player-weight'],
        "number" => $_POST['number'],
        "points" => $_POST['player-points'],
        "rebounds" => $_POST['player-rebounds'],
        "assists" => $_POST['player-assists'],
        "steals" => $_POST['player-steals'],
        "team" => $_POST['player-team'],
        "pic" => $_POST['player-pic'],
        "dob" => $_POST['dateofbirth'],
        "city" => $_POST['birth-city'],
        "country" => $_POST['nacionality']
    );
    //Información marcador
    $scoreboard = array(
        "home_team" => $_POST['local-name'],
        "visitor_team" => $_POST['visitor-name'],
        "home_pic" => $_POST['home-logo'],
        "visitor_pic" => $_POST['visitor-logo'],
        "home_points" => $_POST['local-points'],
        "visitor_points" => $_POST['visitor-points'],
        "date" => $_POST['dateofmatch'],
        "type" => $_POST['match-type-select']
    );
    //Información cola
    $cue = array(
        "player" => $player,
        "scoreboard" => $scoreboard
    );
    // Añade un nuevo JSON al fichero
    $actual .= "\n".
    $_POST['play'] ."\n". 
    $_POST['h-start-time'].' --> '.$_POST['h-end-time'] . "\n" . 
    json_encode($cue) . "\n";

    //echo $actual;
    // Escribe el contenido en el fichero
    file_put_contents($fichero, $actual);
?>