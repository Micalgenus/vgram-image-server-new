"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const vrpano = require('../modules/convert-vrpano-promise');
const sharp =  require('sharp');
const formidable = require('formidable');
const multiparty = require('multiparty');
const Promise = require('bluebird');
const fsp = require('fs-promise');
const sizeOf = require('image-size');
const baseDirectory = '/home/gimhose';
const baseImageDir = '/image-server/resources/';
const image_resize_information = [

];
const moment = require("moment");


/**
 * 일반 이미지 resizing 하는 부분
 * @param normal_images 일반 이미지의 배열
 */
const image_sizes_arr = {
    "1200" : 1200,
    "720" : 720
};
let normal_image_processing = function(normal_images) {
    console.log("normal_image_processing()");
    let result = [];
    return new Promise(function(resolve, reject) {
        return Promise.each(normal_images, function(image) {
            const d = new Date();
            let file_name = d.getFullYear() + ''+ d.getMonth()+ '' + d.getDate()+ '' + d.getHours() + ''+ d.getMinutes()+ '' + d.getSeconds()+ '' +d.getMilliseconds() + '' + Math.floor(Math.random() * 10000000) + 1;
            let original_path = baseDirectory + baseImageDir + 'original/' + file_name + '_' + image.name;
            return fsp.move(image.path, original_path).then(function () {
                let dimensions = sizeOf(original_path);
                result.push(file_name + '_' + image.name);

                if(dimensions.width > image_sizes_arr["1200"]) {
                    return sharp(original_path)
                        .resize(image_sizes_arr["1200"], dimensions.height * (image_sizes_arr["1200"] / dimensions.width))
                        .toFile(baseDirectory + baseImageDir + 'desktop/' + file_name + '_' + image.name).then(() => {
                            return sharp(original_path)
                            .resize(image_sizes_arr["720"], dimensions.height * (image_sizes_arr["720"] / dimensions.width))
                                .toFile(baseDirectory + baseImageDir + 'mobile/' + file_name + '_' + image.name);
                        });
                }
                else {
                    if(dimensions.width > image_sizes_arr["720"]) {
                        return sharp(original_path)
                            .toFile(baseDirectory + baseImageDir + 'desktop/' + image.name)
                            .resize(image_sizes_arr["720"], dimensions.height * (image_sizes_arr["720"] / dimensions.width)).then(() => {
                                return sharp(original_path)
                                    .resize(image_sizes_arr["720"], dimensions.height * (image_sizes_arr["720"] / dimensions.width))
                                    .toFile(baseDirectory + baseImageDir + 'mobile/' + file_name + '_' + image.name);
                            });
                    }
                    else {
                        return sharp(original_path)
                            .toFile(baseDirectory + baseImageDir + 'desktop/' + image.name).then(() => {
                                return sharp(original_path)
                                    .toFile(baseDirectory + baseImageDir + 'mobile/' + image.name);
                            });
                    }
                }
            })
        }).then(()=> {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        });
    });
};

let vr_image_processing = function(vr_images) {
    console.log("vr_image_processing()");
    let vrImagePaths = [];

    return new Promise(function(resolve, reject) {
        return Promise.each(vr_images, function(image) {
            console.log(image.name);
            const d = new Date();
            let file_name = d.getFullYear() + ''+ d.getMonth()+ '' + d.getDate()+ '' + d.getHours() + ''+ d.getMinutes()+ '' + d.getSeconds()+ '' +d.getMilliseconds() + '' + Math.floor(Math.random() * 10000000) + 1;
            let original_path = baseDirectory + baseImageDir + 'vr_image/' + file_name + '_' + image.name;

            return fsp.move(image.path, original_path).then(function () {
                vrImagePaths.push(original_path);
            });
        }).then(()=> {
            let folderName = moment.utc().format('YYYYMMDDHHmmssSS');

            return vrpano.convertVRPano(vrImagePaths, folderName).then(() => {
                console.log("complete");
            });
        }).catch(function (err) {
            reject(err);
        });
    });
};


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GET home page. */
router.post('/convert/media-attached', function(req, res, next) {
    // console.log(req.header('jwt'));
    // 다시 던질 수도 있어야 함.
	console.log("convert/media-attached");
	const form = new formidable.IncomingForm();
    let normal_images = [],
        vr_images = [],
        attached_files = [],
        fields = [];
    form.parse(req, function (err, fields, files) {
        console.log("form.parse");
    }).on('field', function(field, value) {
        console.log('[field] ' + field, value);
        fields.push([field, value]);
    }).on('file', function(field, file) {
        if(field=='normal_images') normal_images.push(file);
        else if(field=='vr_images') vr_images.push(file);
        else attached_files.push(file);
    }).on('end', function() {
    /*
        console.log("===============================");
        console.log(normal_images);
        console.log("===============================");
        console.log(vr_images);
        console.log("===============================");
        console.log(attached_files);
        console.log("===============================");

        console.log('-> upload done');
        console.log(normal_images.length);
*/
        normal_image_processing(normal_images).then((result) => {
            console.log("normal_image_processing complete()");
             let tmp = {
                 images : result,
                 size : [
                     "original",
                     "desktop",
                     "mobile"
                 ]
             };
            if(vr_images.length > 0) {
                vr_image_processing(vr_images).then((result) => {
                    res.json(tmp);
                });
            }
            else {
                res.json(tmp);
            }
         }).catch(() => {
             res.json({result:"개망"});
             console.log("1234");
         });
    });
});

module.exports = router;
