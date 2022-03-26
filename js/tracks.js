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
window.onload = function() {
    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues; // cues list
    var cue = cues[0];
    console.log(cue);
    console.log(cue.text);
    console.log(textTrack.kind);

   /* cue.onenter = function(){
        console.log("soy la cue entrando");
       // console.log(JSON.parse(cue.text));
    };

    cue.onexit = function(){
        console.log("soy la cue saliendo");
    };*/

    textTrack.oncuechange = function (){
        var cue=textTrack.activeCues[0];
        var obj = JSON.parse(cue.text);
        // "this" is a textTrack
        console.log("active " + obj.player.name);
        document.getElementById('nombre').innerHTML= obj.player.name;
        document.getElementById('player-pic').src="resources/"+obj.player.pic;
        var cue = textTrack.activeCues[0]; // assuming there is only one active cue

        var img = document.createElement("img");
        img.src = "resources/"+obj.player.pic;
        var src = document.getElementById("players-list");
        src.appendChild(img);

       }

};

