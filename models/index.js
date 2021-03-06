var fs = require("fs");
var path = require("path");
var db = {};
var Sequelize = require('sequelize');

var config = require(__dirname + '../../config/config.json')["env"];

//setup db connection
var sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

//creating array of models
fs
  .readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file){
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

  //sync the database
  sequelize.sync({ force: false }).then(res =>{
    //console.log(res);

  });

  //package up db models for export
  Object.keys(db).forEach(function(modelName){
    if("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });
  
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  
  module.exports = db;