var Hapi = require('hapi');

const WebSocket = require('ws');

var server = new Hapi.Server({
    port: (process.env.PORT || 3004),
    host: '0.0.0.0',
    routes: { cors: true }
});



var routes = require('./routes');

var models = require('./models');


  //server.connection({ routes: { cors: true } })

  var io = require('socket.io')(server.listener); 
  var controllerExportMethods = require('./controllers/game_controller');
  controllerExportMethods.socketInfo(server, io);
//server start test
const start = async () => {

  await server.register(  [ require('bell'), require('hapi-auth-cookie')  ] );

  //server cookie strategy
  server.auth.strategy('session', 'cookie', {
    password: 'secret_cookie_encryption_password', //Use something more secure in production
    redirectTo: '/auth/twitter', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
});

  //TWITTER AUTH STRATEGY
  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    scope(request) {

      const scopes = ['public_profile', 'email'];
      if (request.query.wantsSharePermission) {
        scopes.push('publish_actions');
      }
      return scopes;
    },
    config: {
      getMethod: 'account/verify_credentials',
      getParams: {include_email:'true' }//doesn't work without quotes!
    },
    password: 'cookie_encryption_password_secure',
    clientId: 'U3scAkQRIkfxoZc9BhDcuJbb6',
    clientSecret: 'HSsFGPF3mETMvPS27xQCf8fCw6mOtfx4oQ5ymbYJ1dVZM8fMmE',
    isSecure: false     // Terrible idea but required if not using HTTPS especially if developing locally
});

//GOOGLE AUTH STRATEGY
server.auth.strategy('google', 'bell', {
  provider: 'google',
  password: 'cookie_encryption_password_secure',
  isSecure: false,
  clientId: '678432058435-i32ca9r52summcjtht1ams6a6j45davf.apps.googleusercontent.com',
  clientSecret: 'jSgM7xX3FkGKMgglERrc2MK8',
  location: 'http://revtest2018.herokuapp.com'
});

  server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {

        
        console.log('testing3');
          return server.info.uri;
      }
  });

    //Setup the routes (this could be done in an own file but for the sake of simplicity isn't)
  
    //NEED TO CHECK AGAINST DATABASE, IF USER NOT IN DATABASE
    //ADD USER TO DATABASE AND LOGIN
    server.route({
      method: 'GET',
      path: '/authed',
      config: {
        auth: {
          strategy : 'session',
          mode     : 'try'
      }, //<-- require a session for this, so we have access to the twitter profile
        handler: function(request, reply) {
  
          //Return a message using the information from the session
          return ('Hello, ' + request.auth.credentials.email + '!');
        }
      }
    });

    //REGISTER ROUTES TO SERVER FROM ROUTES FOLDER
    for (var route in routes) {
      server.route(routes[route]);
    }

  server.start(function()
{ 
  console.log("Server started"); 
});

};

start();