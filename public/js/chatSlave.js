var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;

// ************************** MODAL *****************************
// Establecer conexión
document.getElementById("connect").addEventListener("click", join);

// Botón para pegar el portapapeles
document.getElementById('clipboard-paste').addEventListener('click', function(){
  // ¿?¿?¿?
});
//***************************************************************

initializeSlave();

// Slave: who connects to the session
// ***************************************************************
function initializeSlave() {
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
  });
  peer.on("connection", function (c) {
    // Disallow incoming connections
    c.on("open", function () {
      c.send("Sender does not accept incoming connections");
      setTimeout(function () {
        c.close();
      }, 500);
    });
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

function join() {
  // Close old connection
  if (conn) {
    conn.close();
  }

  // Create connection to destination peer specified in the input field
  conn = peer.connect(document.getElementById("master-id").value, {
    reliable: true,
  });

  conn.on("open", function () {
    console.log("Connected to: " + conn.peer);
    typeChoosed = true;
    document.getElementById("pop-chat").style.display = "block";
  });
  // Handle incoming data (messages only since this is the signal sender)
  conn.on("data", function (data) {
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
  });
  conn.on("close", function () {
    console.log("Connection closed");
  });
}