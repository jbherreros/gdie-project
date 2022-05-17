var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;

// ************************** MODAL *****************************
// Selección modo master
document.getElementById('master').addEventListener('click', function(){
    typeChoosed=true;
    openChat();

    // Para copiar el contenido al portapapeles
    messageBox.select();
    messageBox.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(messageBox.value);
});
//***************************************************************

initializeMaster();

// Master: who generates de session key
// ***************************************************************
function initializeMaster() {
  // Create own peer object with connection to shared PeerJS server
  peer = new Peer(null, {
    debug: 2,
  });

  peer.on("open", function (id) {
    // Workaround for peer.reconnect deleting previous id
    if (peer.id === null) {
      console.log("Received null id from peer open");
      peer.id = lastPeerId;
    } else {
      lastPeerId = peer.id;
    }

    console.log("ID: " + peer.id);
    document.getElementById('message').value=peer.id;
    console.log("Awaiting connection...");
  });
  peer.on("connection", function (c) {
    // Allow only a single connection
    if (conn && conn.open) {
      c.on("open", function () {
        c.send("Already connected to another client");
        setTimeout(function () {
          c.close();
        }, 500);
      });
      return;
    }

    conn = c;
    console.log("Connected to: " + conn.peer);
    // Updating chat status
    status.innerHTML = '<i class="bi-check-circle"></i>&nbsp;Conectado';
    status.style.background='#198754'; // Green color
    messageBox.value=null;
    messageBox.disabled=false;
    sendBtn.disabled=false;
    sendVideoBtn.disabled=false;
    document.getElementById('helping-message').innerHTML=null; // delete helping message
    ready();
  });
  peer.on("disconnected", function () {
    status.innerHTML = "Connection lost. Please reconnect";
    console.log("Connection lost. Please reconnect");

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on("close", function () {
    conn = null;
    status.innerHTML = "Connection destroyed. Please refresh";
    console.log("Connection destroyed");
  });
  peer.on("error", function (err) {
    console.log(err);
    alert("" + err);
  });
}

function ready() {
  conn.on("data", function (data) {
    //console.log(data);
    if (data.type == "vr") {
      const blob = new Blob(data.video, {type: 'video/mp4'});
      const url = window.URL.createObjectURL(blob);
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      video.classList.add('video-chat');
      console.log(video);
      addVideo(video, "received");
    }else{
      console.log("texto");
      addMessage(data, "received");
    }
    /*
      var cueString = "<span class=\"cueMsg\">Cue: </span>";
      switch (data) {
          case 'Go':
              go();
              addMessage(cueString + data);
              break;
          case 'Fade':
              fade();
              addMessage(cueString + data);
              break;
          case 'Off':
              off();
              addMessage(cueString + data);
              break;
          case 'Reset':
              reset();
              addMessage(cueString + data);
              break;
          default:
              addMessage("<span class=\"peerMsg\">Peer: </span>" + data);
              break;
      };*/
  });
  conn.on("close", function () {
    status.innerHTML = "Connection reset<br>Awaiting connection...";
    conn = null;
  });
}