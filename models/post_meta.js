/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var post_meta = sequelize.define('post_meta', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'post',
        key: 'ID'
      }
    },
    meta_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meta_value: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    tableName: 'post_meta',
     classMethods: {
        associate: function(models) {

           post_meta.belongsTo(models.post, {
              onUpdate: "CASCADE",
              onDelete: "CASCADE",
              foreignKey: {
                 name: 'post_id',
                 allowNull: false
              },
              targetKey: "ID"
           });

        }
     }
  });

   return post_meta
};
