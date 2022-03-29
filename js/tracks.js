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

    document.getElementById('top-10-list').addEventListener('click',listGoToMinute); 
    
    function listGoToMinute(e){
        var topPlay= parseInt(e.srcElement.id.split("-")[2])-1;
        console.log("top play "+topPlay)
        myVideo.currentTime=cues[9-topPlay].startTime+0.0001;
    };


    textTrack.oncuechange = function () {
        var cue = textTrack.activeCues[0];
        var obj = JSON.parse(cue.text);
        // "this" is a textTrack
        var play_number = obj.play;
        var player_name = obj.player.name;
        
        // Update player data
        document.getElementById('player-name').innerHTML = player_name;
        document.getElementById('player-pic').src = "resources/" + obj.player.pic;
        document.getElementById('player-dob').innerHTML = obj.player.dob;
        document.getElementById('player-city').innerHTML = obj.player.city;
        document.getElementById('player-country').innerHTML =obj.player.country;
        document.getElementById('player-shirt-number').innerHTML =obj.player.number;
        document.getElementById('player-height').innerHTML =obj.player.height;
        document.getElementById('player-weight').innerHTML =obj.player.weight;
        document.getElementById('player-team').innerHTML = obj.player.team;
        document.getElementById('player-points').innerHTML = obj.player.points;
        document.getElementById('player-rebounds').innerHTML = obj.player.rebounds;
        document.getElementById('player-assists').innerHTML = obj.player.assists;
        document.getElementById('player-steals').innerHTML = obj.player.steals;
        let pTeam = String(obj.player.team);
        let sTeam = String(obj.scoreboard.home_team);
        if(pTeam.localeCompare(sTeam)){
            document.getElementById('img-player-team').src = "resources/" + obj.scoreboard.visitor_pic;
        } else {
            document.getElementById('img-player-team').src = "resources/" + obj.scoreboard.home_pic;
        }



        // Update teams data
        document.getElementById('img-home-team').src ="/resources/"+obj.scoreboard.home_pic; 
        document.getElementById('img-visitor-team').src ="/resources/"+ obj.scoreboard.visitor_pic;
        document.getElementById('home-points').innerHTML = obj.scoreboard.home_points;
        document.getElementById('visitor-points').innerHTML = obj.scoreboard.visitor_points;
        document.getElementById('home-team-name').innerHTML = obj.scoreboard.home_team;
        document.getElementById('visitor-team-name').innerHTML = obj.scoreboard.visitor_team;
        document.getElementById('match-date').innerHTML = obj.scoreboard.date;
        document.getElementById('match-type').innerHTML = obj.scoreboard.type;
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

    };

    function fillPlayersLoaded() {
        for (let index = 0; index < loaded_players.length; index++) {
            loaded_players[index] = false;
        }
    }

};

