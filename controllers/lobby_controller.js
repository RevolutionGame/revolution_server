"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');


function LobbyController(){};

LobbyController.prototype = (function(){
   

    //put socket things here, ie onConnection method. otherwise the onConnection would be added everytiem the api call is made efefctively addinf an "onConnection" handler for every player. We only want the server to have one "onConnection" handler

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

var lobbyController = new LobbyController();

module.exports = lobbyController;