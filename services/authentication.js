const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const {
  googleOAuth,
  microsoftOAuth,
  facebookOAuth,
} = require('../config/keys/keys');
const {
  LoggerService,
  appType
} = require('./logging');
const pool = require('../config/database');

let log = new LoggerService('auth', appType.common, false);

passport.serializeUser( (user, cb) =>
  cb(null, user)
);

passport.deserializeUser( (obj, cb) =>
  cb(null, obj)
);


//Facebook strategy
passport.use(
  new FacebookStrategy({
      //same URI as registered in Facebook console portal
      callbackURL: `http://localhost:3000/auth/facebook/callback`,

      clientID: facebookOAuth.FACEBOOK_CLIENT_ID,
      clientSecret: facebookOAuth.FACEBOOK_CLIENT_SECRET,
      enableProof: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, profile.id)
      } catch (err) {
        log.error(err)
        done(err);
      }
    })
);

// //Google strategy
// passport.use(
//   new GoogleStrategy({
//       //same URI as registered in Google console portal
//       callbackURL: `https://localhost:3000/auth/google/callback`,

//       clientID: googleOAuth.GOOGLE_CLIENT_ID,
//       clientSecret: googleOAuth.GOOGLE_CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         log.info('Google auth has been started');
//         pool.query("SELECT google_id FROM person WHERE google_id =?",
//           [
//             profile.id.toString()
//           ],
//           (err, result, field) => {
//             if (err) {
//               log.error(err);
//               done(err);
//             }

//             if (result.length === 0) {
//               pool.query("INSERT INTO person(google_id) VALUES(?)",
//                 [
//                   profile.id.toString()
//                 ],
//                 (error, insertResult, field2) => {
//                   if (error) {
//                     log.error(error);
//                     done(error);
//                   }

//                   if (!insertResult) {
//                     log.error("Error in google_id when were inserting");
//                     done("Error in google_id when were inserting");
//                   } else {
//                     log.debug("Need more information (Success)")
//                     done("Need more information", result[0].google_id.toString());
//                   }
//                 });

//             } else {
//               done(null);
//             }
//           })
//       } catch (err) {
//         log.error(err);
//         done(err);
//       }
//     })
// );

// //Microsoft strategy
// passport.use(
//   new MicrosoftStrategy({
//       //same URI as registered in Microsoft console portal
//       callbackURL: `https://localhost:3000/auth/microsoft/callback`,

//       clientID: microsoftOAuth.MICROSOFT_CLIENT_ID,
//       clientSecret: microsoftOAuth.MICROSOFT_CLIENT_SECRET,
//       scope: ['openid', 'profile', 'email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         log.info('Microsoft auth has been started');
//         pool.query("SELECT microsoft_id FROM person WHERE microsoft_id =?",
//           [
//             profile.openid.toString()
//           ],
//           (err, result, field) => {
//             if (err) {
//               log.error(err);
//               done(err);
//             }

//             if (result.length === 0) {
//               pool.query("INSERT INTO person(microsoft_id) VALUES(?)",
//                 [
//                   profile.id.toString()
//                 ],
//                 (error, insertResult, field2) => {
//                   if (error) {
//                     log.error(error);
//                     done(error);
//                   }

//                   if (!insertResult) {
//                     log.error("Error in microsoft_id when were inserting");
//                     done("Error in microsoft_id when were inserting");
//                   } else {
//                     log.debug("Need more information (Success)");
//                     done("Need more information", result[0].microsoft_id.toString());
//                   }
//                 });

//             } else {
//               done(null);
//             }
//           })
//       } catch (err) {
//         if (err) {
//           log.error(err);
//           done(err);
//         }
//       }
//     })
// );












// passport.use(
//   new FacebookStrategy({
//       //same URI as registered in Facebook console portal
//       callbackURL: `http://localhost:3000/auth/facebook/callback`,

