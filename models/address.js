/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   var address = sequelize.define('address', {
      ID: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      translation_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         references: {
            model: 'icl_translation',
            key: 'ID'
         }
      },
      coordinate_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         references: {
            model: 'coordinate',
            key: 'ID'
         }
      },
      post_code: {
         type: DataTypes.STRING(45),
         allowNull: false,
         defaultValue: null
      },
      region_code: {
         type: DataTypes.STRING(45),
         allowNull: true,
      },
      addr1: {
         type: DataTypes.STRING(127),
         allowNull: false
      },
      addr2: {
         type: DataTypes.STRING(127),
         allowNull: false
      },
      detail: {
         type: DataTypes.STRING(127),
         allowNull: true,
         defaultValue: null
      },
      extra_info: {
         type: DataTypes.STRING(127),
         allowNull: true,
         defaultValue: null
      },
      locale: {
         type: DataTypes.STRING(45),
         allowNull: false
      },
      translation_group_id: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         references: {
            model: 'icl_translation',
            key: 'group_id'
         }
      }
   }, {
      tableName: 'address',
      classMethods: {
         associate: function(models) {

            address.belongsTo(models.icl_translation, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_id',
                  allowNull: false
               },
               targetKey: "ID"
            });

            address.belongsTo(models.icl_translation, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'translation_group_id',
                  allowNull: false
               },
               targetKey: "ID",
               as: "ByGroupId"
            });

            address.belongsTo(models.coordinate, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               foreignKey: {
                  name: 'coordinate_id',
                  allowNull: false
               },
               targetKey: "ID"
            });

         }
      }
   });

   return address;
};
