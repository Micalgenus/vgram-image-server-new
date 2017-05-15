/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   var icl_translation = sequelize.define('icl_translation', {
      ID: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true
      },
      element_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         references: {
            model: 'post',
            key: 'ID'
         }
      },
      element_type: {
         type: DataTypes.STRING(45),
         allowNull: false,
         defaultValue: "post"
      },
      group_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         unique: true
      },
      language_code: {
         type: DataTypes.STRING(45),
         allowNull: false,
      },
      original_language_code: {
         type: DataTypes.STRING(45),
         allowNull: true,
         defaultValue: null
      }
   }, {
      tableName: 'icl_translation',
      classMethods: {
         associate: function(models) {

            icl_translation.belongsTo(models.post, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'element_id',
                  allowNull: false
               },
               targetKey: "ID"
            });

            icl_translation.hasOne(models.address, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_id',
                  allowNull: false
               },
               sourceKey: "ID"
            });

            icl_translation.hasMany(models.address, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_group_id',
                  allowNull: false
               },
               sourceKey: "group_id",
               as: "ByGroupId"
            });

            icl_translation.hasMany(models.coordinate, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_group_id',
                  allowNull: false
               },
               sourceKey: "group_id"
            });

         }
      },
      indexes: [
         // Create a unique index on email
         {
            primaryKey: true,
            fields: ['ID', 'group_id']
         }
      ]
   });

   return icl_translation;
};
