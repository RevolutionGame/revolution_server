'use strict';

var scoreController = require('../controllers/score_controller.js');
var Joi = require('joi');

module.exports = function() {
    return [
        {
            method:'POST',
            path:'/v1/scores/get',
            config:{
              //auth:'token',
              handler: scoreController.getAllScores
            }
          },
          {
            method:'POST',
            path:'/v1/scores/player/get',
            config:{
              //auth:'token',
              handler: scoreController.getAllPlayerScores
            }
          }
        ];
    }();