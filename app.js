let express = require('express');
let bodyParser = require('body-parser');
let consign = require('consign');
//let validator = require('express-validator');
//let logger = require('../util/log');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//app.use(CorsInterceptor.intercept);
// app.use(validator({
//     customValidators:customValidations
// }));

// app.set('jwt_api_key','M2MParceiroKey');
// app.set('jwt_web_key','m2m');

consign({cwd:'app'})
    //.include('util')
    .include('database')
    .then('model')
    .then('repository')
    //.then('middleware/GenericTokenInterceptor.js')
    .then('middleware')
    .then('controller')
    //.then('beans')
    .then('route')
    .into(app);

//app.use(ErrorInterceptor.intercept);

module.exports = () => app;


