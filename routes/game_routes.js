'use strict';

var exportedMethods = require('../controllers/game_controller.js');
var gameController = exportedMethods.getController;
var Joi = require('joi');

module.exports = function() {
    return [
        {
            method:'POST',
            path:'/v1/game/joinclassic',
            config:{
              //auth:'token',
              handler: gameController.joinclassic
            }
          },
          {
            method:'GET',
            path:'/v1/game/joinarcade',
            config:{
              //auth:'token',
              handler: gameController.joinarcade
            }
          }

        ];
    }(); //end module.exports
