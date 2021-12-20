const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');


module.exports = {

    initMiddleware: () => {
        const app = express();

        // Enable cors between domains
        app.use(cors({
            origin: true
        }));

        // for parsing application/json
        app.use(express.json());

        // for parsing application/x-www-form-urlencoded
        app.use(express.urlencoded({
            extended: true
        }));

        //Enable Sessoins for this server 
        app.use(session({
            resave: false,
            saveUninitialized: true,
            secret: 'SECRET'
          }));

        // for parsing multipart/form-data
        // app.use(multer().array());

        // determin the static folder for node js project
        app.use('/public/upload/images/users', express.static(path.join(__dirname, '../public', 'upload', 'images', 'users')));
        app.use('/public/upload/images/admins', express.static(path.join(__dirname, '../public', 'upload', 'images', 'admins')));
        app.use('/public/upload/images/craftmen', express.static(path.join(__dirname, '../public', 'upload', 'images', 'craftmen')));

        app.use('/public/upload/videos/craftmen', express.static(path.join(__dirname, '../public', 'upload', 'videos', 'craftmen')));

        return app;
    }
}