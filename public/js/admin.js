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
    const saveBtnForm = document.getElementById('save-btn-form'); // Save button form
    const editBtn = document.getElementById('editCueBtn'); // Edit button
    const form = document.getElementById('form');
    const getTime = document.getElementById('get-time');
    const testBtn = document.getElementById('test-btn');
    const videoTest = document.getElementById('video-test');
    const deleteTable = document.getElementById('delete-table');
    const videoReaccionCont = document.getElementById('video-reaccion');
    const videoReaccionBtn = document.getElementById('videoReaccionBtn');

    startTimeBtn.addEventListener('click', startTime);
    endTimeBtn.addEventListener('click', endTime);
    saveBtn.addEventListener('click', saveTrack);
    testBtn.addEventListener('click', testStop);
    videoTest.addEventListener('pause', testEnded);
    editBtn.addEventListener('click', editar);

    var textTracks = myVideo.textTracks;
    var textTrack = textTracks[0]; // plays track
    var cues = textTrack.cues;
    var editarId = -1;

    // TABLA DE ELIMINACIÓN
    // Añadir las filas de la tabla

    console.log(textTrack.cues);
    var tableRow="";  
    for (let i = 0; i < cues.length; i++){
        json = JSON.parse(cues[i].text);
        //console.log(cues[i].startTime);
        //console.log(cues[i].endTime);
        tableRow = tableRow + '<tr><th scope="row">'+cues[i].id+'</th><td>'+json.player.name
        +'</td><td>'+convertTimeToVttFormat(cues[i].startTime)+'</td><td>'
        +convertTimeToVttFormat(cues[i].endTime)
        +'</td><td style="text-align: end;"><button id="editarCue-'+i
        +'" class="btn-sm btn-success">Editar</button></td><td style="text-align: center;"><button id="eliminarCue-'+i
        +'" class="btn-sm btn-danger">Eliminar</button></td><td><button id="videoReaccion-'+i
        +'" class="btn-sm btn-primary">Vídeo reacción</button></td>' 
        +'</tr>';
    }
    document.getElementById('t-body').innerHTML = tableRow;
    // Añadir el listener a cada boton de cada jugada (fila)
    for (let i = 0; i < cues.length; i++) {
        json = JSON.parse(cues[i].text);
        idBtn = "eliminarCue-" + i;
        document.getElementById(idBtn).addEventListener('click', eliminar);
        document.getElementById("editarCue-" + i).addEventListener('click', editarForm);
        document.getElementById("videoReaccion-"+i).addEventListener('click', abrirVideoReaccion);

    }

    function hasGetUserMedia() {
        return !!(navigator.mediaDevices &&
       navigator.mediaDevices.getUserMedia);
       }

    function abrirVideoReaccion(e){
        if (hasGetUserMedia()) {
            let cuePos = parseInt(e.target.id.split("-")[1]);
            console.log(cuePos);
            getTime.style.display='none';
            videoTest.style.display='none';
            myVideo.pause();
            videoTest.pause();
            myVideo.style.display='none';
            form.style.display= 'none';
            deleteTable.style.display = 'none';
            saveBtnForm.style.display='none';
            if (videoReaccionCont.classList.contains("d-none")) {
                videoReaccionCont.classList.remove("d-none");
            
            }
        } else {
            alert("getUserMedia() is not supported by your browser");
        } 
    }

    function eliminar(e){
        //Posición de la cola
        let cuePos = parseInt(e.target.id.split("-")[1]);
        //Eliminar cola
        textTrack.removeCue(cues[cuePos]);
        console.log(textTrack);
        //Método AJAX
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "writeCues.php", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              console.log(this.responseText);
              window.location.replace("index.html");
            }
        };
        var data = getTextTrackJson();
        xhttp.send(JSON.stringify(data));
    }

    function editarForm(e){
        editarId = parseInt(e.target.id.split("-")[1]);
        let json_vtt = JSON.parse(cues[editarId].text);
        let json_player = json_vtt.player;
        let json_scoreboard = json_vtt.scoreboard;
        //Jugada
        document.getElementById("play").value = cues[editarId].id;
        document.getElementById("play").disabled = true;
        //Información jugador
        document.getElementById("full-name").value = json_player.name;
        document.getElementById("player-pic").value = json_player.pic;
        //var date = new Date(convertDigitIn(json_player.dob));
        var date = new Date(json_player.dob);
        var formDate = date.toISOString().substring(0,10);
        document.getElementById("dateofbirth").value = formDate;
        document.getElementById("birth-city").value = json_player.city;
        document.getElementById("nacionality").value = json_player.country;
        document.getElementById("number").value = json_player.number;
        document.getElementById("player-height").value = json_player.height;
        document.getElementById("player-weight").value = json_player.weight;
        document.getElementById("player-team").value = json_player.team;
        document.getElementById("player-points").value = json_player.points;
        document.getElementById("player-rebounds").value = json_player.rebounds;
        document.getElementById("player-assists").value = json_player.assists;
        document.getElementById("player-steals").value = json_player.steals;
        //Información partidos
        document.getElementById("local-name").value = json_scoreboard.home_team;
        document.getElementById("local-points").value = json_scoreboard.home_points;
        document.getElementById("visitor-name").value = json_scoreboard.visitor_team;
        document.getElementById("visitor-points").value = json_scoreboard.visitor_points;
        //var date = new Date(convertDigitIn(json_scoreboard.date));
        var date = new Date(json_scoreboard.date);
        var formDate = date.toISOString().substring(0,10);
        document.getElementById("dateofmatch").value = formDate;
        document.getElementById("match-type-select").value = json_scoreboard.type;
        document.getElementById("home-logo").value = json_scoreboard.home_pic;
        document.getElementById("visitor-logo").value = json_scoreboard.visitor_pic;
        //Tiempo
        //hStartTime.value = convertTimeToVttFormat(cues[editarId].startTime);
        //hEndTime.value = convertTimeToVttFormat(cues[editarId].endTime);
        
        getTime.style.display='none';
        videoTest.style.display='none';
        myVideo.pause();
        videoTest.pause();
        myVideo.style.display='none';
        form.style.display= 'flex';
        deleteTable.style.display = 'none';
        saveBtnForm.style.display='none';

    }

    function editar() {
        if (editarId >= 0) {
            //Cogemos las marcas de tiempo
            //var sct = cues[editarId].startTime;
            //var ect = cues[editarId].endTime;
            //Eliminamos la cola actual
            //textTrack.removeCue(cues[editarId]);
            //Actualizamos el valor
            //textTrack.addCue(new VTTCue(sct, ect, JSON.stringify(buildJsonEditForm())));
            cues[editarId].text = JSON.stringify(buildJsonEditForm());
            //Método AJAX
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", "writeCues.php", true);
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
    }

    function buildJsonEditForm(){
        let json = {};
        let players = {};
        let scoreboard = {};
        //Información jugador
        players['name'] = document.getElementById("full-name").value;
        players['pic'] = document.getElementById("player-pic").value;
        players['dob'] = document.getElementById("dateofbirth").value;
        players['city'] = document.getElementById("birth-city").value;
        players['country'] = document.getElementById("nacionality").value;
        players['number'] = document.getElementById("number").value;
        players['height'] = document.getElementById("player-height").value;
        players['weight'] = document.getElementById("player-weight").value;
        players['team'] = document.getElementById("player-team").value;
        players['points'] = document.getElementById("player-points").value;
        players['rebounds'] = document.getElementById("player-rebounds").value;
        players['assists'] = document.getElementById("player-assists").value;
        players['steals'] = document.getElementById("player-steals").value;
        //Información partidos
        scoreboard['home_team'] = document.getElementById("local-name").value;
        scoreboard['home_points'] = document.getElementById("local-points").value;
        scoreboard['visitor_team'] = document.getElementById("visitor-name").value;
        scoreboard['visitor_points'] = document.getElementById("visitor-points").value;
        scoreboard['date'] = document.getElementById("dateofmatch").value;
        scoreboard['type'] = document.getElementById("match-type-select").value;
        scoreboard['home_pic'] = document.getElementById("home-logo").value;
        scoreboard['visitor_pic'] = document.getElementById("visitor-logo").value;

        json['player'] = players;
        json['scoreboard'] = scoreboard;

        console.log(JSON.stringify(json));

        return json;
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

    function clearForm(){
            //Jugada
            document.getElementById("play").value = "";
            //Información jugador
            document.getElementById("full-name").value = "";
            document.getElementById("player-pic").value = "";
            document.getElementById("dateofbirth").value = "";
            document.getElementById("birth-city").value = "";
            document.getElementById("nacionality").value = "";
            document.getElementById("number").value = "";
            document.getElementById("player-height").value = "";
            document.getElementById("player-weight").value = "";
            document.getElementById("player-team").value = "";
            document.getElementById("player-points").value = "";
            document.getElementById("player-rebounds").value = "";
            document.getElementById("player-assists").value = "";
            document.getElementById("player-steals").value = "";
            //Información partidos
            document.getElementById("local-name").value = "";
            document.getElementById("local-points").value = "";
            document.getElementById("visitor-name").value = "";
            document.getElementById("visitor-points").value = "";
            document.getElementById("dateofmatch").value = "";
            document.getElementById("match-type-select").value = "";
            document.getElementById("home-logo").value = "";
            document.getElementById("visitor-logo").value = "";
    }

    function saveTrack(){
        if(parseFloat(hStartValue.value) < parseFloat(hEndValue.value)){
            clearForm();
            getTime.style.display='none';
            videoTest.style.display='none';
            myVideo.pause();
            videoTest.pause();
            myVideo.style.display='none';
            console.log("abrir");
            form.style.display= 'flex';
            deleteTable.style.display = 'none';
            editBtn.style.display='none';
        } else {
            alert("Los valores entrados no son correctos!");
        }
    }
};