'use strict';

if (!process.env.CUSTOMISE_ENV) {
   env();
}

var express, app, ir, env, Img, streams;

express = require('express');
app     = express();
ir      = require('image-resizer');
env     = ir.env;
Img     = ir.img;
streams = ir.streams;

app.directory = __dirname;
ir.expressConfig(app);

app.get('/favicon.ico', function (request, response) {
  response.sendStatus(404);
});

/**
Return the modifiers map as a documentation endpoint
*/
app.get('/modifiers.json', function(request, response){
  response.json(ir.modifiers);
});


/**
Some helper endpoints when in development
*/
if (env.development){
  // Show a test page of the image options
  app.get('/test-page', function(request, response){
    response.render('index.html');
  });

  // Show the environment variables and their current values
  app.get('/env', function(request, response){
    response.json(env);
  });
}


/*
Return an image modified to the requested parameters
  - request format:
    /:modifers/path/to/image.format:metadata
    eg: https://my.cdn.com/s50/sample/test.png
*/
app.get('/*?', function(request, response){
  var image = new Img(request);

  image.getFile()
    .pipe(new streams.identify())
    .pipe(new streams.normalize())
    .pipe(new streams.resize())
    .pipe(new streams.filter())
    .pipe(new streams.optimize())
    .pipe(streams.response(request, response));
});


/**
Start the app on the listed port
*/
app.listen(app.get('port'));


function env(){
   var dotenv  = require('dotenv'),
      chalk = require('chalk'),
      _ = require('lodash'),
      fs = require('fs'),
      config = {},
      file,
      home = process.env.HOME;

   // useful for storing common AWS credentials with other apps
   if ( fs.existsSync(home + '/.awsrc') ){
      file = fs.readFileSync(home + '/.awsrc');
      _.extend(config, dotenv.parse(file));
   }

   if ( fs.existsSync('.env') ){
      file = fs.readFileSync('.env');
      _.extend(config, dotenv.parse(file));
   }

   // print out the env vars
   _.each(config, function(value, key){
      process.env[key] = value;
      console.log('Env:', key, chalk.cyan(value));
   });

   return config;
}
