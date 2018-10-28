'use strict';

var playerController = require('../controllers/player_controller.js');
var Joi = require('joi');

module.exports = function() {
    return [
        {
            method:'POST',
            path:'/v1/player/login',
            config:{
              //auth:'token',
              handler: playerController.login
            }
          },
          {
            method:'POST',
            path:'/v1/player/create',
            config:{
              //auth:'token',
              handler: playerController.create
            }
          }
        ];
    }();