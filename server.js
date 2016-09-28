var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var categoryApi = require('./api/category');
var supplierApi = require('./api/supplier');
var departmentApi = require('./api/department');
var taxApi = require('./api/tax');
var tagApi = require('./api/tag');
var itemApi = require('./api/item');
var pricetypeApi = require('./api/pricetype');
var mongodb = require('mongodb');
var logger = require('./lib/logger');
var colors = require('colors');


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
logger.init(mongodb);
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var ip = req.connection.remoteAddress.split(":");
    logger(ip[ip.length-1]);

    console.log(colors.yellow(new Date()) + "    |---------  Request is comming from :" + colors.green.underline(req.connection.remoteAddress) + " -----------");
    next();
});





categoryApi.init(router, mongodb);
supplierApi.init(router, mongodb);
tagApi.init(router, mongodb);
departmentApi.init(router, mongodb);
taxApi.init(router, mongodb);
pricetypeApi.init(router, mongodb);
itemApi.init(router, mongodb, tagApi, departmentApi, categoryApi, taxApi);
//categoryApi.initData();


app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('server is up and running on port: ' + port);




// setTimeout(function() {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.json({ items: result });
//     db.close();
// }, 111);