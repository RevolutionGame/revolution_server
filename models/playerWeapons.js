'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlayerWeapons = sequelize.define('playerWeapons', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          status: DataTypes.STRING
        },{});

        return PlayerWeapons;
};