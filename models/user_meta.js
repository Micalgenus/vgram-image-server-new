/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var user_meta = sequelize.define('user_meta', {
    ID: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'user',
        key: 'ID'
      }
    },
    meta_key: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    meta_value: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    tableName: 'user_meta',
     classMethods: {
        associate: function(models) {
           user_meta.belongsTo(models.user, {
              onUpdate: "CASCADE",
              onDelete: "CASCADE",
              foreignKey: {
                 name: 'user_id',
                 allowNull: false
              },
              targetKey: "ID"
           });
        }
     }
  });

   return user_meta;
};
