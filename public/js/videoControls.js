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
const qualitySettings = document.getElementById('quality-settings'); // List of resolutions (360p, 480p, 720p, 1080p or Auto)
var movingTimeSlider = false;
var currentResolution = "manifest"; // Default resolution (auto)

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

/*if (Hls.isSupported()) {
    console.log("HLS is available");
    var hls = new Hls();
    hls.loadSource("./videos/hls/manifest.m3u8");
    hls.attachMedia(myVideo);
}else{*/
    console.log("MPEG-DASH is available");
    var url = "./videos/dash/manifest.mpd";
    var player = dashjs.MediaPlayer().create();
    player.initialize(myVideo, url, false);

    
//}

qualitySettings.addEventListener('click', function (e) {
    let pressed = e.target;
    error=false;

    var bitrates = player.getBitrateInfoListFor("video");
    console.log('Bitrates available:' + bitrates.length);
    console.log(bitrates[0])
    console.log(bitrates[1])
    console.log(bitrates[2])
    console.log(bitrates[3])

    let settingsp = player.getSettings();
    settingsp.streaming.abr.autoSwitchBitrate = false;

    switch (pressed.id) {
        case "1080p":
            player.setQualityFor("video", bitrates[3].qualityIndex);
            break;
        case "720p":
            player.setQualityFor("video", bitrates[2].qualityIndex);
            break;
        case "480p":
            player.setQualityFor("video", bitrates[1].qualityIndex);
            break;
        case "360p":
            player.setQualityFor("video", bitrates[0].qualityIndex);
            break;
        case "manifest":
            settingsp.streaming.abr.autoSwitchBitrate = true;
            break;
        default:
            error=true;
            break;
    }

    if(!error){
        pressed.classList.add('disabled');
        document.getElementById(currentResolution).classList.remove('disabled');
        currentResolution=pressed.id;
    }

    /*switch (pressed.id) {
        case "1080p":
            hls.currentLevel=3;
            break;
        case "720p":
            hls.currentLevel=2;
            break;
        case "480p":
            hls.currentLevel=1;
            break;
        case "360p":
            hls.currentLevel=0;
            break;
        case "manifest":
            hls.currentLevel=-1;
            break;
        default:
            error=true;
            break;
    }
    console.log(error)
    if(!error){
        pressed.classList.add('disabled');
        document.getElementById(currentResolution).classList.remove('disabled');
        currentResolution=pressed.id;
    }*/

});

if (myVideo.paused){
    playBtn.innerHTML='<i class="bi-play-fill"></i>';
} else {
    playBtn.innerHTML='<i class="bi-pause-fill"></i>';
}

function videoLoad(){
    //myVideo.load();
    myVideo.currentTime=0;
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