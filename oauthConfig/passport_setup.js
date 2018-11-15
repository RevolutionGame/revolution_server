const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');


passport.use(
    new.GoogleStrategy(
        {
            //options for google strat
            clientID:'678432058435-i32ca9r52summcjtht1ams6a6j45davf.apps.googleusercontent.com',
            clientSecret:'jSgM7xX3FkGKMgglERrc2MK8 '
        }), () =>{
            //passport callback function
        }//end lambda
)