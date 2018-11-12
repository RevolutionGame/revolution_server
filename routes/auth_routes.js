'use strict';

var Joi = require('joi');


module.exports = function() {
    return [
    //auth login
            {
                method: 'GET',
                path: '/auth/login',
                handler: function (request, h) {
                   return h.view('login');
                }
            },//end

            {
                method: 'GET',
                path: '/auth/google',
                handler: function() {
                    var passport = request.server.plugins.passport;
                    return passport.Authenticator('google', { scope: ['profile']});
                }//end handler
                
            },//end

            {
                method: 'GET',
                path: '/auth/logout',
                handler: function (request, h) {
                    //handle with passport
                   return ('logout');
                }
            },//end

        ];//end returns
    }();