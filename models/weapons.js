'use strict';

module.exports = (sequelize, DataTypes) => {
    const Weapons = sequelize.define('weapons', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        weapon_name: DataTypes.STRING,
        power: DataTypes.INTEGER,
        filepath: DataTypes.STRING

        },{});

        //cretae association between players and weapons (CREATE JOIN TABLE)
        Weapons.associate = function(models) {

            Weapons.belongsToMany(models.players, { through: models.playerWeapons });

            Weapons.belongsTo(models.weaponTypes, {as: 'WeaponType'}); 

        }

          return Weapons;

};