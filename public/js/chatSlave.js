var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
const status = document.getElementById("slave-chat-status");

// ************************** MODAL *****************************
// Establecer conexión
document.getElementById("connect").addEventListener("click", join);

// Botón para pegar el portapapeles
document.getElementById('clipboard-paste').addEventListener('click', async function(){
  let text = await navigator.clipboard.readText();
  document.getElementById('master-id').value=text;
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
    status.innerHTML = '<i class="bi-exclamation-triangle"></i>&nbsp;Conexión perdida. Por favor, reconecta.';
    status.style.background='#df4759' // red color
    disableChatFunctions(true);
    console.log("Connection lost. Please reconnect");

    // Workaround for peer.reconnect deleting previous id
    peer.id = lastPeerId;
    peer._lastServerId = lastPeerId;
    peer.reconnect();
  });
  peer.on("close", function () {
    conn = null;
    status.innerHTML = '<i class="bi-exclamation-triangle"></i>&nbsp;Conexión destruida. Por favor, refresca.';
    status.style.background='#df4759' // red color
    disableChatFunctions(true);
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
    openChat();
  });
  // Handle incoming data (messages only since this is the signal sender)
  conn.on("data", function (data) {
    if (data.type == "vr") {
      const blob = new Blob(data.video, {type: 'video/mp4'});
      const url = window.URL.createObjectURL(blob);
      const video = document.createElement('video');
      video.src = url;
      addVideo(video, "received");

    }else{
      addMessage(data, "received");

    }
  });

  conn.on("close", function () {
    console.log("Connection closed");
    status.innerHTML = '<i class="bi-exclamation-triangle"></i>&nbsp;Conexión finalizada. Por favor, refresca.';
    status.style.background='#df4759' // red color
    disableChatFunctions(true);
  });
}