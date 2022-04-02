window.onload = function () {
    const startTimeBtn = document.getElementById('s-time'); // Start time button
    const endTimeBtn = document.getElementById('e-time'); // End time button
    const startValue = document.getElementById('s-time-value'); // Start time value
    const hStartValue = document.getElementById('h-start-value');
    const hStartTime = document.getElementById('h-start-time');
    const endValue = document.getElementById('e-time-value'); // End time value
    const hEndValue = document.getElementById('h-end-value');
    const hEndTime = document.getElementById('h-end-time');
    const clearBtn = document.getElementById('clear-btn'); // Clear button
    const saveBtn = document.getElementById('save-btn'); // Save button
    const form = document.getElementById('form');
    const getTime = document.getElementById('get-time');
    const testBtn = document.getElementById('test-btn');
    const videoTest = document.getElementById('video-test');

    startTimeBtn.addEventListener('click', startTime);
    endTimeBtn.addEventListener('click', endTime);
    //clearBtn.addEventListener('click', clearForm);
    saveBtn.addEventListener('click', saveTrack)
    testBtn.addEventListener('click', testStop);
    videoTest.addEventListener('pause', testEnded);

    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues;
    //stv.addEventListener('click', mystv);

    document.getElementById('h-chapter').value = cues.length + 1;

    // Añadir las filas de la tabla
    var tableRow="";  
    for (let i = 0; i < cues.length; i++){
        json = JSON.parse(cues[i].text);
        //console.log(cues[i].startTime);
        //console.log(cues[i].endTime);
        tableRow = tableRow + '<tr><th scope="row">'+json.play+'</th><td>'+json.player.name
        +'</td><td>'+convertTimeToVttFormat(cues[i].startTime)+'</td><td>'
        +convertTimeToVttFormat(cues[i].endTime)
        +'</td><td><button id="eliminarCue-'+i
        +'" class="btn-sm btn-danger">Eliminar</button></td></tr>';
    }

    document.getElementById('t-body').innerHTML = tableRow;

    // Añadir el listener a cada boton de cada jugada (fila)
    for (let i = 0; i < cues.length; i++) {
        json = JSON.parse(cues[i].text);
        idBtn = "eliminarCue-" + i;
        document.getElementById(idBtn).addEventListener('click', eliminar);

    }

    function eliminar(e){
        //Posición de la cola
        let cuePos = parseInt(e.target.id.split("-")[1]);
        //Eliminar cola
        textTrack.removeCue(cues[cuePos]);
        console.log(textTrack);
        //Método AJAX
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "removeCue.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              console.log(this.responseText);
              location.reload();
            }
        };
        var data = getTextTrackJson();
        xhttp.send(JSON.stringify(data));
    }

    function getTextTrackJson(){
        let text = "";
        for (let index = 0; index < cues.length; index++) {
            /*
            console.log("ID " + cues[index].id);
            console.log("original " + cues[index].startTime);
            console.log("h " + twoDigits(Math.trunc(cues[index].startTime / 3600)));
            console.log("m " + Math.trunc((cues[index].startTime % 3600)/60));
            console.log("s " + Math.trunc(cues[index].startTime % 60));
            */
            text += '{' + 
                '"id":"' + cues[index].id + '"' +
                ', "time":"' + convertTimeToVttFormat(cues[index].startTime) + ' --> ' + convertTimeToVttFormat(cues[index].endTime) + '"' + 
                ', "text":' +  cues[index].text
                + '}';
            if (index < (cues.length - 1)) {
                text += ',';
            }
            //console.log(cues[index].startTime);
            //console.log(cues[index].endTime);
        }
        //let obj = '[' + text + ']';
        //console.log(obj);
        return JSON.parse('[' + text + ']');
    }

    function convertTimeToVttFormat(time){
        let hour = Math.trunc(time / 3600);
        let min =Math.trunc(Math.trunc((time % 3600)/60));
        let sec= Math.trunc(time % 60);
        return twoDigits(hour) + ":" + twoDigits(min) + ":" + twoDigits(sec) + ".000";
    }

    function twoDigits(n){ return n > 9 ? "" + n: "0" + n; }

    function startTime(){
        hStartValue.value = myVideo.currentTime;
        hStartTime.value = convertTimeToVttFormat(myVideo.currentTime);
        startValue.value=convertTimeToVttFormat(myVideo.currentTime);
    }

    function endTime(){
        hEndValue.value = myVideo.currentTime;
        hEndTime.value = convertTimeToVttFormat(myVideo.currentTime);
        endValue.value=convertTimeToVttFormat(myVideo.currentTime);
    }

    function clearForm(){
        startValue.value=null;
        hStartTime.value = null;
        endValue.value=null;
        hEndTime.value = null;
    }

    function testStop(){
        if(videoTest.paused){
            console.log("Test: " + hStartValue.value + " " + hEndValue.value);
            var sv = parseFloat(hStartValue.value);
            var ev = parseFloat(hEndValue.value);
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
        if(parseFloat(hStartValue.value) < parseFloat(hEndValue.value)){
            getTime.style.display='none';
            videoTest.style.display='none';
            myVideo.pause();
            videoTest.pause();
            myVideo.style.display='none';
            console.log("abrir");
            form.style.display= 'flex';
            
        } else {
            alert("Los valores entrados no son correctos!");
        }
    }
};