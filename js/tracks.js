/*
window.addEventListener('DOMContentLoaded', (event) => {
    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues; // cues list
    var cue = cues[0];
    console.log(cues[0]);
    console.log(cue.text);
    console.log(textTrack.kind);
});
*/
//Deja de funcionar en Chrome cuando se recarga la página después de haber cargado inmediatamente la página
window.onload = function () {
    const plays_number = 10;
    var loaded_players = new Array(plays_number);
    var active_play = 10;

    fillPlayersLoaded();

    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues; // cues list
    var cue = cues[0];
    //console.log(cue);
    //console.log(cue.text);
    //console.log(textTrack.kind);

    /* cue.onenter = function(){
         console.log("soy la cue entrando");
        // console.log(JSON.parse(cue.text));
     };
 
     cue.onexit = function(){
         console.log("soy la cue saliendo");
     };*/
    console.log(loaded_players);

    textTrack.oncuechange = function () {
        var cue = textTrack.activeCues[0];
        var obj = JSON.parse(cue.text);
        // "this" is a textTrack
        var play_number = obj.play;
        var player_name = obj.player.name;
        document.getElementById('nombre').innerHTML = player_name;
        document.getElementById('player-pic').src = "resources/" + obj.player.pic;
        //var cue = textTrack.activeCues[0]; // assuming there is only one active cue

        //Actualiza la lista de jugadores
        if (!loaded_players[play_number - 1]) {
            //var img = document.createElement("img");
            //img.src = "resources/" + obj.player.pic;
            //var src = document.getElementById("play-" + obj.play);
            //src.appendChild(img);

            //Actualiza la imagen
            var img = document.getElementById("play-" + play_number).children[0];
            img.src="./resources/" + obj.player.pic;

            //Introduce el nombre del jugador
            var cb = document.getElementById("play-" + play_number).children[1];
            var player_name_tag = document.createElement("p");
            player_name_tag.className = "card-text";
            player_name_tag.innerHTML = player_name;
            //Puede ser que no funcione en Internet Explorer
            cb.appendChild(player_name_tag);
            loaded_players[play_number - 1] = true;
        }

        //Hacemos el scroll al jugador que realiza la jugada
        //document.getElementById("players-list").scrollTop = (play_number - 1) * 200;

        //Actualizar lista de jugadas
        document.getElementById("btn-play-" + active_play).classList.remove("active");
        document.getElementById("btn-play-" + play_number).classList.add("active");
        active_play = play_number;

    }

    function fillPlayersLoaded() {
        for (let index = 0; index < loaded_players.length; index++) {
            loaded_players[index] = false;
        }
    }

};

