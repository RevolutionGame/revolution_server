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


var numPlayers = 1;

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
    var count = 0;
    var started = false;
    while(gameInstance.properties.active == true && !started){
        await sleep(10);
        if(gameInstance.properties.hasOwnProperty("playersReady") && gameInstance.properties.playersReady === numPlayers){
            started = true;
            console.log("here2");
            while(gameInstance.properties.active == true){
                await sleep(10);
                //myLock.acquire(roomId, generateAsteroids);
                if(count % 200 === 199){
                    generateAsteroids(gameInstance, dumpObj);
                }
                count++;
                console.log("here3");
                io.in(roomId).emit("DATA_DUMP_TEST", dataDumpMap.get(roomId));
            }
        }
        
    }
}
function generateAsteroids(gameInstance, dumpObj){
    var asteroids = dumpObj.asteroids;
    var randX, randY, degrees, negative, side;
    for(var k = 0; k < 3; k++){
        side =  Math.floor(Math.random() * 2);

        if(side === 1){
            randX = -8;
        }else{
            randX = 8;
        }

        negative = Math.floor(Math.random() * 2);
        randY = Math.floor(Math.random() * 4);
        if(negative === 1){
            randY = -randY;
        }

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
    dataDumpMap.set(data.roomId, {roomId: data.roomId, ships: [], asteroids: [], events: []});
    currentGameId++;

    var ships = dataDumpMap.get(data.roomId)["ships"];

    var players = gameSetupMap.get(data.roomId)["playerIds"];

    //determine the players' initial positions
    var randX, randY, degrees, negative;
    for(var k = 0; k < players.length; k++){
        negative = Math.floor(Math.random() * 2);
        randX = Math.floor(Math.random() * 7);
        if(negative === 1){
            randX = -randX;
        }

        negative = Math.floor(Math.random() * 2);
        randY = Math.floor(Math.random() * 3);
        if(negative === 1){
            randY = -randY;
        }

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
    var dumpPlayer = obj["ships"].find(function(elmt){
        return elmt.userId === this;
    }, givenPlayerLocation.userId);
}
function playerShotShip(theEvent, dumpObj){

}

function updateData(data){
    var roomId = data.roomId;
    console.log("In update data object: " + data);
    console.log("In update room id: " + roomId);
    var givenPlayerLocation = data.location;

    var obj = dataDumpMap.get(roomId);

    console.log("givenPlayerLocation.userId: " + givenPlayerLocation.userId);
    console.log("Ships: " + obj["ships"]);
    var dumpPlayer = obj["ships"].find(function(elmt){//this method finds the player with the given id in the ships array
        return elmt.userId === this;
    }, givenPlayerLocation.userId);//specifies that "this" within the callback function should refer to playerLocation.userId
    console.log("Dump player: " + dumpPlayer);
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
                    gameSetupMap.get(data.roomId)["playerIds"].push(data.userId);
                }else{
                    gameSetupMap.set(data.roomId, {playerIds: []});
                    gameSetupMap.get(data.roomId)["playerIds"].push(data.userId);
                }

                console.log("received room info");
                var room = io.sockets.adapter.rooms[data.roomId];
                var roomSize = room.length;
                if(roomSize === 2){
                    //socket.emit('TEST', data);
                    //socket.emit('GAME_START', 'the game is starting');

                    initializeGame(data);
                    
                    var obj = dataDumpMap.get(data.roomId);
                    io.in(data.roomId).emit('FORCE_GAME_START', obj);

                    manageGame(data.roomId, io);
                }
            });

            socket.on("FORCE_GAME_START", function(data){
                console.log("force game start");
                initializeGame(data);
                
                var obj = dataDumpMap.get(data.roomId);

                io.in(data.roomId).emit('FORCE_GAME_START', obj);
                manageGame(data.roomId, io);
            });

            socket.on("GAME_STARTED", function(data){
                console.log("Game started: " + gameInstanceMap.get(data.roomId));
            });

            socket.on("GAME_FORCE_STARTED", function(data){
                console.log("Game Force started: " + gameInstanceMap.get(data.roomId));
                console.log("The roomId: " + data.roomId);
                var gameInstance = gameInstanceMap.get(data.roomId);
                if(gameInstance.properties.hasOwnProperty("playersReady")){
                    console.log("doesn't create playersReady");
                    gameInstance.properties.playersReady = gameInstance.properties.playersReady + 1;
                }else{
                    console.log("creates playersReady");
                    gameInstance.properties["playersReady"] = 0;
                    gameInstance.properties.playersReady = gameInstance.properties.playersReady + 1;
                }
                //socket.emit("DATA_DUMP_TEST", dataDumpMap.get(data.roomId));
            });

            socket.on("CLIENT_DATA", function(data){
                //record client data
                console.log("In CLIENT_DATA callback data: " + data);
                console.log("In CLIENT_DATA callback roomId: " + data.roomId);
                updateData(data);

                //send back the data dump
                io.in(data.roomId).emit("DATA_DUMP_TEST", dataDumpMap.get(roomId));
                //io.in(data.roomId).emit("ALL_DATA", dataDumpMap.get(data.roomId));
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