"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var models = require('../models');


const PlayerScore = models.playerScores;
const Player = models.players;

PlayerScore.belongsTo(Player)

function ScoreController(){};

ScoreController.prototype = (function(){
   

    function getAllScores(request, h){

        var getScores = new Promise(function(resolve, reject) {

            PlayerScore.findAll({order: [['score', 'DESC']],include:[{model: Player}]})
            .then((scores => {
                resolve(scores);
            }))
        })
        
        return getScores;
    }

    function getAllPlayerScores(request, h){

        var getPlayerScores = new Promise(function(resolve, reject) {

            PlayerScore.findAll({where: {playerId: request.payload.id},order: [['score', 'DESC']]})
            .then((scores => {
                resolve(scores);
            }))
        })
        
        return getPlayerScores;
    }


    return {
        getAllScores: getAllScores,
        getAllPlayerScores: getAllPlayerScores
    }
})();

var scoreController = new ScoreController();

module.exports = scoreController;