/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
   var media = sequelize.define('media', {
      ID: {
         type: DataTypes.INTEGER(11),
         allowNull: false,
         primaryKey: true,
         autoIncrement: true
      },
      media_group: {
         type: DataTypes.STRING,
         allowNull: true
      },
      media_type: {
         type: DataTypes.STRING,
         allowNull: false
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
      tableName: 'media',
      classMethods: {
         associate: function(models) {

            media.belongsToMany(models.post, {
               onUpdate: "CASCADE",
               onDelete: "CASCADE",
               through: models.post_media_relationship,
               foreignKey: {
                  name: 'media_id',
                  allowNull: false
               },
               as: "UseCases"
            });

            media.hasOne(models.room, {
               onUpdate: "CASCADE",
               onDelete: "RESTRICT",
               foreignKey: {
                  name: 'thumbnail_media_id',
                  allowNull: false
               },
               sourceKey: "ID",
               as: "ThumbImage"
            });

         }
      }
   });

   return media;
};
