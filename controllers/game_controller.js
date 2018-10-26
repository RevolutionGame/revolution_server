"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');

var io = require('socket.io');

function GameController(){};

GameController.prototype = (function(){

    function testApi(request, h){
        return 'Hello, world!';
    }

    function login(request, h){
        return 'Hello, world2!';
    }

    return {
        test: testApi,
        login: login
    }
})();

var gameController = new GameController();

module.exports = {
    getController: gameController,
    
    socketInfo: function(server, io){
        //put socket things here, ie onConnection method. otherwise the onConnection would be added everytiem the api call is made efefctively addinf an "onConnection" handler for every player. We only want the server to have one "onConnection" handler
        io.on('connection', function(socket){

            socket.on("ROOM_INFO", function(data){
                var roomId = data.roomId;
                socket.join(roomId);

                var room = io.sockets.adapter.rooms[data.roomId];
                var roomSize = room.length;
                if(roomSize == 1){
                    io.in(data.roomId).emit('GAME_START', 'the game is starting');
                }
            });

            socket.emit("CONNECTION_SUCCESS");



            socket.on('chat message', function(msg){
            socket.broadcast.emit('chat message', msg);
            console.log(msg);
            });
            socket.on('disconnect', function(){
            console.log('disconnected');
            });
        });
    }
}