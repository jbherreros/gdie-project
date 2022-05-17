var nNotification = 0; // contador de notificaciones recibidas
document.getElementById("open-chat-btn").addEventListener("click", openChat); // Open chat
document.getElementById("close-chat-btn").addEventListener("click", closeChat); // To close the pop up chat
const status = document.getElementById("master-chat-status");
const chatBox = document.getElementById("chatBox");
const messageBox = document.getElementById("message");
const sendBtn = document.getElementById("send-message");
const sendVideoBtn = document.getElementById("send-video");
const messageList = document.getElementById("chat-list");
const notification = document.getElementById("chat-notification");
const audio = new Audio("./resources/message-notification.mp3");

// Abrir ventana de chat
var typeChoosed = false;
function openChat() {
  if (!typeChoosed) {
    // Si es la primera vez, mostrará el modal para seleccionar el modo de conexión con el chat
    $(document).ready(function () {
      $("#firstModal").modal("show");
    });

  } else {
    document.getElementById("pop-chat").style.display = "block";
    document.getElementById("open-chat-btn").style.display = "none";
  }
}

// Cerrar ventana de chat
function closeChat() {
  document.getElementById("pop-chat").style.display = "none";
  document.getElementById("open-chat-btn").style.display = "block";
  nNotification = 0;
  notification.style.display = "none";
}

// Intro == enviar mensaje
messageBox.addEventListener("keypress", function (e) {
  if (messageBox.value == "") return;

  var event = e || window.event;
  var char = event.which || event.keyCode;
  if (char == "13") sendBtn.click();
});

// Enviar mensaje
document.getElementById("send-message").addEventListener("click", function () {
  conn.send(messageBox.value);
  addMessage(messageBox.value, "sent");
  messageBox.value = null;
});

//Enviar vídeo reacción
const sendVideoReaccionBtn = document.getElementById("e-v-btn");
sendVideoReaccionBtn.addEventListener("click", () => {
  if (recordedBlobs) {
    console.log(recordedBlobs);
    const videoReaccion = {
      type: "vr",
      video: recordedBlobs,
    };
    console.log(videoReaccion);
    conn.send(videoReaccion);
    console.log("Se ha enviado la vídeo reacción!");
    const blob = new Blob(recordedBlobs, { type: "video/webm" });
    const url = window.URL.createObjectURL(blob);
    const video = document.createElement("video");
    video.src = url;
    //video.controls = true;
    video.loop = true;
    video.autoplay = true;
    video.classList.add("video-chat");
    addVideo(video, "sent");

    // Cerramos el modal
    $(document).ready(function () {
      $("#videoReactionModal").modal("toggle");
    });
  } else {
    console.log("No se ha grabado el vídeo");
  }
});

// Añadir mensaje al chat del cliente (imprimir por frontend)
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

  info = msg + ' <a class="message-time">' + h + ":" + m + ":" + s + "</a>";

  var node = document.createElement("li");
  node.classList.add("message-" + type + "");
  node.innerHTML = info;
  messageList.appendChild(node);

  if (type == "received") {
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

// Añadir mensaje de video al chat del cliente (imprimir por frontend)
function addVideo(video, type) {
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

  info = ' <a class="message-time">' + h + ":" + m + ":" + s + "</a>";

  var node = document.createElement("li");
  node.innerHTML = info;
  video.controls = false;
  video.loop = true;
  video.autoplay = true;
  node.prepend(video);
  node.classList.add("message-" + type);
  messageList.appendChild(node);
  chatBox.scrollTop = chatBox.scrollTop;

  if (type == "received") {
    audio.play();
  }
}
