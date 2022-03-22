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
    console.log(cues[0]);
    console.log(cue.text);
    console.log(textTrack.kind);
};