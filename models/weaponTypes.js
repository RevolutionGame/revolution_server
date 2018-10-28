'use strict';

module.exports = (sequelize, DataTypes) => {
    const WeaponTypes = sequelize.define('weaponTypes', {
            
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,

        },{});

          
        return WeaponTypes;

};