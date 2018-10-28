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
        filepath: DataTypes.STRING,



        //add forgien key from weapons type for name
        
        type: {
            type: DataTypes.INTEGER,
            references: {
              model: 'weapon_types',
              key: 'id' 
            }
            }, 

        



        created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },

        updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }

        },{});

        //cretae association between players and weapons (CREATE JOIN TABLE)
        Weapons.associate = function(models) {

            Weapons.belongsToMany(models.players, { through: models.playerWeapons });

        }

          return Weapons;

};