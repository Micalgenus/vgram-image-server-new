/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hash_table', {
     key: {
        type: DataTypes.STRING(127),
        allowNull: false,
        primaryKey: true
     },
     value: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
     }
  }, {
    tableName: 'hash_table'
  });
};
