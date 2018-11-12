var Hapi = require('hapi');
const passportSetup = require('./config/passport_setup');


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

  await server.register(require('vision'));

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

          return h.view('home');
      }
  });

  server.start(function()
{ 
  console.log("Server started"); 
});

};

start();

//** END SERVER OAUTH TESTING AREA */


