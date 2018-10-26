"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');


function TestController(){};

TestController.prototype = (function(){
   

    function testApi(request, h){
        
        return 'Hello, world!';
    }

    return {
        test: testApi
    }
})();

var testController = new TestController();

module.exports = testController;