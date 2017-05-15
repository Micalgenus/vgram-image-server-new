/**
 * Created by KIMSEONHO on 2016-11-12.
 * setting sequelize test database, in tests/data folder.
 */
const _ = require('lodash');
var path = require('path');
var scriptName = path.basename(__filename);

const log = require('console-log-level')({
   prefix: function () {
      return new Date().toISOString() + ", " + scriptName;
   },
   level: 'debug'
});

var models = require("../models");

module.exports = function(testDB) {
   if (testDB) {
      // Foreign Key 때문에 입력 순서대로 넣어야한다.
      var modelnames = ["user", "user_meta", "post", "post_meta", "attached", "media", "room", "post_media_relationship",
      "post_attached_relationship", "user_post_relationship", "user_user_relationship", "user_post_like_relationship",
      "hash_table", "icl_translation", "coordinate", "address", "tag", "tag_relationship"];

      return models.sequelize.Promise.each(_.map(testDB), (item, index, length) => {
         log.debug("--- " + index + " ---" +  "Create Test Database : " + modelnames[index]);

         return models[modelnames[index]].bulkCreate(testDB[modelnames[index]]);
      }).then(function () {
         log.debug('Complete create Test Database');
         return models.sequelize.Promise.resolve('Complete create Test Database');
      }).catch(function (err) {
         log.debug('create Test Database Error ' + err);
         return models.sequelize.Promise.reject(err);
      });

   } else {
      return models.sequelize.Promise.reject('no testDB is found');
   }
}
