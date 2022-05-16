var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
var nNotification = 0; // contador de notificaciones recibidas
document.getElementById("open-chat-btn").addEventListener("click", openChat); // Open chat
document.getElementById("close-chat-btn").addEventListener("click", closeChat); // To close the pop up chat
const status = document.getElementById("master-chat-status");
const messageBox = document.getElementById("message");
const sendBtn = document.getElementById("send-message");
const sendVideoBtn = document.getElementById("send-video");
const messageList = document.getElementById("chat-list");
const notification = document.getElementById("chat-notification");

var typeChoosed = false;
function openChat() {
  if (!typeChoosed) {
    // Si es la primera vez, mostrará el modal para seleccionar el modo de conexión con el chat
    $(document).ready(function () {
      $("#firstModal").modal("show");
    });
  } else {
    console.log("abre chat");
    document.getElementById("pop-chat").style.display = "block";
    document.getElementById("open-chat-btn").style.display = "none";
    nNotification = 0;
  }
}

function closeChat() {
  document.getElementById("pop-chat").style.display = "none";
  document.getElementById("open-chat-btn").style.display = "block";
  notification.style.display = "none";
}

document.getElementById("master").addEventListener("click", function () {
  typeChoosed = true;
  document.getElementById("pop-chat").style.display = "block";
  document.getElementById("open-chat-btn").style.display =
    "none"; /* For mobile devices */
});

document
  .getElementById("clipboard-copy-btn")
  .addEventListener("click", function () {
    // Para copiar el contenido al portapapeles
    messageBox.select();
    messageBox.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(messageBox.value);
    document.getElementById('helping-message').append("\n"+"Copiado");
  });

messageBox.addEventListener("keypress", function (e) {
  if (messageBox.value == "") return;
  var event = e || window.event;
  var char = event.which || event.keyCode;
  if (char == "13") sendBtn.click();
});

document.getElementById("send-message").addEventListener("click", function () {
  conn.send(messageBox.value);
  addMessage(messageBox.value, "sent");
  messageBox.value = null;
});

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
    document.getElementById("message").value = peer.id;
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
    status.innerHTML = '<i class="bi-check-circle"></i>&nbsp;Conectado'; // conexión establecida y color verde
    status.style.background = "#198754";
    messageBox.value = null; // vacíamos el contenido de la caja de mensajes
    messageBox.disabled = false; // quitamos el disable de los botones, ahora disponibles
    sendBtn.disabled = false;
    sendVideoBtn.disabled = false;
    document.getElementById("helping-message").style.display = "none"; // mensaje de ayuda para establecer conexion
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
    addMessage(data, "received");
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

// type can be sent or received
function addMessage(msg, type) {
  var now = new Date();
  var h = now.getHours();
  var m = addZero(now.getMinutes());
  var s = addZero(now.getSeconds());

  if (h > 12) h -= 12;
  else if (h === 0) h = 12;

  function addZero(t) {
    if (t < 10) t = "0" + t;
    return t;
  }

  info = msg+' <a class="message-time">'+h+':'+m+':'+s+'</a>';

  var node = document.createElement("li");
  node.classList.add("message-" + type + "");
  node.innerHTML=info;
  messageList.appendChild(node);

  if (type == "received") {
    var audio = new Audio("./resources/message-notification.mp3");
    audio.play();
  }

  chatBox.scrollTop = chatBox.scrollHeight;

  if (document.getElementById("pop-chat").style.display == "none") {
    // si al recibir un mensaje no tenemos abierta la caja de mensajes, aparece una notificación
    notification.style.display = "inline";
    nNotification++;
    notification.innerHTML = nNotification;
  }

  console.log(info);
}
