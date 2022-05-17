var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
const status = document.getElementById("master-chat-status");

// ************************** MODAL *****************************
// Selección modo master
document.getElementById('master').addEventListener('click', function(){
    typeChoosed=true;
    openChat();
});
// Botón copiar al portapapeles
document.getElementById('clipboard-copy-btn').addEventListener('click', function(){
    messageBox.select(); // copiaremos el código del master
    messageBox.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(messageBox.value);
    document.querySelector('.bi-files').innerHTML="&nbsp;Copiado!"
});
//***************************************************************

disableChatFunctions(true);
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
    status.style.background='#198754'; // green color
    disableChatFunctions(false); // activa las funciones del chat
    document.getElementById('helping-message').innerHTML=null; // borra helping message
    ready();
  });
  peer.on("disconnected", function () {
    status.innerHTML = '<i class="bi-exclamation-triangle"></i>&nbsp;Conexión perdida. Por favor, refresca.';
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

function ready() {
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
    status.innerHTML = '<i class="bi-exclamation-triangle"></i>&nbsp;Conexión finalizada. Esperando conexión...';
    status.style.background='#df4759' // red color
    disableChatFunctions(true);
    messageBox.value=peer.id;
    conn = null;
  });
}