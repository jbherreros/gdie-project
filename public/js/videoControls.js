const myVideo = document.getElementById('video'); // Video
const cTime= document.getElementById('current-time'); // Shows current time value
const duration= document.getElementById('duration'); // Shows total duration value
const playBtn = document.getElementById('play-btn');
const volumeBtn = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider'); // Volume bar
const timeSlider = document.getElementById('time-slider'); // Time bar
const fullScreenBtn = document.getElementById('full-screen-btn'); // Full screen
const settingsBtn = document.getElementById('settings-btn'); // Settings
const reactionBtn = document.getElementById('reaction-btn'); // Monkey btn
const quality360pBtn = document.getElementById('q-360p');
var movingTimeSlider = false;

myVideo.addEventListener('dblclick', playPause);
myVideo.addEventListener('ended', videoLoad);
playBtn.addEventListener('click', playPause);
volumeBtn.addEventListener('click', muteUnMuteAudio);
volumeSlider.addEventListener('change', adjustAudio);
timeSlider.addEventListener('change', reproduceMinute);
timeSlider.addEventListener('mousedown', mouseDownF);
timeSlider.addEventListener('mouseup', mouseUpF);
fullScreenBtn.addEventListener('click', fullScreen);
settingsBtn.addEventListener('click', settings);

document.__defineGetter__("cookie", function() { return '';} );
document.__defineSetter__("cookie", function() {} );

/*
(function(){
    var url = "./videos/dash/manifest.mpd";
    var player = dashjs.MediaPlayer().create();
    player.initialize(myVideo, url, false);
})();
*/

if (myVideo.paused){
    playBtn.innerHTML='<i class="bi-play-fill"></i>';
} else {
    playBtn.innerHTML='<i class="bi-pause-fill"></i>';
}

function videoLoad(){
    myVideo.load();
    playBtn.innerHTML='<i class="bi-play-fill"></i>';
}

function getCurrentTime(){
    let min =Math.trunc(myVideo.currentTime / 60);
    let sec= Math.trunc(myVideo.currentTime % 60);
    if (sec<10){
        cTime.innerHTML = min +":0"+sec;
    } else {
        cTime.innerHTML = min +":"+sec;
    }
}

function playPause(){
    console.log("playpause")
    var time= Math.trunc(myVideo.duration / 60)+ ":"+ Math.trunc(myVideo.duration % 60);
    duration.innerHTML= time;
    
    if (myVideo.paused){
        myVideo.play();
        playBtn.innerHTML='<i class="bi-pause-fill"></i>';
    } else {
        myVideo.pause();
        playBtn.innerHTML='<i class="bi-play-fill"></i>';
    }
}

function muteUnMuteAudio(){
    if(!myVideo.muted){  
        myVideo.muted=true;
        volumeBtn.innerHTML='<i class="bi-volume-mute-fill"></i>';

    } else {
        myVideo.muted=false;
        volumeBtn.innerHTML='<i class="bi-volume-up-fill"></i>';
    }
}

function adjustAudio(){
    myVideo.volume=volumeSlider.value;
    if (volumeSlider.value==0){
        volumeBtn.innerHTML='<i class="bi-volume-mute-fill"></i>';
    } else {
        volumeBtn.innerHTML='<i class="bi-volume-up-fill"></i>';
    }
}

function reproduceMinute(){
    console.log(timeSlider.value);
    myVideo.currentTime=timeSlider.value;
    if(!myVideo.paused) myVideo.play();
}

function mouseDownF(){
    console.log("pressing down");
    movingTimeSlider = true;
}

function mouseUpF(){
    console.log("releasing");
    movingTimeSlider = false;
}

function fullScreen(){
    console.log("funciona fullscreen");
    myVideo.requestFullscreen();
}

function settings(){
    console.log("settings");
}

myVideo.ontimeupdate = function() {
    // Actualizamos current time
    getCurrentTime();
    var posicion = myVideo.currentTime; // posicion actual 
    var max = myVideo.duration; // duracion maxima del video
    
    // poner valores en los atributos del input range 
    // para usar como barra de progreso
    if(!movingTimeSlider){
        timeSlider.setAttribute("max", max);
        timeSlider.value = posicion;
    }
};