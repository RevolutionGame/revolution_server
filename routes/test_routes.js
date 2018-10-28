'use strict';

var testController = require('../controllers/test_controller.js');
var Joi = require('joi');

module.exports = function() {
    return [
        {
            method:'GET',
            path:'/v1/test/hello',
            config:{
              //auth:'token',
              handler: testController.test
            }
          },
          {
            method:'GET',
            path:'/v1/test/hello2',
            config:{
              //auth:'token',
              handler: testController.login
            }
          }
        ];
    }();