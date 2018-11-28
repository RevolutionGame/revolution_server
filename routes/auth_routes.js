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
                path: '/auth/logout',
                handler: function (request, h) {
                    //handle with passport
                   return ('logout');
                }
            },//end

        ];//end returns
    }();