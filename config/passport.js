"use strict";

/**
 * Created by KIMSEONHO on 2016-08-16.
 */
// Importing Passport, strategies, and config
const passport = require('passport'),
   models = require('../models'),
   //2017.1.13 이정현 주석 처리
   //Member = models.Member,
   users = models.user,
   config = require('./main.js'),
   genToken = require("../utils/genToken"),
   JwtStrategy = require('passport-jwt').Strategy,
   ExtractJwt = require('passport-jwt').ExtractJwt,
   LocalStrategy = require('passport-local');

// Setting username field to email rather than username
const localOptions = {
   usernameField: 'email',
   passwordField: 'password'
}

// Custom extractor function for passport-jwt
const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['Authorization'];
    if (token) token = token.replace('Bearer ', '');
  }

  return token;
};

// Custom extractor function for passport-jwt
const emptyExtractor = function(req) {
   // 로그인 하지 않은 회원의 경우 데이터 조회는 가능할 수 있도록 passport error가 발생하지 않게
   // 접근방지를 해제하기 위한 Trick
   // 서버 부하, 보안문제가 생길 수 있기 때문에, 근본적인 해결방빕이 필요할듯

   return genToken.generateUserToken({});
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
   //2017.1.13 이정현 주석 처리
   //Member.findOne({where: {email: email}}).then(function (user) {
   users.findOne({where: {email: email}}).then(function (user) {

      if (!user) {
         return done(null, false, {
            errorMsg: 'Your login details could not be verified. Please try again.',
            statusCode: 0
         });
      }
      //유저상태가 1이 아니면 활성화 되어있는게 아님(탈퇴되었거나 휴면계정)
      if(user.user_status != 1) {
         return done(null, false, {
            errorMsg: 'quit user',
            statusCode: 3
         });
      }

      user.comparePassword(password, function (err, isMatch) {
         if (err) {
            return done(err);
         }
         if (!isMatch) {
            return done(null, false, {
               errorMsg: "Your login details could not be verified. Please try again.",
               statusCode: 2
            });
         }

         return done(null, user);    // user로 넘어가니까 받는 router의 req에서 user라는 이름의 object를 사용할 수 있다.
      });
   }).catch(function (err) {
      if (err) {
         return done(err);
      }
   });
});

// Setting JWT strategy options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  // jwtFromRequest: ExtractJwt.fromAuthHeader(),
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme("Bearer"), cookieExtractor]),
  // Telling Passport where to find the secret
  secretOrKey: config.secret,
  authScheme: 'Bearer'

  // TO-DO: Add issuer and audience checks
};
// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // console.log(payload);

    var expired = payload.exp - parseInt(new Date().getTime() / 1000) < 0;

    // 토큰이 만료되었음.
    // 만료된 토큰에 대한 추가 갱신 로직이 필요할 것 같다.
    if (expired) {
        return done(null, false, {
            message: message.error.tokenExpired
        });
    }

    // login이 되지 않은 회원에게 error를 출력하지 않기 위헤서 user object를
    // 아래와 같이 { logined: false }로 전송함
    if (!payload[localOptions.usernameField] || !payload[localOptions.passwordField]) {
        return done(null, false, {
            message: message.error.requiredLogin
        });
    }

    return done(null, payload);   // localStrategy와 같다.
});

passport.use(jwtLogin);
passport.use(localLogin);
