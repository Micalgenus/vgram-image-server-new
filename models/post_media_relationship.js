/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_media_relationship', {
    post_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
       primaryKey: true,
       references: {
        model: 'post',
        key: 'ID'
      }
    },
    media_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
       primaryKey: true,
       references: {
        model: 'media',
        key: 'ID'
      }
    }
  }, {
    tableName: 'post_media_relationship'
  });
};
