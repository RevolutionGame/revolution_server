'use strict';

module.exports = (sequelize, DataTypes) => {
    const ShipTypes = sequelize.define('ship_types', {
            
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,

        },{});

          
        return ShipTypes;

};