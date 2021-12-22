# ![hearfi_backend_image](https://github.com/AbdAlghaniAlbiek/Herafi/blob/master/Herafi.UWP/Assets/Images/AppIcons/StoreLogo.scale-100.png) herafi_backend ![Twitter Follow](https://img.shields.io/twitter/follow/AbdAlbiek?style=social) ![GitHub](https://img.shields.io/github/license/AbdAlghaniAlbiek/SQLiteDBProject) ![node-current](https://img.shields.io/node/v/dotenv)

* This is my graduation project that I worked on it for 4 months, and It gives 98/100 considered the best graduations projects from.
* It is the backend that serve my Herafi UWP client application(admin application) and my friends' android applications(user and craftman applications), which contains on Restfull APIs that consumed by these apps.
* you can see my Herafi UWP client application from [here.](https://github.com/AbdAlghaniAlbiek/Herafi)

# Table of content
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Dependencies](#dependencies)
* [Architecture schreenshot](architecture-screenshot)
* [Versions](#versions)
* [Project status](project-status)

## Technologies Used
* Routing.
* Connecting to MySQL DB.
* Sending emails.
* High level security.
* Uploading files.
* Logging.
* hcaptcha.
* Braintree payment.
* Prettier.
* Eslint.

## Features
* Making routing system that help me to create Restfull APIs and make the work more organized. In this project there is 3 main routings (admin, user, craftman) for 3 apps (UWP app for admin and 2 Android apps for user and craftman).
* Connection to MySQL databse that created using `PhpMyAdmin` and Initialize the connection to MySQL DBMS using XAMP control panel.
* Sending emails using `nodemailer` library to verify the identity of user when he makes an account.
* This project accomplich the highiest security level By using these Techniques:
  1. Encryption/Decryption data that sended/received between server and client using `AES-128-cbc` alghorithm.
  2. Verify the requests that are from signed account not from any user and I achieved this using `JWT` tech that is signed with `RSA256` Encryption alghorithm.
  3. To verify the token is sended from the right server, I decode token to have sercret keyword and check this sercret keyword if it's equal to the stored secret keyword in my UWP application or not.
  4. All secret key and configuration are implemented inside `.env` file (using `dotenv` lib).
  5. Encrypting all password using `hash` alghorithm (using `bcryptjs` lib), so even if hacker hacked the DB and get the passwords of emails he can't read the actual passwords.
  6. Using all the required libs for security: `helmet, hpp, hsts, xss-clean, sql-injection, tor-detect-middleware, jsonwebtoken`. 
  7. Android apps secured from spam and abues attacks by hcaptcha 
* The users of these 3 applications can upload there images and files using `multer`.
* Every app connected to this backend have his own logs and we can see what is the API is called and what is the response that get it, I have used `winston` and `morgan`.
* `Braintree` used for implementing the payments methods.
* The code automatically organzied by `Prettier` and written with `Eslint` rules.

## Dependencies
> To see all dependencies you can go [there.](https://github.com/AbdAlghaniAlbiek/herafi_backend/blob/main/package.json)
* Code formatting: Prettier, Eslint.
* Middleware: express, cors.
* Security: helmet, hpp, hsts, xss-clean, sql-injection, tor-detect-middleware, dotenv, bcryptjs, jsonwebtoken.
* Logging: winston, morgan.
* Helpers: moment, mysql2, nodemailer, multer, nodemon.

## Architecture schreenshot
<p align="center">
  <img src="https://github.com/AbdAlghaniAlbiek/herafi_backend/blob/main/arch_herafi_backend.jpg">
</p>

 ## Versions
 **[version 1.0.0]:** Contains all features that descriped above.
 
 ## Project status
 This project `no longer being worked on` but the contributions are still welcome.
