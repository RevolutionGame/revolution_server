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

        PlayerAttr.associate = function(models) {

            PlayerAttr.hasOne(models.players, {as: 'PlayerAttr', foreignKey : 'playerAttrId'});
          
          }

        return PlayerAttr;
};
