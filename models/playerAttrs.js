'use strict';

module.exports = (sequelize, DataTypes) => {
    const PlayerAttr = sequelize.define('playerAttrs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          deviceToken: DataTypes.STRING
        },{});


        return PlayerAttr;
};
