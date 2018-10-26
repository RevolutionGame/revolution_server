'use strict';

module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define('players', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            cell_number: DataTypes.STRING,
            email: {
            type: DataTypes.STRING,
            unique: true
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


        Player.associate = function(models) {

            Player.belongsToMany(models.ships, { through: models.playerShips });
          
          }

          return Player;
};