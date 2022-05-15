var lastPeerId = null;
var peer = null; // Own peer object
var peerId = null;
var conn = null;
document.getElementById("open-chat-btn").addEventListener("click", openChat); // Open chat
document.getElementById("close-chat-btn").addEventListener("click", closeChat); // To close the pop up chat
const messageBox=document.getElementById('message');
const chatBox=document.getElementById('chatBox');
const status=document.getElementById('master-chat-status');
const sendBtn = document.getElementById('send-message');
const sendVideoBtn = document.getElementById('send-video');
const messageList = document.getElementById('chat-list');

document.getElementById("connect").addEventListener("click", join);

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
  }
}

function closeChat() {
  document.getElementById("pop-chat").style.display = "none";
  document.getElementById("open-chat-btn").style.display = "block";
}

messageBox.addEventListener('keypress', function(e){
  if (messageBox.value == "") return;

  var event = e || window.event;
  var char = event.which || event.keyCode;
  if (char == '13')
      sendBtn.click();
});

document.getElementById("send-message").addEventListener("click", function () {
  conn.send(messageBox.value);
  console.log(messageBox.value)
  addMessage(messageBox.value, "sent");
  messageBox.value=null;
  console.log(chatBox.scrollHeight)
  chatBox.scrollTop = chatBox.scrollHeight;
});

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
    addMessage(data, "received");
  });
  conn.on("close", function () {
    console.log("Connection closed");
  });
}

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
  info = "("+h + ":" + m + ":" + s + "): " + msg;

  var node = document.createElement('li');
  node.classList.add("message-"+type+"");
  node.appendChild(document.createTextNode(info));
  messageList.appendChild(node);

  if(type=="received"){
    var audio = new Audio('./resources/message-notification.mp3');
    audio.play();
  }

  console.log(chatBox.scrollHeight)
  chatBox.scrollTop = chatBox.scrollHeight;

  console.log(info);
}
