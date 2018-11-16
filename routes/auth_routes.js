var Joi = require('joi');
const passport = require('passport');


module.exports = function() {
    return [
    //auth login
            {
                method: 'GET',
                path: '/auth/login',
                handler: function (request, h) {
                   return h.view('login');
                }
            },//end

            {
                method: 'GET',
                path: '/auth/google',
                handler: function(request, h) {
                    var googleAuth = request.server.plugins.passprt;
                    googleAuth.authenticate(  'google',   {scope: ['profile']}  );
                    //return passport.Authenticator(  'google', {scope: ['profile']}  );
                    //passport.authenticate(   'google',   {scope: ['profile']}     );
                }//end function
                
            },//end

            {
                method: 'GET',
                path: '/auth/logout',
                handler: function (request, h) {
                    //handle with passport
                   return ('logout');
                }
            },//end

        ];//end returns
    }();