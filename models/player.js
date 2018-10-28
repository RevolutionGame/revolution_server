//indicates that the code should be executed in script mode
'use strict';

var crypto = require('crypto');

function encrypt(password) {
  var hash = crypto.createHash('md5').update(password).digest("hex");
  return hash;
}


module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define('players', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: DataTypes.STRING,
            username: {
                type: DataTypes.STRING,
                unique: true
                },
            cell_number: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                unique: true
                },
            password_hash: DataTypes.STRING,
            password:{
                type: DataTypes.VIRTUAL,
                set:function(val) {
                   var hashedPassword = encrypt(val);
                   this.setDataValue('password', val);
                   this.setDataValue('password_hash', hashedPassword);
                }
              }
        },{});

        //create association between player and ships (CREATE JOIN TABLE)
        Player.associate = function(models) {

            Player.belongsToMany(models.ships, { through: models.playerShips });

            Player.hasOne(models.playerAttrs, { as: 'PlayerAttrs' });

            Player.belongsToMany(models.weapons, { through: models.playerWeapons });

        }
 

          return Player;
};