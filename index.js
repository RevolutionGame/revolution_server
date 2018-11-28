var Hapi = require('hapi');
const passportSetup = require('./oauthConfig/passport_setup');
const Boom = require('boom');


var server = new Hapi.Server({
    //port: (process.env.PORT || 3004),
    port: (3004),
    //host: '0.0.0.0',
    host: 'localhost',
    routes: { cors: true }
});



var routes = require('./routes');

var models = require('./models');


for (var route in routes) {
    server.route(routes[route]);
  }
  //server.connection({ routes: { cors: true } })

  var io = require('socket.io')(server.listener); 
  var controllerExportMethods = require('./controllers/game_controller');
  controllerExportMethods.socketInfo(server, io);

//**SERVER OAUTH TESTING AREA*/

const start = async () => {

  await server.register(  [   require('vision'), require('bell'), require('hapi-auth-cookie')  ] );


  server.auth.strategy('session', 'cookie', {
    password: 'secret_cookie_encryption_password', //Use something more secure in production
    redirectTo: '/auth/twitter', //If there is no session, redirect here
    isSecure: false //Should be set to true (which is the default) in production
});

  server.auth.strategy('twitter', 'bell', {
    provider: 'twitter',
    password: 'cookie_encryption_password_secure',
    clientId: 'pZo5K4IwxSjyfcfyQuupFpnNJ',
    clientSecret: 'd0PbbdaqRdzCj2bFj33QzNRVefLi11novJbujjBkvzpWTj8NFk',
    isSecure: false     // Terrible idea but required if not using HTTPS especially if developing locally
});

  server.views({
      engines: {
          html: require('handlebars')
      },
      relativeTo: __dirname,
      path: 'templates'
  });

  server.route({
      method: 'GET',
      path: '/',
      handler: function (request, h) {

        console.log('testing3');
          return h.view('home');
      }
  });

    //Setup the routes (this could be done in an own file but for the sake of simplicity isn't)
    server.route({
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
  
          request.cookieAuth.set({
            twitterId: profile.id,
            username: profile.username,
            displayName: profile.displayName
          });
  
          return reply.redirect('/authed');
        }
      }
    });
  
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
          return ('Hello, ' + request.auth.credentials.displayName + '!');
        }
      }
    });

  server.start(function()
{ 
  console.log("Server started"); 
});

};

start();

//** END SERVER OAUTH TESTING AREA */


