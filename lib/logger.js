//var models = require('../model/model')
var mongodb = require('mongodb');
var http = require('http');
var _mongodb;
var DB;



var options = {
    host: 'www.freegeoip.net',
    path: '',
    method: 'GET',
};


module.exports = create();

var COLLECTION_NAME = "MDLog"
var ROUTE = "Log";
var DB;




var url = 'mongodb://localhost:27017/nodejs';



function log(ipAddress, req) {
    options.path = "/json/" + ipAddress;
    console.log(ipAddress);
    cb = function(response) {
        var str = '';
        response.on('data', function(chunk) {
            str += chunk;
        });
        response.on('end', function() {

            var model = new Object();
            model._id = new mongodb.ObjectID();
            var date=new Date();
            model.date = date;
            model.url = req.method + " ====> " + req.url;
            model.headers = req.headers;
            model.requestBody = req.body;
            model.client = JSON.parse(str);
            //console.log(model);            
            insert(model);
            console.log("-----------------request logged----------------");
        });
    }
    console.log(options);
    http.request(options, cb).end();
}



function insert(model) {
    _mongodb.MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return null;
        } else {
            var collection = db.collection(COLLECTION_NAME);
            collection.insert([model], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log('Inserted %d documents into the "logs" collection. The documents inserted with "_id" are:', result.length, result);
                }
            });
        }
    });
}








function initDb() {
    _mongodb.MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return null;
        } else {
            DB = db;
        }
    });
}

function create() {
    var initData = function() {
        _initData();
    }
    var init = function(mongodb) {
        _mongodb = mongodb;
        initDb();
    }

    return {
        init: init,
        log: log
    };
};