//       clientID: facebookOAuth.FACEBOOK_CLIENT_ID,
//       clientSecret: facebookOAuth.FACEBOOK_CLIENT_SECRET,
//       enableProof: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         log.info('Facebook auth has been started');
//         pool.query("SELECT facebook_id FROM person WHERE facebook_id =?",
//           [
//             profile.id.toString()
//           ],
//           (err, result, field) => {
//             if (err) {
//               log.error(err);
//               done(err);
//             }

//             if (result.length === 0) {
//               pool.query("INSERT INTO person(facebook_id) VALUES(?)",
//                 [
//                   profile.id.toString()
//                 ],
//                 (error, insertResult, field2) => {
//                   if (error) {
//                     log.error(error)
//                     done(error);
//                   }

//                   if (!insertResult) {
//                     log.error("Error in facebook_id when were inserting");
//                     done("Error in facebook_id when were inserting");
//                   } else {
//                     log.debug("Need more information (Success)");
//                     done("Need more information", result[0].facebook_id.toString());
//                   }
//                 });
//             } else {
//               done(null);
//             }
//           })
//       } catch (err) {
//         log.error(err)
//         done(err);
//       }
//     })
// );

// passport.use(
//   new GoogleStrategy({
//       //same URI as registered in Google console portal
//       callbackURL: `https://localhost:3000/auth/google/callback`,

//       clientID: googleOAuth.GOOGLE_CLIENT_ID,
//       clientSecret: googleOAuth.GOOGLE_CLIENT_SECRET,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         log.info('Google auth has been started');
//         pool.query("SELECT google_id FROM person WHERE google_id =?",
//           [
//             profile.id.toString()
//           ],
//           (err, result, field) => {
//             if (err) {
//               log.error(err);
//               done(err);
//             }

//             if (result.length === 0) {
//               pool.query("INSERT INTO person(google_id) VALUES(?)",
//                 [
//                   profile.id.toString()
//                 ],
//                 (error, insertResult, field2) => {
//                   if (error) {
//                     log.error(error);
//                     done(error);
//                   }

//                   if (!insertResult) {
//                     log.error("Error in google_id when were inserting");
//                     done("Error in google_id when were inserting");
//                   } else {
//                     log.debug("Need more information (Success)")
//                     done("Need more information", result[0].google_id.toString());
//                   }
//                 });

//             } else {
//               done(null);
//             }
//           })
//       } catch (err) {
//         log.error(err);
//         done(err);
//       }
//     })
// );

// passport.use(
//   new MicrosoftStrategy({
//       //same URI as registered in Microsoft console portal
//       callbackURL: `https://localhost:3000/auth/microsoft/callback`,

//       clientID: microsoftOAuth.MICROSOFT_CLIENT_ID,
//       clientSecret: microsoftOAuth.MICROSOFT_CLIENT_SECRET,
//       scope: ['openid', 'profile', 'email'],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         log.info('Microsoft auth has been started');
//         pool.query("SELECT microsoft_id FROM person WHERE microsoft_id =?",
//           [
//             profile.openid.toString()
//           ],
//           (err, result, field) => {
//             if (err) {
//               log.error(err);
//               done(err);
//             }

//             if (result.length === 0) {
//               pool.query("INSERT INTO person(microsoft_id) VALUES(?)",
//                 [
//                   profile.id.toString()
//                 ],
//                 (error, insertResult, field2) => {
//                   if (error) {
//                     log.error(error);
//                     done(error);
//                   }

//                   if (!insertResult) {
//                     log.error("Error in microsoft_id when were inserting");
//                     done("Error in microsoft_id when were inserting");
//                   } else {
//                     log.debug("Need more information (Success)");
//                     done("Need more information", result[0].microsoft_id.toString());
//                   }
//                 });

//             } else {
//               done(null);
//             }
//           })
//       } catch (err) {
//         if (err) {
//           log.error(err);
//           done(err);
//         }
//       }
//     })
// );




module.exports = passport;