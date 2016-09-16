var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var categoryApi = require('./api/category')
var supplierApi = require('./api/supplier')
var mongodb = require('mongodb')

// configure app to use bodyParser()
// this will let us get the data from a POST
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 12220; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router



categoryApi.init(router, mongodb);
supplierApi.init(router, mongodb);
//categoryApi.initData();


app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('server is up and running on port: ' + port);