const path = require('path');
const rootPath = require('app-root-path');      // path.normalize(__dirname + '/..');
const NODE_ENV = process.env.NODE_ENV || 'development';
const env_var = require("./environment_vars");

var config = {
   "development": {
      "hostName": "localhost",    // actual hostname for resource hosting
      "dialect": "sqlite",
      "storage": "./db.development.sqlite"
   },

   "test": {
   },

   "production": {
      "username": "root",
      "password": "hitit113112",
      "database": "cozyhouzz",
      "host": "api.cozyhouzz.co.kr",    // for init sequellize
      "hostName": "api.cozyhouzz.co.kr",    // actual hostname for resource hosting
      "dialect": "mysql",
      "pool": {
         "max": 50,
         "min": 10,
         "idle": 10000
      },
      // Configuring Mailgun API for sending transactional email
      "mailgun_priv_key": "mailgun private key here",
      // Configuring Mailgun domain for sending transactional email
      "mailgun_domain": "mailgun domain here",
      // Mailchimp API key
      "mailchimpApiKey": "mailchimp api key here",
      // Stripe API key
      "stripeApiKey": "stripe api key goes here"
   }
}

config[NODE_ENV].secret = "cozyhouzz by moblab";  // Secret key for JWT signing and encryption
config[NODE_ENV].root = rootPath;
config[NODE_ENV].app = {
   name: 'cozyhouzz'
};

config[NODE_ENV].krpano = {
   WIN_PATH: env_var.KRPANO_WIN_PATH,
   LINUX_PATH: env_var.KRPANO_LINUX_PATH,
   VTOUR_CONFIG_PATH: env_var.VTOUR_CONFIG_PATH,
   PANOTOUR_PATH: env_var.PANOTOUR_PATH
}

config[NODE_ENV].resource = {
   DIR: env_var.RESOURCE_DIR,
   ATTACHED_DIR: env_var.ATTACHED_DIR,
   MEDIAS_DIR: env_var.MEDIAS_DIR,
   IMAGES_DIR: env_var.IMAGES_DIR,
   VIDEOS_DIR: env_var.VIDEOS_DIR,
   VRIMAGES_DIR: env_var.VRIMAGES_DIR,
   VTOURS_DIR: env_var.VTOURS_DIR,
   POSTS_DIR: env_var.POSTS_DIR,
   USERS_DIR: env_var.USERS_DIR,
   TEMP_DIR: env_var.TEMP_DIR,
}

module.exports = config[NODE_ENV];
