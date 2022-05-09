let myid;
document.getElementById('close-chat-btn').addEventListener('click', closeChat); // To close the pop up chat  
document.getElementById('open-chat-btn').addEventListener('click', openChat); // Open chat
const enviarVideoBtn = document.getElementById('e-v-btn').addEventListener('click', estConexion);
var peer = new Peer();

var otro;

var socket = io();
/*socket.on('chat message', function(msg){
    if (msg.userid != myid) {
        console.log("Usuario conectado: " + msg);
        otro = msg;
    }
});
*/

var conn = null;

function estConexion(){
    conn = peer.connect(document.getElementById('usuario').value);
    conn.on('open', function() {
        // Send messages
        console.log("Enviando..");
        conn.send('Hello!');
    });
}

        // Receive messages
        if (conn) {
            conn.on('data', function(data) {
                console.log('Received', data);
              });
        }

peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
    myid = id;
    socket.emit('chat message', id);  
});

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
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');

const textRecordButton = 'Grabar';

recordButton.addEventListener('click', () => {
    if (recordButton.textContent === textRecordButton) {
      startRecording();
    } else {
      stopRecording();
      recordButton.textContent = textRecordButton;
      playButton.disabled = false;
      downloadButton.disabled = false;
      codecPreferences.disabled = false;
    }
});

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
    recordButton.textContent = 'Stop Recording';
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