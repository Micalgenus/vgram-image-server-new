"use strict";
/**
 * Created by KIMSEONHO on 2017-03-07.
 */

const _ = require('lodash');

/**
 *
 * @param value
 * @param keys
 */
exports.getLangPair = function (values, i18nInstance) {
   let obj = {};

   if (!i18nInstance) {
      return new Error("no i18n instance found");
   }

   _.each(values, function (value, key) {

      obj[key] = _.map(value, function (val) {

         let func = i18nInstance.i18n || i18nInstance.__;

         return {
            name: func(key)[val] || func(key)[val],
            value: val
         }
      });

      obj[key] = _.compact(obj[key]);
   });

   return obj;
}
