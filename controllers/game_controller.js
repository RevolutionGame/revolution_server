"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');

var io = require('socket.io');

function GameController(){};

GameController.prototype = (function(){

    function findclassicgame(request, h){
        //code to check for open game in database

        return 'gameroomid';
    }

    function findarcadegame(request, h){
        //code to check for open game in database

        return 'gameroomid';
    }

    return {
        joinclassic: findclassicgame,
        joinarcade: findarcadegame
    }
})();

var gameController = new GameController();

module.exports = {
    getController: gameController,
    
    //could just put an array here as a temporary solution of storing users in a room
    socketInfo: function(server, io){
        io.on('connection', function(socket){
            console.log("connected");
            socket.on("ROOM_INFO", function(data){
                var roomId = data.roomId;
                socket.join(roomId);

                console.log("received room info");
                var room = io.sockets.adapter.rooms[data.roomId];
                var roomSize = room.length;
                if(roomSize == 2){
                    //socket.emit('TEST', data);
                    //socket.emit('GAME_START', 'the game is starting');
                    io.in(data.roomId).emit('GAME_START', data);
                }
            });

            socket.on("TEST_DATA", function(data){
                console.log("received test data");
                socket.emit('TEST_DATA', data);
            });

            socket.on("LOCATION_DATA", function(data){
                var roomId = data.roomId;

                console.log("received location data");

                socket.to(data.roomId).emit('LOCATION_DATA', data);
            });

            socket.emit("CONNECTION_SUCCESS");
            console.log("emitted connection success");


            socket.on('disconnect', function(){
            console.log('disconnected');
            });
        });
    }
}