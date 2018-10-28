var Hapi = require('hapi');

var server = new Hapi.Server({
    port: (process.env.PORT || 3004),
    host: '0.0.0.0',
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

  server.start(function(){
    console.log("Server started");
  });