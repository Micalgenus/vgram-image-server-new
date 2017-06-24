"use strict";

/**
 * Created by KIMSEONHO on 2016-08-27.
 */
var Enum = require('enum');
/**
 * 전송 완료시의 상태코드
 */
const httpStatusCode = {
    'ok_200': 200,
    'created_201': 201,
    'found_302': 302,
    'badRequest_400': 400,
    'unauthorized_401': 401,
    'forbidden_403': 403,
    'notFound_404': 404,
    'internalServerError_500': 500
};

const statusMessage = {
    alreadyLogined: "alreadyLogined",
    success: {

    },
    error: {
        cannotFindUser: "cannotFindUser",    // 사용자 계정을 찾을 수 없음
        quitORnotActivateUser: "quitORNotActivatedUser",    // 휴면/탈퇴 계정
        couldNotVerified: "couldNotVerified",     // 로그인 실패
        requiredLogin: "requiredLogin",      // 로그인이 필요함(로그인되지 않은 client 알림)
        tokenExpired: "tokenExpired"     // 토큰 만료
    }
}

const memberType = {
  ADMIN: "ADMIN",
  PUBLIC: "PUBLIC",    // 일반 회원
  BUSINESS: "BUSINESS"    //  사업주 회원
};

const businessType = {
   HOTEL: "HOTEL",      // 호텔
   ESTATE_AGENT: "ESTATE_AGENT",    // 공인중개사
   LANDLORD: "LANDLORD"    // 건물주
}


const placeType = {
   ONE_ROOM: "ONE_ROOM",
   TWO_ROOM: "TWO_ROOM",
   THREE_ROOM: "THREE_ROOM",
   APARTMENT: "APARTMENT",
   VILLA: "VILLA",
   DETACHED_HOUSE: "DETACHED_HOUSE",
   OFFICETEL: "OFFICETEL",
   OFFICE: "OFFICE",
   SHOPPING: "SHOPPING",
   CAFE_RESTAURANT: "CAFE_RESTAURANT",
   WEDDING: "WEDDING",
   ACADEMY: "ACADEMY",
   HOSPITAL: "HOSPITAL"
}

const roomContractCondition = {
   MONTHLY: "MONTHLY",
   ANNUALLY: "ANNUALLY",
   LEASE: "LEASE"
}

const floors = {
   "Bx": "Bx",    // 지하
   "1F": "1F",    // 1층
   "2F": "2F",    // 2층
   "3F": "3F",    // 3층
   "4F": "4F",    // 4층
   "5F": "5F",    // 5층
   "6xF": "6xF"    // 6층 이상
}

const fieldName = {
   NORMAL_IMAGE: "NORMAL_IMAGE",
   VR_IMAGE: "VR_IMAGE",
   PROFILE_IMAGE: "PROFILE_IMAGE",
   ATTACHED_FILE: "ATTACHED_FILE"
}

const mediaType = {
   NORMAL_IMAGE: "NORMAL_IMAGE",
   VR_IMAGE: "VR_IMAGE",
   VTOUR_IMAGE: "VTOUR_IMAGE"
}

const postStatus = {
   PUBLISH: "PUBLISH",
   PRIVATE: "PRIVATE"
}

const postType = {
   ROOM: "ROOM",
   NOTICE: "NOTICE"
}

const mapLocationCenter = {
  lat: 35.8598743,
  lng: 127.1117673
}

// 향후 글 작성시 다양한 언어로 작성할 수 있음
const langCode = {
   "ko-kr": {     // 한국어
      codes: ["ko", "ko-kr", "ko-KR"]
   },
   "en-us": {     // 미국
      codes: ["en", "en-us", "en-US"],
      alias_codes: [
         "en-au", "en-AU",
         "en-ca", "en-CA",
         "en-gb", "en-GB",
         "en-in", "en-IN",
         "en-my", "en-MY",
         "en-nz", "en-NZ",
         "en-xa", "en-XA",
         "en-sg", "en-SG",
         "en-za", "en-ZA"
      ]
   },
   "zh-cn": {      // 중국(중국어 간체)
      codes: ["zh-cn", "zh-CN"],
      alias_codes: [
         "zh-hk", "zh-HK",
         "zh-tw", "zh-TW"
      ]
   },
   "zh-hk": {      // 홍콩(중국어 번체)
      codes: ["zh-hk", "zh-HK"],
      alias_codes: [
         "zh-tw", "zh-TW",
         "zh-cn", "zh-CN"
      ]
   },
   "zh-tw": {      // 대만(중국어 번체)
      codes: ["zh-tw", "zh-TW"],
      alias_codes: [
         "zh-hk", "zh-HK",
         "zh-cn", "zh-cn"
      ]
   },
}


// attached - 첨부파일
// medias - 이미지/동영상/VR이미지/VR동영상등
// posts - post 설정파일(현재는 사용하지 않음)
// users - user 설정파일(현재는 profile 저장하는 용도로만 사용)

// locales.*.js와 동일한 구조로 만들어야 i18n 적용이 쉽다.
module.exports = {
    httpStatusCode,
    statusMessage,
  memberType,
  fieldName,
   mediaType,
  placeType,
  businessType,
   roomContractCondition,
   floors,
   postStatus,
   postType,
   langCode,
   mapLocationCenter
};
