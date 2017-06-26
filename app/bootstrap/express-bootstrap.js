let express = require('express');
let bodyParser = require('body-parser');
let consign = require('consign');
let logger = require('../util/log');

let ErrorInterceptor = require('../middleware/errorInterceptor')();
let CorsInterceptor = require('../middleware/corsInterceptor')();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(CorsInterceptor.intercept);

consign({cwd:'app'})
    .include('util')
    .then('database')
    .then('model')
    .then('repository')
    .then('service')
    .then('middleware')
    .then('controller')
    .then('beans')
    .then('route')
    .into(app);

app.use(ErrorInterceptor.intercept);

module.exports = () => app;


