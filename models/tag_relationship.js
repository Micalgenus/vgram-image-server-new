/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tag_relationship', {
     tag_id: {
        type: DataTypes.INTEGER(11).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        references: {
           model: 'tag',
           key: 'ID'
        }
     },
     post_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
       primaryKey: true,
       references: {
        model: 'post',
        key: 'ID'
      }
    },

  }, {
    tableName: 'tag_relationship'
  });
};
