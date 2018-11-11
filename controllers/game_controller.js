"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');

var io = require('socket.io');

var AsyncLock = require('async-lock');

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



const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function manageGame(roomId, io){
    var dumpObj = dataDumpMap.get(roomId);


    console.log("roomId: " + roomId);
    console.log("dump Obj: " + dumpObj);
    var gameInstance = gameInstanceMap.get(roomId);
    console.log("Game Instance: " + gameInstance);
    //Object.defineProperty(gameInstance, 'properties', {});
    gameInstance["properties"] = {};
    //Object.defineProperty(gameInstance.properties, 'active', true);
    gameInstance.properties["active"] = true;

    var myLock = gameInstance.lock;
    while(gameInstance.properties.active == true){
        await sleep(2000);
        //myLock.acquire(roomId, generateAsteroids);
        generateAsteroids(gameInstance, dumpObj);
        io.in(roomId).emit("DATA_DUMP_TEST", dataDumpMap.get(roomId));
    }
}
function generateAsteroids(gameInstance, dumpObj){
    var asteroids = dumpObj.asteroids;
    var randX, randY, degrees;
    for(var k = 0; k < 3; k++){
        randX = Math.floor(Math.random() * 500);
        randY = Math.floor(Math.random() * 500);
        degrees = Math.floor(Math.random() * 360);

        asteroids.push({
            asteroidId: gameInstance["currentAsteroidId"],
            locationX: randX,
            locationY: randY,
            angleInDegrees: degrees
        });
        gameInstance.currentAsteroidId = gameInstance.currentAsteroidId + 1;
    }
}


function initializeGame(data){
    gameInstanceMap.set(data.roomId, {lock: new AsyncLock(), currentAsteroidId: 0}/** A variable holding data about the game instance. This data can be accesssed from the manageGame function or wherever else*/);
    dataDumpMap.set(data.roomId, {ships: [], asteroids: [], events: []});
    currentGameId++;

    var ships = dataDumpMap.get(data.roomId)["ships"];

    var players = gameSetupMap.get(data.roomId)["playerIds"];

    //determine the players' initial positions
    var randX, randY, degrees;
    for(var k = 0; k < players.length; k++){
        randX = Math.floor(Math.random() * 500);
        randY = Math.floor(Math.random() * 500);
        degrees = Math.floor(Math.random() * 360);

        ships.push({
           userId: players[k],
            locationX: randX,
            locationY: randY,
            angleInDegrees: degrees
        });
    }
}


function playerHitAsteroid(theEvent, dumpObj){
    console.log("Hit Asteroid Event: " + theEvent);
    var playerId = theEvent["userId"];

}
function playerDestroyedAsteroid(theEvent, dumpObj){

}
function playerShotShip(theEvent, dumpObj){

}

function updateData(data){
    var roomId = data.roomId;
    var givenPlayerLocation = data.location;

    var obj = dataDumpMap.get(roomId);


    var dumpPlayer = obj.ships.find(function(elmt){//this method finds the player with the given id in the ships array
        if(elmt === this){
            return elmt;
        }
    }, playerLocation.userId);//specifies that "this" within the callback function should refer to playerLocation.userId
    dumpPlayer.locationX = givenPlayerLocation.locationX;
    dumpPlayer.locationY = givenPlayerLocation.locationY;
    dumpPlayer.angleInDegrees = givenPlayerLocation.angleInDegrees;

    var givenEvents = data.events;
    var event;
    obj.events = [];
    var sendingEvents = obj.events;
    for(var k = 0; k < givenEvents.length; k++){
        event = givenEvents[k];
        switch(event.type){
            case "fired":
                sendingEvents.push(event);
                break;
            case "hitAsteroid":
                playerHitAsteroid(event, obj);
                sendingEvents.push(event);
                break;
            case "asteroidDestroyed":
                playerDestroyedAsteroid(event, obj);
                sendingEvents.push(event);
                break;
            case "shotShip":
                playerShotShip(event, obj);
                sendingEvents.push(event);
                break;
        }
    }
}

var gameSetupMap = new Map();

//Map which holds information about the game such as which asteroid id to generate next. The roomId is the key
var gameInstanceMap = new Map();

//Map which holds the json objects to dump to the clients. The roomId is the key
var dataDumpMap = new Map();

var currentGameId = 0;//For testing purposes. This will increment once a game starts

module.exports = {
    getController: gameController,
    
    //could just put an array here as a temporary solution of storing users in a room
    socketInfo: function(server, io){
        io.on('connection', function(socket){
            console.log("connected");
            socket.on("ROOM_INFO", function(data){
                var roomId = data.roomId;
                socket.join(roomId);

                if(gameSetupMap.has(data.roomId)){
                    gameSetupMap.get(data.roomId)["playerIds"].add(data.userId);
                }else{
                    gameSetupMap.set(data.roomId, {playerIds: []});
                    gameSetupMap.get(data.roomId)["playerIds"].add(data.userId);
                }

                console.log("received room info");
                var room = io.sockets.adapter.rooms[data.roomId];
                var roomSize = room.length;
                if(roomSize == 2){
                    //socket.emit('TEST', data);
                    //socket.emit('GAME_START', 'the game is starting');

                    initializeGame(data);
                    
                    io.in(data.roomId).emit('GAME_START', data);

                    manageGame(data.roomId, io);
                }
            });

            socket.on("FORCE_GAME_START", function(data){
                console.log("force game start");
                initializeGame(data);
                
                io.in(data.roomId).emit('FORCE_GAME_START', data);
                manageGame(data.roomId, io);
            });

            socket.on("GAME_STARTED", function(data){
                console.log("Game started: " + gameInstanceMap.get(data.roomId));
            });

            socket.on("GAME_FORCE_STARTED", function(data){
                console.log("Game Force started: " + gameInstanceMap.get(data.roomId));
                console.log("The roomId: " + data.roomId);
                //socket.emit("DATA_DUMP_TEST", dataDumpMap.get(data.roomId));
            });

            socket.on("CLIENT_DATA", function(data){
                //record client data
                updateData(data);

                //send back the data dump
                io.in(data.roomId).emit("ALL_DATA", dataDumpMap.get(data.roomId));
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

            var connectData = {"roomId": "room" + currentGameId};
            socket.emit("CONNECTION_SUCCESS", connectData);
            console.log("emitted connection success");


            socket.on('disconnect', function(){
            console.log('disconnected');
            });
        });
    }
}