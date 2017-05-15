/**
 * Created by gimhose on 2017-05-14.
 */
"use strict";

const models = require('../../models');
const Attached = models.attached;
const Media = models.media;
const Post = models.post;

const _ = require('lodash');
const Promise = require("bluebird");
const moment = require("moment");
const multer = require("multer");


var env = process.env.NODE_ENV || "development";
var config = require("../../config/main");

var log = require('console-log-level')({
    prefix: function () {
        return new Date().toISOString()
    },
    level: config.logLevel
});

const value = require('../../utils/staticValue');
const multerConfig = require('../../config/multer');
const vrpano = require('../../modules/convert-vrpano-promise');

// for file download, filter를 이용한 중복체크가 필요함
const setFileUpload = multer({storage: multerConfig.postInfoStorage}).fields([
    {name: value.fieldName.NORMAL_IMAGE, maxCount: 15}, {name: value.fieldName.VR_IMAGE, maxCount: 10},
    {name: value.fieldName.ATTACHED_FILE, maxCount: 5}]);
const fileUploadPromise = Promise.promisify(setFileUpload);


/**
 * 기존의 krpano를 수정할 부분
 * @param req
 * @param res
 * @param next
 */
exports.createKrpanoImages = function(req, res, next) {

};

/**
 * krpano maketile를 구현할 부분.
 * @param req
 * @param res
 * @param next
 */
exports.createKrpanoTiles = function(req, res, next) {

};


// API, Web 공용 로직
// 0. 파일 다운로드 처리(NORMAL_IMAGE, VR_IMAGE)
// saveRoomInDB - transaction {
// 1. media(NORMAL_IMAGE, VR_IMAGE), attached 저장
// 2. [post, room 저장] -> [post_meta, post_attached_relationship, post_media_relationship 저장]
// 3. vrpano 변환 -> media(vtour) 정보 DB 저장 -> post_media_relationship에 vtour 정보 저장
// 4. room thumbnail 업데이트
// }
/**
 * 시공사례입력(use vrpano-promise)
 * @param req
 * @param res
 * @return Promise
 */
exports.createRoomInfoAndVRPano = function (req, res, next) {
    let saveRoomInDB = Promise.method(function (req, res, next) {
        let roomInstance;
        return models.sequelize.transaction(function (t) {
            return Promise.join([    // 1. media(NORMAL_IMAGE, VR_IMAGE), attached 저장(중복체크 필요)
                Media.bulkCreate(req.mediaInfo, {transaction: t}),
                Attached.bulkCreate(req.attachedInfo, {transaction: t})
            ]);
        }).spread(function (newMedias, newAttacheds) {    // 2.a [post, room 저장]
            const output = setPostRoomData(req, res, newMedias);
            const postInfo = output.postInfo;
            const roomInfo = output.roomInfo;

            return Post.create(postInfo, {transaction: t}).then(newPost => {
                return Promise.join([      // 2.b [room, post_attached_relationship, post_media_relationship 저장]
                    newPost.createRoom(roomInfo, {transaction: t}),
                    newPost.addAttacheds(newAttacheds, {transaction: t}),
                    newPost.addMedias(newMedias, {transaction: t})
                ]);
            });
        }).then(newRoom, newPost => {
            roomInstance = newRoom;
            res.status(201).json({
                statusCode: res.i18n("post create completed")
            });
            return Promise.resolve(newPost);
        }).then(newPost => {
            let vrImageInstances = newPost.getMedias({     // array
                where: {
                    media_type: value.mediaType.VR_IMAGE      // image/spherical
                }
            });

            let vrImagePaths = [];
            _.each(req.mediaInfo, media => {    // vr파일이 저장된 절대경로 추출
                if (_.eq(media.media_type, value.mediaType.VR_IMAGE)) {
                    vrImagePaths.push(media.fullPath);
                }
            });

            let folderName = moment.utc().format('YYYYMMDDHHmmssSS');
            // 3. vrpano 변환 -> media(vtour) 정보 DB 저장 -> post_media_relationship에 vtour 정보 저장
            return vrpano.convertVRPano(vrImagePaths, folderName).then(() => {
                let vtourInfo = vrpano.setVTourInfo(folderName, vrImageInstances);
                return Media.create(vtourInfo, {transaction: t}).then(newVTour => {
                    return newVTour.addUseCases(newPost, {transaction: t});      // post_media_relationship에 vtour 정보 저장
                })
            });
        }).then((newVTour) => {
            // 4. room thumbnail 정보 업데이트
            let thumbnails = _.map(newVTour.tile_dir_name, tileDir => {
                return path.posix.join(newVTour.file_path, tileDir, newVTour.thumbnail_image_name)
            });

            return roomInstance.addThumbImage(newVTour, {
                thumbnail_image_path: thumbnails
            });
        }).catch(next);
    });

    return fileUpload(req, res, next).then(() => {
        return saveRoomInDB(req, res, next);
    });
};