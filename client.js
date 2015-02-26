var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000');
var username = "";
 
socket.emit('get user', '');
socket.on('get user', function (data) {
  if(username==""){
		username = data.user;
		console.log("My name is: "+data.user);
	}
});

socket.on('connect', function () {
  console.log("client socket connected");
});
 
socket.on('chat message', function(data) {
	console.log("----***---");
	console.log("User "+ data.response + " will response")
	if(data.response == username){
		console.log("----***---");
	    console.log("I'am "+ data.response + " so I will send a response");
		socket.emit('chat message', data.user);
	}else{
		console.log("----***---");
		console.log("I'am not "+ data.response);
	}
});
