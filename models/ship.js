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
        filepath: DataTypes.STRING,


        //add forgien key from weapons type for name   
        type: {
            type: DataTypes.INTEGER,
            references: {
              model: 'ship_types',
              key: 'id' 
            }
            }, 

        
        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },

        updated_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }

        },{});


        Ship.associate = function(models) {

            Ship.belongsToMany(models.players, { through: models.playerShips });
          
          }

          return Ship;

};