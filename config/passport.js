"use strict";

/**
 * Created by KIMSEONHO on 2016-08-16.
 */
// Importing Passport, strategies, and config
const passport = require('passport'),
   config = require('./main.js'),
   JwtStrategy = require('passport-jwt').Strategy,
   ExtractJwt = require('passport-jwt').ExtractJwt;

const message = require('../utils/staticValue').statusMessage;

// Custom extractor function for passport-jwt
const cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['authorization'];
    if (token) token = token.replace('Bearer ', '');
  }

  return token;
};

// Setting JWT strategy options
// 만료된 토큰에 대한 전략이 필요함(갱신등)
const jwtOptions = {
    // Telling Passport to check authorization headers for JWT
    // jwtFromRequest: ExtractJwt.fromAuthHeader(),
    jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderWithScheme("Bearer"), cookieExtractor]),
    // Telling Passport where to find the secret
    secretOrKey: config.secret,      // only HS256 algorithm support
    // secretOrKey: config.secret || jwksRsa.expressJwtSecret({
    //    cache: true,
    //    rateLimit: true,
    //    jwksRequestsPerMinute: 5,
    //    jwksUri: config.auth0.JWKS_URI
    // }),
    authScheme: 'Bearer',
    // failureFlash: true,
    // passReqToCallback: true,
    // ignoreExpiration: true,
    issuer: config.auth0.ISSUER,
    // audience: config.auth0.IDENTIFIER,
    algorithms: [config.auth0.ALGORITHM]
    // TO-DO: Add issuer and audience checks
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
    // console.log(payload);

    var expired = payload.exp - parseInt(new Date().getTime() / 1000) < 0 ? true : false;

    // 토큰이 만료되었음.
    // 만료된 토큰에 대한 추가 갱신 로직이 필요할 것 같다.
    if (expired) {
        return done(null, false, {
            message: message.error.tokenExpired
        });
    }

    // login이 되지 않은 회원에게 error를 출력하지 않기 위헤서 user object를
    // 아래와 같이 { logined: false }로 전송함
    if (!payload["email"]) {
        return done(null, false, {
            message: message.error.requiredLogin
        });
    }

    return done(null, payload);
});

passport.use(jwtLogin);