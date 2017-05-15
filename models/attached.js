/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var attached = sequelize.define('attached', {
    ID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    group: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meta_value: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'attached',
     classMethods: {
        associate: function(models) {

           attached.belongsToMany(models.post, {
              onUpdate: "CASCADE",
              onDelete: "CASCADE",
              through: models.post_attached_relationship,
              foreignKey: {
                 name: 'attached_id',
                 allowNull: false
              },
              as: "UseCases"
           });

        }
     }
  });

   return attached;
};
