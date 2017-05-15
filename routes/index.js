"use strict";
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const vrpano = require('../modules/convert-vrpano-promise');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/test', function(req, res, next) {
    // return roomInfo.createRoomInfoAndVRPano(req, res)     // return promise
    //     .then(function() {
    //         req.flash('msg', res.i18n('post create completed'));
    //         return res.redirect(202, '/room');
    //     }).catch(next);

    console.log("krpano 실행 시킬 부분");
    let vrImagePaths = [];
    _.each(req.mediaInfo, media => {    // vr파일이 저장된 절대경로 추출
        if (_.eq(media.media_type, value.mediaType.VR_IMAGE)) {
            vrImagePaths.push(media.fullPath);
        }
    });

    let folderName = moment.utc().format('YYYYMMDDHHmmssSS');

    // 3. vrpano 변환 -> media(vtour) 정보 DB 저장 -> post_media_relationship에 vtour 정보 저장
    vrpano.convertVRPano(vrImagePaths, folderName).then(() => {
        console.log("test");
    });
});
module.exports = router;
