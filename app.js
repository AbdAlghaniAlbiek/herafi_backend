const http = require('http');
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, 'config' , '.env')
});

const {
  appPortNum,
} = require('./config/keys/keys');
const {
  appType,
  LoggerService
} = require('./services/logging');

//Create an object from express and it has the middleware that it need
const app = require('./init/middleware').initMiddleware();


//Implement security packages in app
require('./init/security').initSecurity(app)


//Implement routings the related to of 3 apps (craftman, user and admin app) 
require('./init/routings/admin').initRoutings(app);
require('./init/routings/craftman').initRoutings(app);
require('./init/routings/user').initRoutings(app);


//Implement authorization with third party authenticators
// require('./init/auth').authInit(app);


//Creating server and make it listening on this port
app.set('port', appPortNum.APP_PORT || 5000);


//Creating node js server
const serverHttp = http.createServer(app);

serverHttp.listen(app.get('port'), () => {
  new LoggerService('app', appType.common, true).info("Server is listening on port: " + app.get('port'));
});