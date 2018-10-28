'use strict';

module.exports = (sequelize, DataTypes) => {
    const Ship = sequelize.define('ships', {
            
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        speed: DataTypes.INTEGER,
        handling: DataTypes.INTEGER,
        armor: DataTypes.INTEGER,
        filepath: DataTypes.STRING

       

        },{});


        Ship.associate = function(models) {

            Ship.belongsToMany(models.players, { through: models.playerShips });

            Ship.belongsTo(models.shipTypes, {as: 'ShipType'}); 
            
          
          }

          return Ship;

};