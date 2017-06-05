"use strict";

/**
 * Created by KIMSEONHO on 2016-09-08.
 */
var spawn = require('child-process-promise').spawn;
var addToPath = require('add-to-path');   // process.env.path 등록
var Promise = require('bluebird');

var os = require('os');
var path = require('path');
var _ = require('lodash');

var env = process.env.NODE_ENV || "development";
var config = require('../config/main');

var log = require('console-log-level')({
    prefix: function () {
        return new Date().toISOString()
    },
    level: process.env.logLevel
})

var platform = os.platform();
var arch = os.arch();

var shell, scriptFile, vtourConfig, toolPath;

if (platform === 'linux') {
// HACK: to make our calls to exec() testable,
// support using a mock shell instead of a real shell
    shell = process.env.SHELL || 'sh';
    addToPath(config.krpano.LINUX_PATH);
    toolPath = config.krpano.LINUX_PATH;
    scriptFile = "krpanotools";
}
else if (platform === 'win32' && process.env.SHELL === undefined) {
    // support for Win32 outside Cygwin
    shell = process.env.COMSPEC || 'cmd.exe';
    addToPath(config.krpano.WIN_PATH);
    toolPath = config.krpano.WIN_PATH;

    if (arch == 'x64') {
        scriptFile = "krpanotools64.exe";
    } else if (arch == 'ia32') {        // 32bit
        scriptFile = "krpanotools32.exe";
    } else {        // arm등
        log.error("not support for " + arch);
    }
}

vtourConfig = config.krpano.VTOUR_CONFIG_PATH;

/**
 * Convert spherical image to cubical image and save converted info to DB
 * Tour VR로 변환 후 변환 여부에 따라 DB에 데이터를 저장한다.
 * @param idx
 * @param imagePaths
 * @param folderName
 * @returns {number}
 */
exports.convertVRPano = function (imagePaths, folderName) {
    if (!scriptFile) {
        return Promise.reject("not compatible with machine OS :  " + arch);
    }

    if (!imagePaths) {
        return Promise.reject("must pass argument(imagePaths) :  " + imagePaths);
    }

    // ex> folderName = "sinho0689@gmail.com/1474243481136"
    if (!folderName) {
        return Promise.reject("must pass argument(folderName) :  " + folderName);
    }

    const configArgs = "-config=" + vtourConfig;
    let folderPath = path.posix.join(config.root, config.resource.VTOURS_DIR, folderName);
    folderPath = folderPath.replace(new RegExp('\\' + path.sep, 'g'), path.sep);
    // @link https://krpano.com/tools/kmakemultires/config/
    // const tilePath = "-tilepath=" + folderPath + "/panos/%BASENAME%.tiles/pano[_c].jpg";
    // const customImagePath = "-customimage[mobile].path=" + folderPath + "/panos/%BASENAME%.tiles/mobile/pano_%s.jpg";
    // const thumbPath = "-thumbpath=" + folderPath + "/panos/%BASENAME%.tiles/thumb.jpg";
    const xmlPath = "-xmlpath=" + path.posix.join(folderPath, "tour.xml");
    // const htmlPath = "-htmlpath=" + folderPath + "/tour.html";
    // const previewPath = "previewpath=" + folderPath + "/panos/%BASENAME%.tiles/preview.jpg";
    // const previewArgs = "-preview=true";

    const makepanoArgs = _.concat(["makepano", configArgs], imagePaths, xmlPath);

    // image 파일이 존재하는지에 대한 검증은 하지 못함
    // 이미지 파일이 존재하지 않아도 echo(stdout)로 출력됨, stderr = ""
    // process option을 변수를 선언하여 재활용 했더니 에러가 난다
    // 왜 그런지는 모르겠지만, 번거롭더라도 직접 object를 넣어주어야
    // 의도대로 잘 작동한다.

    // 현재 서버와 같이 돌릴 경우에는 자원이 많이 소모되는 작업이기 때문에
    // 동시 변환이 불가능 할 것 이다.
    // 그래서 별도 서버를 설치하고 queue를 이용한 batch processing을 수행해야 한다.
    // 일단 임시방편으로 이렇게 제작하자.

    const command = path.join(toolPath, scriptFile);
    // run convert cubical
    var promise = spawn(command, makepanoArgs, {
        cwd: toolPath,
        env: process.env
    });
    console.log(command);
    var childProcess = promise.childProcess;

    log.debug('[convert-vrpano-promise] childProcess.pid: ', childProcess.pid);
    childProcess.stdout.on('data', (data) => {
        log.debug(`[convert-vrpano-promise] stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        log.debug(`[convert-vrpano-promise] stderr: ${data}`);
    });

    return promise;
};

/**
 * vtour 관련 변수 셋팅
 * @param folderName
 * @param vrImages
 * @return {*}
 */
exports.setVTourInfo = function (folderName, vrImageInstances) {

    if (folderName && vrImageInstances) {
        let vtourInfo = {
            media_type: value.mediaType.VTOUR_IMAGE,
            date: moment.utc().format('YYYYMMDDHHmmssSS'),
            file_path: path.posix.join(config.resource.VTOURS_DIR, folderName),     // DB저장용, root경로는 저장하지 않음
            file_name: "tour",     // vtour의 경우에는 파일명 기본을 하자
            meta_value: {
                html_name: "tour.html",
                js_name: "tour.js",
                swf_name: "tour.swf",
                xml_name: "tour.xml",
                editor_name: "tour_editor.html",
                thumbnail_image_name: "thumb.jpg",
                tile_dir_name: [],
                original_media_id: []
            }
        };

        vtourInfo.meta_value.tile_dir_name = _.map(vrImageInstances, function(vrImage) {
            let extension = path.extname(vrImage.file_name);    // imagefile name의 확장자부분만 추출
            let imageName = path.basename(vrImage.file_name, extension);      // imagefile name의 파일 이름만 추출

            return "panos/" + imageName + ".tiles"
        });

        vtourInfo.meta_value.original_media_id = _.map(vrImageInstances, (vrImage) => {
            return vrImage.ID;
        });

        return vtourInfo;
    } else {
        return new Error("fail to setVTourInfo, check folderName AND vrImages");
    }
};
