'use strict';

var exportedMethods = require('../controllers/game_controller.js');
var gameController = exportedMethods.getController;
var Joi = require('joi');

module.exports = function() {
    return [
        {
            method:'GET',
            path:'/v1/test/hello',
            config:{
              //auth:'token',
              handler: gameController.test
            }
          },
          {
            method:'GET',
            path:'/v1/test/hello2',
            config:{
              //auth:'token',
              handler: gameController.login
            }
          }
        ];
    }();