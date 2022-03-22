const startTimeBtn = document.getElementById('s-time'); // Start time button
const endTimeBtn = document.getElementById('e-time'); // End time button
const startValue = document.getElementById('s-time-value'); // Start time value
const endValue = document.getElementById('e-time-value'); // End time value
const clearBtn = document.getElementById('clear-btn'); // Clear button
const saveBtn = document.getElementById('save-btn'); // Save button
const form = document.getElementById('form');
const getTime = document.getElementById('get-time');
const testBtn = document.getElementById('test-btn');

startTimeBtn.addEventListener('click', startTime);
endTimeBtn.addEventListener('click', endTime);
clearBtn.addEventListener('click', clearForm);
saveBtn.addEventListener('click', saveTrack)
testBtn.addEventListener('click', test);

function startTime(){
    console.log(myVideo.currentTime)
    startValue.value=myVideo.currentTime;
}

function endTime(){
    console.log(myVideo.currentTime)
    endValue.value=myVideo.currentTime;
}

function clearForm(){
    startValue.value=null;
    endValue.value=null;
}

function test(){
    console.log(startValue.value + "" + endValue.value)
    if(startValue.value < endValue.value){
        myVideo.src="resources/top10-video.mp4#t="+startValue.value+","+endValue.value;
        myVideo.play();
    } else {
        alert("Los valores entrados no son correctos!");
    }

}

function saveTrack(){
    if(startValue.value < endValue.value){
        getTime.style.display='none';
        console.log("abrir");
        form.style.display= 'flex';
    } else {
        alert("Los valores entrados no son correctos!");
    }
}