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
clearBtn.addEventListener('click', clearForm);
saveBtn.addEventListener('click', saveTrack)
testBtn.addEventListener('click', testStop);
videoTest.addEventListener('pause', testEnded);

//Lo podemos quitar
function getCurrentTimeAdmin(cTime){
    let min =Math.trunc(myVideo.currentTime / 60);
    let sec= Math.trunc(myVideo.currentTime % 60);
    if (sec<10){
        cTime.value = min +":0"+sec;
    } else {
        cTime.value = min +":"+sec;
    }
}

function startTime(){
    startValue.value=myVideo.currentTime;
}

function endTime(){
    endValue.value=myVideo.currentTime;
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
        myVideo.style.display='none';
        console.log("abrir");
        form.style.display= 'flex';
    } else {
        alert("Los valores entrados no son correctos!");
    }
}