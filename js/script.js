const playbtn = document.getElementById('play-btn')
const video = document.getElementById('video')

playbtn.addEventListener('click', playPause);
video.addEventListener('click', playPause);

function playPause(){
    if (video.paused){
        video.play();
        playbtn.innerHTML='<i class="bi-pause-fill">';
    } else {
        video.pause();
        playbtn.innerHTML='<i class="bi-play-fill">';
    }
}