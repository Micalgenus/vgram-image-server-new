'use strict';

var _, vars;
var dotenv = require('dotenv'),
   _ = require('lodash');
const appRoot = require('app-root-path');
const path = require('path');

dotenv.config();    // loading .env and write to process.env

// root project path 찾는 방법에 대해서는 여러가지 방법이 구현되어 있으나,
// 현재는 이 방법을 사용한다.
const KRPANO_WIN_PATH = path.join(appRoot.toString(), "\\tools\\krpano-1.19-pr6-win");
const KRPANO_LINUX_PATH = path.join(appRoot.toString(), "/tools/krpano-1.19-pr6-linux");
const VTOUR_CONFIG_PATH = "templates/vtour-normal-custom.config";
const PANOTOUR_PATH = path.join("vtour", "panos");

vars = {
   RESOURCE_DIR: "resources",
   ATTACHED_DIR: "resources/attached",
   MEDIAS_DIR: "resources/medias",
   IMAGES_DIR: "resources/medias/images",
   VIDEOS_DIR: "resources/medias/videos",
   VRIMAGES_DIR: "resources/medias/vrimages",
   VTOURS_DIR: "resources/medias/vtours",
   POSTS_DIR: "resources/posts",
   USERS_DIR: "resources/users",
   TEMP_DIR: "resources/temp",

   KRPANO_WIN_PATH: KRPANO_WIN_PATH,
   KRPANO_LINUX_PATH: KRPANO_LINUX_PATH,
   VTOUR_CONFIG_PATH: VTOUR_CONFIG_PATH,
   PANOTOUR_PATH: PANOTOUR_PATH
};

_.forEach(vars, function(value, key){
  var keyType = typeof vars[key];

  if (_.has(process.env, key)){
    vars[key] = process.env[key];

    if (keyType === 'number') {
      vars[key] = +(vars[key]);
    }

    // cast any boolean strings to proper boolean values
    if (vars[key] === 'true'){
      vars[key] = true;
    }
    if (vars[key] === 'false'){
      vars[key] = false;
    }
  }

});

// Add external sources from environment vars
// vars.externalSources = {};
// Object.keys(vars).concat(Object.keys(process.env)).filter(function(key) {
//   return (/^EXTERNAL_SOURCE_/).test(key);
// }).forEach(function(key) {
//   vars.externalSources[key.substr('EXTERNAL_SOURCE_'.length).toLowerCase()] = process.env[key] || vars[key];
// });

// A few helpers to quickly determine the environment
vars.development = vars.NODE_ENV === 'development';
vars.test        = vars.NODE_ENV === 'test';
vars.production  = vars.NODE_ENV === 'production';


module.exports = vars;
