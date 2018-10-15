var Hapi = require('hapi');

var server = new Hapi.Server({
    port: 3004,
    host: 'localhost',
    routes: { cors: true }
})
var routes = require('./routes');

var models = require('./models');


for (var route in routes) {
    server.route(routes[route]);
  }
  //server.connection({ routes: { cors: true } })

  server.start(function(){
    console.log("Server started");
  });