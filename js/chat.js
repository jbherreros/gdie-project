document.getElementById('close-chat-btn').addEventListener('click', closeChat); // To close the pop up chat  
document.getElementById('open-chat-btn').addEventListener('click', openChat); // Open chat

function closeChat(){
    document.getElementById('pop-chat').style.display='none';
    document.getElementById('open-chat-btn').style.display='block';

}

function openChat(){
    console.log("abre chat");
    document.getElementById('pop-chat').style.display='block';
    document.getElementById('open-chat-btn').style.display='none';
}

let mediaRecorder;
let recordedBlobs;

const activarCamara = document.querySelector('button#start');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === 'Start Recording') {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = 'Start Recording';
      playButton.disabled = false;
      downloadButton.disabled = false;
      codecPreferences.disabled = false;
    }
});

function handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

function startRecording() {
    recordedBlobs = [];
    const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
    const options = {mimeType};
  
    try {
      mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      alert(`Exception while creating MediaRecorder: ${JSON.stringify(e)}`);
      return;
    }
  
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    downloadButton.disabled = true;
    codecPreferences.disabled = true;
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
