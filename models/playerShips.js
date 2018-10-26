'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlayerShips = sequelize.define('playerShips', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          status: DataTypes.STRING
        },{});

        return PlayerShips;
};
