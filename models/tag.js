/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   var tag = sequelize.define('tag', {
      ID: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      name: {
         type: DataTypes.STRING(127),
         allowNull: false,
         unique: true
      },
      tagging_count: {
         type: DataTypes.INTEGER(11).UNSIGNED,
         allowNull: true,
         defaultValue: 1
      },
      createdAt: {
         type: DataTypes.DATE,
         allowNull: true,
         defaultValue: DataTypes.NOW
      },
      updatedAt: {
         type: DataTypes.DATE,
         allowNull: false,
         defaultValue: DataTypes.NOW
      }
   }, {
      tableName: 'tag',
      classMethods: {
         associate: function(models) {

            tag.belongsToMany(models.post, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               through: models.tag_relationship,
               foreignKey: {
                  name: 'tag_id',
                  allowNull: false
               }
            });

         }
      }
   });

   return tag;
};
