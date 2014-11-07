var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var users =[];

app.use('/', express.static(__dirname + '/www'));

server.listen(8080);

io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });

    socket.on('disconnect', function(){
    	users.splice(socket.userIndex, 1);

    	socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    });

    socket.on('postMsg', function(msg){
    	socket.broadcast.emit('newMsg', socket.nickname, msg);
    });

     socket.on('img', function(imgData) {
   	 //通过一个newImg事件分发到除自己外的每个用户
     	socket.broadcast.emit('newImg', socket.nickname, imgData);
 	});
});