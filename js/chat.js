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