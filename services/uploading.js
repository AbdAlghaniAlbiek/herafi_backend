const multer = require('multer');
const path = require('path');

module.exports = {

    uploadingImage: (destination, size) => {

        //Set Storage Engine
        const storage = multer.diskStorage({

            destination: function (req, res, cb) {
                cb(null, `./public/upload/images/${destination}`)
            },

            filename: (req, file, cb) => {
                let fileName;
                if (path.extname(file.originalname).toLowerCase() === '.jpeg') {
                    fileName = file.originalname.slice(0, file.originalname.length - 5);
                } else {
                    fileName = file.originalname.slice(0, file.originalname.length - 4);
                }

                ///////////////
                req.fileName = fileName;
                ///////////////

                cb(null, fileName + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
            }
        });

        //Init upload
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: size
            },
            fileFilter: function (req, file, cb) {
                try {
                    // //Allowed ext
                    // const fileTypes = /jpeg|jpg|png|gif/;
                    // //Check ext
                    // const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
                    // //Check mime
                    // const mimeType = fileTypes.test(file.mimeType);
                    //if (mimeType && extName)  (old condition)

                    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                        return cb(null, true);
                    } 
                    else {
                        return cb('Error: Images Only', false)
                    }

                }
                 catch (err) {
                    return cb(new Error(err), false)
                }
            }
        });
        return upload;
    },

    uploadingVideo: (size) => {

        //Set Storage Engine
        const storage = multer.diskStorage({

            destination: function (req, res, cb) {
                cb(null, `./public/upload/videos/craftmen`)
            },

            filename: (req, file, cb) => {
                let fileName;
                if (path.extname(file.originalname).toLowerCase() === '.AVCHD') {
                    fileName = file.originalname.slice(0, file.originalname.length - 6);
                } else {
                    fileName = file.originalname.slice(0, file.originalname.length - 4);
                }

                cb(null, fileName + '_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
            }
        });

        //Init upload
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: size
            },
            fileFilter: function (req, file, cb) {
                //Allowed ext
                const fileTypes = /MP4|MOV|WMV|FLV|AVI|AVCHD/;
                //Check ext
                const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
                //Check mime
                const mimeType = fileTypes.test(file.mimeType);

                if (mimeType && extName) {
                    return cb(null, true);
                } else {
                    return cb('Error: Videos Only')
                }
            }
        });

        return upload;
    },

    destination: {
        admins: 'admins',
        users: 'users',
        craftmen: 'craftmen'
    },
}