/**
 * Created by KIMSEONHO on 2016-09-02.
 */
"use strict";

const multer = require('multer');
// const md5 = require('node-md5');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');

// var env = process.env.NODE_ENV || "development";
var config = require("../config/main");
var value = require("../utils/staticValue");

// 기존의 mkdir은 비동기여서 error가 나는 경우가 있음. 그래서 promise를 하던지 settimeout을 약간 걸어줘야됨
const mkdirp = require('mkdir-promise');
const log = require('console-log-level')({
  prefix: function () {
    return new Date().toISOString()
  },
  level: process.env.LOG_LEVEL
});

// attached - 첨부파일
// medias - 이미지/동영상/VR이미지/VR동영상등
// posts - post 설정파일(현재는 사용하지 않음)
// users - user 설정파일(현재는 profile 저장하는 용도로만 사용)
// let bizMemberPath = path.join(ROOT_IMAGE_DIR, value.dirName.ATTACHED);
// let buildCaseInfoPath = path.join(ROOT_IMAGE_DIR, value.dirName.MEDIAS);
// let roomInfoPath = path.join(ROOT_IMAGE_DIR, value.dirName.POSTS);
// let editorImagePath = path.join(ROOT_IMAGE_DIR, value.dirName.USERS);

_.forEach(config.resource, function(value, key) {
   mkdirp(path.join(value)).then(() => {
      log.debug(key + ' created : ' + value);
   }, err => {
      if (err) {
         log.error(key + ' mkdirp error : ' + err);
      }
   });

});


// Setting file upload to save file
// error 반환(서버 이상시 httpCode = 422, statusCode = 9)
// 수정시 중복체크를 할 수 있도록 fileFilter를 구현하기
// 파일 갯수마다 호출이 된다.
var postInfoStorage = multer.diskStorage({
  // fieldname == vrImage, previewImage
  destination: function (req, file, callback) {
     let newPath = config.resource.TEMP_DIR;

     if (file.fieldname == value.fieldName.NORMAL_IMAGE) {
        newPath = config.resource.IMAGES_DIR;
        file.mediaType = value.mediaType.NORMAL_IMAGE;

     } else if (file.fieldname == value.fieldName.VR_IMAGE) {
        newPath = config.resource.VRIMAGES_DIR;
        file.mediaType = value.mediaType.VR_IMAGE;

     } else if (file.fieldname == value.fieldName.ATTACHED_FILE) {
        newPath = config.resource.ATTACHED_DIR;
     }

     file.saveDir = newPath;

    return callback(null, path.join(config.root, newPath));
  },
  filename: function (req, file, callback) {
     return callback(null, moment.utc().format('YYYYMMDDHHmmssSS') + '-' +  file.originalname);
  }
});

var userInfoStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    let newPath = path.join(config.resource.USERS_DIR);     // 현재는 profile_image만 저장함
     callback(null, newPath);
  },
  filename: function (req, file, callback) {
     callback(null, moment.utc().format('YYYYMMDDHHmmssSS') + '-' +  file.originalname);
  }
});

var filter = {
   duplicateFilter : function(req, file, cb) {
      // 1. Client - onChange 이벤트를 이용하여 변경된 파일을 req에 추가함
      // 2. Client - 변경되지 않은 기존 업로드된 파일에는 magicByte를 표기함

      // Server
      // 3. magicByte 표기가 되어있으면 업로드를 하지 않음.
      // 4. post.setAttacheds, post.setMedias를 이용하여 사용되지 않는 ID는 지우고,
      // 업로드가 완료된 첨부파일/이미지는 DB에 추가 후 관계를 정의한다.
      // 5. [image]의 배열 순서가 변경되었으면, meta.image_slide_order 값을 변경한다.
      // 6. [vr_image]의 배열 순서가 변경되었으면 다시 변환후 관련 DB를 업데이트한다.


   // The function should call `cb` with a boolean
   // to indicate if the file should be accepted

   // To reject this file pass `false`, like so:
   cb(null, false)

   // To accept the file pass `true`, like so:
   cb(null, true)

   // You can always pass an error if something goes wrong:
   cb(new Error('I don\'t have a clue!'))
   }
}

/**
 * multer setting 관련
 */
module.exports = {
  postInfoStorage: postInfoStorage,
  userInfoStorage: userInfoStorage,
   filter: filter
}
