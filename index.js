var app = require('express')();
var http = require('http');
var io = require('socket.io')(http);
var Chance = require('chance');
var underscore = require('underscore');
var chance = new Chance();
var bots = []; //array de bots
var allClients = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = http.createServer(app).listen(3000, function() {
    console.log("Express server listening on port 3000");
});

io = io.listen(server);

io.on('connection', function(socket) {
	console.log('socket-connected');
    var global_socket = socket;
    var chance = new Chance();
	var name = chance.first() + " " + chance.last();
	console.log(name);
	io.emit('general message', {"user": "", "msg": "--------------"+name+" has joined the room"});

	if(bots.length > 0){
		underscore.each(bots, function(element, index) {
			io.emit('welcome message', {"user": element, "msg": "Hi " + name});
		});
		io.emit('chat message', {"user": name, "msg": "Hi...", "response":chance.pick(bots)}); //escoge un nombre al azar de los bots para hacer q un solo bot responda 
	}

	bots.push(name);
	allClients.push(global_socket);
	
	global_socket.removeListener('chat message', function(){});

	global_socket.on('chat message', function(msg) { //para responder un mensaje
		if(bots.length > 1){
			var botsFilter =underscore.without(bots, chance.pick(msg)); // omitiendo al ultimo q escribió
			io.emit('chat message', {"user": chance.pick(botsFilter), "msg": chance.sentence(), "response":chance.pick(botsFilter)});
		}
    });
	
	global_socket.removeListener('get user', function(){});

	global_socket.on('get user', function(msg) { //enviar el username del bot
	    console.log("asd");
		io.emit('get user', {"user": bots[allClients.indexOf(global_socket)], "msg": ""});
	});
	
	global_socket.removeListener('disconnect', function(){});

    global_socket.on('disconnect', function() {
	   var i = underscore.indexOf(allClients, global_socket);
	   allClients = underscore.without(allClients,allClients[i]);	
	   io.emit('general message', {"user": "", "msg": "--------------"+bots[i]+" just left the room"});
	   bots = underscore.without(bots,bots[i]);
	   //llamar un nuevo bot para hablar
	   io.emit('chat message', {"user": chance.pick(bots), "msg": chance.sentence(), "response":chance.pick(bots)});
	});

});


