var fs = require("fs");
var path = require("path");
var db = {};
var Sequelize = require('sequelize');


/*
fs
  .readdirSync(__dirname)
  .filter(function(file){
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file){
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });
  */