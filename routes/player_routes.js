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
          },
        
          //*****************NEW AUTH ADDON ROUTE **********************/

          {
            method: '*',
            path: '/auth/twitter',
            config : {
              tags        : ['user', 'auth', 'session', 'login'],
              description : 'Begin a user session.',
              auth        : {
                  strategy : 'twitter',
                  mode     : 'try'
              },
      
              handler: function(request, reply) {
        
                if (!request.auth.isAuthenticated) {
                  return ('Authentication failed: ' + request.auth.error.message);
                }
        
                //Just store a part of the twitter profile information in the session as an example. You could do something
                //more useful here - like loading or setting up an account (social signup).
                const profile = request.auth.credentials.profile;
                //log out profile to see what is returned
                console.log(profile);

                //CANT SEEM TO SET VALUES HERE, WHEN TRY TO ACCESS VALUES ARE UNDEFINED!!!
                //HAVE BEEN JUST PASSING REQUEST AND ACCESSING VALUES DIRECTLY
                request.cookieAuth.set({
                  twitterId: request.auth.credentials.profile.id,
                  username: profile.displayName,
                  displayName: profile.displayName,
                  name: profile.raw.name,
                  email: profile.raw.email
                });
      
                console.log('checking oauth session:  ' + request.auth.credentials.twitterId);

                //redirect to login
                return playerController.authLogin(request, reply);
              }
            }
          },

          {
            method: '*',
            path: '/auth/google',
            config : {
              tags        : ['user', 'auth', 'session', 'login'],
              description : 'Begin a user session.',
              auth        : {
                  strategy : 'google',
                  mode     : 'try'
              },
      
              handler: function(request, reply) {
        
                if (!request.auth.isAuthenticated) {
                  return ('Authentication failed: ' + request.auth.error.message);
                }
        
                //Just store a part of the twitter profile information in the session as an example. You could do something
                //more useful here - like loading or setting up an account (social signup).
                const profile = request.auth.credentials.profile;
                
                //log out profile to see what is returned
                console.log(profile);

                //CANT SEEM TO SET VALUES HERE, WHEN TRY TO ACCESS VALUES ARE UNDEFINED!!!
                //HAVE BEEN JUST PASSING REQUEST AND ACCESSING VALUES DIRECTLY
                request.cookieAuth.set({
                  googleId: request.auth.credentials.profile.id,
                  username: profile.displayName,
                  displayName: profile.displayName,
                  name: profile.raw.name,
                  email: profile.raw.email
                });

                //redirect to login
                return playerController.authLogin(request, reply);
              }
            }
          }

        ];
    }();