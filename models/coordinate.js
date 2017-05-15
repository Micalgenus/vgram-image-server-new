/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   var coordinate = sequelize.define('coordinate', {
      ID: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      translation_group_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         references: {
            model: 'icl_translation',
            key: 'group_id'
         }
      },
      region_code: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      lat: {
         type: DataTypes.DECIMAL(20, 17),
         allowNull: false
      },
      lng: {
         type: DataTypes.DECIMAL(20, 17),
         allowNull: false
      }
   }, {
      tableName: 'coordinate',
      classMethods: {
         associate: function(models) {

            coordinate.belongsTo(models.icl_translation, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_group_id',
                  allowNull: false
               },
               targetKey: "group_id"
            });

            coordinate.hasMany(models.address, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'coordinate_id',
                  allowNull: false
               },
               sourceKey: "ID"
            });

         }
      }
   });

   return coordinate;
};
