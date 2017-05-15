/**
 * Created by KIMSEONHO on 2016-08-22.
 */
"use strict";

const jwt = require('jsonwebtoken'),
  config = require('../config/main');

// Generate JWT
// TO-DO Add issuer and audience
exports.generateUserToken = function(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds, 2.8시간
  });
}

// Set user info from request
/* 2017.1.13 이정현 주석처리
exports.setUserInfo = function(request) {
  let getUserInfo = {
    idx: request.idx,
    email: request.email,
    password: request.password,
    memberType: request.memberType,
    passwordOrigin: request.passwordOrigin    // 인코딩 전의 패스워드도 저장해놓자.
  };

  return getUserInfo;
}*/
exports.setUserInfo = function(user) {
   let getUserInfo = {
      id: user.id,
      email: user.email,
      password: user.password,
      member_type: user.member_type,
      telephone:user.telephone,
      registered_date:user.registered_date,
      display_name:user.display_name,
      activation_key:user.activation_key,
      locale: user.locale,
      profile_image_path: user.profile_image_path,
      updated_date: user.updated_date,
      user_status: user.user_status,
      meta_value: user.meta_value
   };

   return getUserInfo;
}
