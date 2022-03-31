const startTimeBtn = document.getElementById('s-time'); // Start time button
const endTimeBtn = document.getElementById('e-time'); // End time button
const startValue = document.getElementById('s-time-value'); // Start time value
const endValue = document.getElementById('e-time-value'); // End time value
const clearBtn = document.getElementById('clear-btn'); // Clear button
const saveBtn = document.getElementById('save-btn'); // Save button
const form = document.getElementById('form');
const getTime = document.getElementById('get-time');
const testBtn = document.getElementById('test-btn');
const videoTest = document.getElementById('video-test')

startTimeBtn.addEventListener('click', startTime);
endTimeBtn.addEventListener('click', endTime);
saveBtn.addEventListener('click', saveTrack)
testBtn.addEventListener('click', testStop);
videoTest.addEventListener('pause', testEnded);



window.onload = function () {
    console.log(JSON.parse(myVideo.textTracks[0].cues[0].text).play);

    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues; // cues list
    var cue = cues[0];

    document.getElementById('h-chapter').value = cues.length + 1;

    // Añadir las filas de la tabla
    var tableRow="";  
    for (let i = 0; i < cues.length; i++){
        json = JSON.parse(myVideo.textTracks[0].cues[i].text);
        console.log(myVideo.textTracks[0].cues[i].startTime);
        console.log(myVideo.textTracks[0].cues[i].endTime);
        tableRow = tableRow + '<tr><th scope="row">'+json.play+'</th><td>'+json.player.name+'</td><td>'+myVideo.textTracks[0].cues[i].startTime+'</td><td>'+myVideo.textTracks[0].cues[i].endTime+'</td><td><button id="eliminarCue-'+json.play+'" class="btn-sm btn-danger">Eliminar</button></td></tr>';
    }

    document.getElementById('t-body').innerHTML = tableRow;

    // Añadir el listener a cada boton de cada jugada (fila)
    for (let i = 0; i < cues.length; i++) {
        json = JSON.parse(myVideo.textTracks[0].cues[i].text);
        idBtn = "eliminarCue-" + json.play;
        document.getElementById(idBtn).addEventListener('click', eliminar);
    }

    function eliminar(e){
        idCue = (e.srcElement.id.split("-")[1]) - 1;
        console.log(idCue);
        cueToDelete = textTracks[0].cues[idCue];
        console.log(cueToDelete)
        textTracks[0].addCue(cueToDelete);
        console.log(textTracks[0].cues.length)
    }

};

//Lo podemos quitar
function getCurrentTimeAdmin(time){
    let min =Math.trunc(time / 60);
    let sec= Math.trunc(time % 60);
    if (sec<10){
        return "00:0"+min +":0"+sec+".000";
    } else {
        return "00:0"+min +":"+sec+".000";
    }
}

function startTime(){
    startValue.value=myVideo.currentTime;
    console.log(getCurrentTimeAdmin(startValue.value));
    document.getElementById('h-start-time').value = getCurrentTimeAdmin(startValue.value);

}

function endTime(){
    endValue.value=myVideo.currentTime;
    console.log(getCurrentTimeAdmin(endValue.value));
    document.getElementById('h-end-time').value = getCurrentTimeAdmin(endValue.value);
}

function clearForm(){
    startValue.value=null;
    endValue.value=null;
}

function testStop(){
    if(videoTest.paused){
        console.log("Test: " + startValue.value + " " + endValue.value);
        var sv = parseFloat(startValue.value);
        var ev = parseFloat(endValue.value);
        if(sv < ev){
            console.log("resources/top10-video.mp4#t="+sv+","+ev+"");
            console.log(videoTest);
            videoTest.src="resources/top10-video.mp4#t="+sv+","+ev;
            videoTest.play();
            myVideo.pause();
            testBtn.className = "btn btn-danger";
            testBtn.innerHTML = "STOP"
        } else {
            alert("Los valores entrados no son correctos!");
        }
    } else {
        videoTest.pause();
    }

}

function testEnded(){
    console.log("test pausado");
    testBtn.className = "btn btn-primary";
    testBtn.innerHTML = "Test";
}

function saveTrack(){
    if(parseFloat(startValue.value) < parseFloat(endValue.value)){
        getTime.style.display='none';
        videoTest.style.display='none';
        myVideo.pause();
        videoTest.pause();
        myVideo.style.display='none';
        console.log("abrir");
        form.style.display= 'flex';
        // SAVE FILE
        
    } else {
        alert("Los valores entrados no son correctos!");
    }
}