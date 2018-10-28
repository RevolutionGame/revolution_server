'use strict';

module.exports = (sequelize, DataTypes) => {
    const WeaponTypes = sequelize.define('weaponTypes', {
            
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: DataTypes.STRING,

        },{});

          
        return WeaponTypes;

};