let mediaRecorder;
let recordedBlobs;

const activarCamara = document.querySelector('button#start');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');

recordButton.addEventListener('click', () => {
    if (recordButton.innerHTML == '<i class="bi-record-circle"></i>') {
      startRecording();
    } else {
      stopRecording();
      recordButton.innerHTML = '<i class="bi-record-circle"></i>';
      playButton.disabled = false;
      downloadButton.disabled = false;
      //codecPreferences.disabled = false;
    }
});// hjp

playButton.addEventListener('click', () => {
    const superBuffer = new Blob(recordedBlobs, {});
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  });

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
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
      console.error('Exception while creating MediaRecorder:', e);
      alert(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
      return;
    }
  
    console.log('Created MediaRecorder', mediaRecorder);
    recordButton.innerHTML = '<i class="bi-stop-fill"></i>';
    playButton.disabled = true;
    downloadButton.disabled = true;
    mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', recordedBlobs);
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    console.log('MediaRecorder started', mediaRecorder);
  }
  
  function stopRecording() {
    mediaRecorder.stop();
  }

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream:', stream);
    window.stream = stream;
    
    const gumVideo = document.querySelector('video#gum');
    gumVideo.srcObject = stream;

    console.log("Todo fue bien!");
  }

async function init(constraints) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      handleSuccess(stream);
    } catch (e) {
      console.error('navigator.getUserMedia error:', e);
      alert(`navigator.getUserMedia error:${e.toString()}`);
    }
  }
  
//Activamos la cámara
activarCamara.addEventListener('click', async () => {
    document.querySelector('button#start').disabled = true;
    const constraints = {
      video: {
        width: 1280, height: 720
      }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
  });