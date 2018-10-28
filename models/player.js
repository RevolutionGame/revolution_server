//indicates that the code should be executed in script mode
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

        //create association between player and ships (CREATE JOIN TABLE)
        Player.associate = function(models) {

            Player.belongsToMany(models.ships, { through: models.playerShips });

        }
        Player.associate = function(models) {

        //Create association between player and weapons (CREATE JOIN TABLE)
        Player.belongsToMany(models.weapons, { through: models.playerWeapons });

        }  

          return Player;
};