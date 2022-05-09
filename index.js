var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send(__dirname + '/public');
});

var httpServer = http.Server(app);

var io = socketio(httpServer);
io.on('connection', function(socket){
    console.log("Hola");
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });   
});


httpServer.listen(8080, function () {
 console.log('Listening on :8080');
});