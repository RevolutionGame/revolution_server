"use strict";

var Hapi = require('hapi');

var uuid = require('node-uuid');

var crypto = require('crypto');

var models = require('../models');

const Player = models.players;
const PlayerAttr = models.playerAttrs;


function PlayerController(){};

PlayerController.prototype = (function(){

    var errorData = {error:""};
    var successData = {msg:"",data:{}};

    function encrypt(password) {
        var hash = crypto.createHash('md5').update(password).digest("hex");
        return hash;
      }
   

    function login(request, h){

        var playerEmail = request.payload.email;

    var getPlayer = new Promise(function(resolve, reject) {


        Player.findOne({ where: {email: request.payload.email},include:[{model: models.playerAttrs, as: 'PlayerAttrs'}]})
        .then((player => {
            if(player != null){
                if(player.password_hash == encrypt(request.payload.pass)){

                    successData.msg = "player found";
                    successData.data = player;
                    resolve(successData);
                }else{
                    errorData.error = "incorrect password";

                    resolve(errorData);
                }
            

            }else{
                errorData.error = "email not found";
                resolve(errorData);
            }

            
        })
      );

        
    });

        
        
        return getPlayer;
    }

    function create(request, h){

        var playerEmail = request.payload.email;
        var playerFullName = request.payload.fullName;
        var playerUsername = request.payload.username;
        var playerCellNumber = request.payload.playerCellNumber;
        var hashPass = encrypt(request.payload.pass);

    var getPlayer = new Promise(function(resolve, reject) {


        Player.findOne({ where: {email: playerEmail} })
        .then((players => {

            if(players != null){
                resolve({error:"User Email Exists"});
            }else{
                Player.create({ email: playerEmail, password_hash: hashPass, name:playerFullName, cell_number: playerCellNumber, username:playerUsername }).then(player => {

                    player.createPlayerAttrs({"deviceToken":null}); 

                    successData.msg = "player created";
                    successData.data = player
                    resolve(successData);
                  }).catch(function(err) {
                    // print the error details
                    errorData.error = "Username already exists"
                    resolve(errorData);
                });

            }
            
        })
      );

        
    });

        
        
        return getPlayer;
    }

        //********************* NEW ********************/
    //AUTH LOGIN
    //log in players using Oauth info
    //use user email/name obtained from oauth request to 
    //create/login user
    function authLogin(request, h){

        var playerEmail = request.auth.credentials.profile.raw.email;

        var getPlayer = new Promise(function(resolve, reject) {

        //console logging
        console.log('made it to auth login, will now display email');
        console.log(request.auth.credentials.profile.raw.name);

        console.log('checking to see if player email exist.');
        Player.findOne(  { where: {email: request.auth.credentials.profile.raw.email},include:[{model: models.playerAttrs, as: 'PlayerAttrs'}]}  )
        .then((player => {
            if(player != null){
                    console.log('Found player email in DB');
                    successData.msg = "player found";
                    successData.data = player;
                    resolve(successData);

            }else{
                console.log('Player email not found IN DB');
                console.log(player)
                //else player not found, add player to database and then return
                //player as logged in
                errorData.error = "email not found, adding oauthed player to database to login";
                var playerEmail = request.auth.credentials.profile.raw.email;
                var playerFullName = request.auth.credentials.profile.raw.name;
                var playerUsername = request.auth.credentials.profile.displayName;
                var playerCellNumber = '0000000000';
                var hashPass = 'OAUTHED';

                //CREATE THE PLAYER
                console.log('inserting new player into db.');
                Player.create({ email: playerEmail, password_hash: hashPass, name:playerFullName, cell_number: playerCellNumber, username:playerUsername }).then(player => {

                    player.createPlayerAttrs({"deviceToken":null}); 

                    successData.msg = "player created";
                    successData.data = player
                    resolve(successData);
                  }).catch(function(err) {
                    // print the error details
                    errorData.error = err;
                    resolve(errorData);
                });
            }

            
        })
      );

        
    });
        return getPlayer;
    }

    return {
        login: login,
        create: create,
        authLogin: authLogin
    }
})();

var playerController = new PlayerController();

module.exports = playerController;