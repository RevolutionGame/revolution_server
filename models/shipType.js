'use strict';

module.exports = (sequelize, DataTypes) => {
    const ShipType = sequelize.define('shipTypes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          type: DataTypes.STRING
        },{});

        ShipType.associate = function(models) {

            ShipType.hasOne(models.ships, {as: 'ShipType', foreignKey : 'shipTypeId'});
          
          }

        return ShipType;
};
