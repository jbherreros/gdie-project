let mediaRecorder;
let recordedBlobs;

const activarCamara = document.querySelector("button#start");
const recordedVideo = document.querySelector("video#recorded");
const recordButton = document.querySelector("button#record");
const playButton = document.querySelector("button#play");

recordButton.addEventListener("click", () => {
  if (recordButton.innerHTML == '<i class="bi-record-circle"></i>') {
    startRecording();
  } else {
    stopRecording();
    recordButton.innerHTML = '<i class="bi-record-circle"></i>';
    playButton.disabled = false;
  }
}); // hjp

playButton.addEventListener("click", () => {
  const superBuffer = new Blob(recordedBlobs, {});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
  console.log(recordedVideo);
});

function handleDataAvailable(event) {
  console.log("handleDataAvailable", event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
    console.log(recordedBlobs);
  }
}

function startRecording() {
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(window.stream, {});
  } catch (e) {
    console.error("Exception while creating MediaRecorder:", e);
    alert(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
    return;
  }

  console.log("Created MediaRecorder", mediaRecorder);
  recordButton.innerHTML = '<i class="bi-stop-fill"></i>';
  playButton.disabled = true;
  activarCamara.disabled=true;
  mediaRecorder.onstop = (event) => {
    console.log("Recorder stopped: ", event);
    console.log("Recorded Blobs: ", recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log("MediaRecorder started", mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  activarCamara.disabled=false;
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log("getUserMedia() got stream:", stream);
  window.stream = stream;

  const gumVideo = document.querySelector("video#gum");
  gumVideo.srcObject = stream;

  console.log("Todo fue bien!");
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    handleSuccess(stream);
  } catch (e) {
    console.error("navigator.getUserMedia error:", e);
    alert(`navigator.getUserMedia error:${e.toString()}`);
  }
}

//Activamos la cámara
let cameraActive = false;
activarCamara.addEventListener("click", async () => {
  if(cameraActive){
    document.querySelector("button#start").innerHTML='<i class="bi-camera-video-off"></i>'
    this.stream.getVideoTracks()[0].stop();
    recordButton.disabled=true;
    cameraActive=false;

  } else {
    document.querySelector("button#start").innerHTML='<i class="bi-camera-video"></i>'
    cameraActive=true;
    const constraints = {
      video: {
        width: 1280,
        height: 720,
      },
    };
    console.log("Using media constraints:", constraints);
    await init(constraints);
  }
});
