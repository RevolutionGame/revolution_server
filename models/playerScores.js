'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlayerScore = sequelize.define('playerScores', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          score: DataTypes.INTEGER
        },{});




        return PlayerScore;
};
