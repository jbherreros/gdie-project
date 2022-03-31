<?php
    if(!isset($_POST['saveCueBtn'])){
        echo "no econtrado";
        header('Location: admin.html');
        die();
    } 

    $fichero = './resources/plays.vtt';
    // Abre el fichero para obtener el contenido existente
    $actual = file_get_contents($fichero);

    // Añade un nuevo JSON al fichero
    $actual .= PHP_EOL.PHP_EOL.'chapter-'.$_POST['h-chapter'].'
    '.$_POST['h-start-time'].' --> '.$_POST['h-end-time'].'
    {
    "play": "'.$_POST['play'].'",
    "player": {
        "name": "'.$_POST['full-name'].'",
        "height": "'.$_POST['player-height'].'",
        "weight": "'.$_POST['player-weight'].'",
        "number": "'.$_POST['number'].'",
        "points": '.$_POST['player-points'].',
        "rebounds": '.$_POST['player-rebounds'].',
        "assists": '.$_POST['player-assists'].',
        "steals": '.$_POST['player-steals'].',
        "team": "'.$_POST['player-team'].'",
        "pic": "'.$_POST['player-pic'].'",
        "dob": "'.$_POST['dateofbirth'].'",
        "city": "'.$_POST['birth-city'].'",
        "country": "'.$_POST['nacionality'].'"
    },
    "scoreboard": {
        "home_team": "'.$_POST['local-name'].'",
        "visitor_team": "'.$_POST['visitor-name'].'",
        "home_pic": "'.$_POST['home-logo'].'",
        "visitor_pic": "'.$_POST['visitor-logo'].'",
        "home_points": '.$_POST['local-points'].',
        "visitor_points": '.$_POST['visitor-points'].',
        "date": "'.$_POST['dateofmatch'].'",
        "type": "'.$_POST['match-type-select'].'"
    }
    }'.PHP_EOL;

    echo $actual;
    // Escribe el contenido en el fichero
    file_put_contents($fichero, $actual);
?>
<!--<script>window.location.href = "./admin.html";</script>-->