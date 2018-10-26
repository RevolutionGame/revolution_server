'use strict';

module.exports = (sequelize, DataTypes) => {
    const Ship = sequelize.define('ships', {
            
        },{});


        Ship.associate = function(models) {

            Ship.belongsToMany(models.players, { through: models.playerShips });
          
          }

          return Ship;

};