var models = require('../model/model')
iconv = require('iconv-lite');

var _mongodb;
var _router;

module.exports = create();

var COLLECTION_NAME = "MDTag"
var ROUTE = "Tag";
var DB;

// well, k0o0ne goshad, later on a global setting file will let us to get rid of this manual database url setting in every file :) 


var url = 'mongodb://localhost:27017/nodejs';
//var url = 'mongodb://52.6.167.164:27017/nodejs';

function _getDocument(model, res) {
    var collection = DB.collection(COLLECTION_NAME);
    console.log(model);
    var q = model.map(function(item) {
        return { "name": item };
    });
    collection.find({ $or: q }).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.json({ success: true, results: result });
        } else {

        }
    });
}


function getDocument(model, cb) {
    var collection = DB.collection(COLLECTION_NAME);
    console.log(model);
    var q = model.map(function(item) {
        return { "value": item };
    });
    collection.find({ $or: q }).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            cb(result);
        } else {

        }
    });
}


function getCatalog(res) {
    var collection = DB.collection(COLLECTION_NAME);
    collection.find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.json({ success: true, results: result });
        } else {

        }
    });
}


function SearchByTag(tag, res) {
    var collection = DB.collection(COLLECTION_NAME);
    var search = '"/^' + tag + '.*/"';
    console.log(search);
    collection.find({ name: { $regex: new RegExp('^' + tag) } }).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.json({ success: true, results: result });
        } else {

        }
    });
}

function insert(model, res) {
    delete model.__proto__._id;
    console.log(model.prototype);
    var collection = DB.collection(COLLECTION_NAME);
    collection.insert([model], function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('Inserted %d documents into the "tags" collection. The documents inserted with "_id" are:', result.length, result);
        }
        res.status("201");
        res.json({ status: "OK" });
    });
}

function getC() {
    var MongoClient = _mongodb.MongoClient;
}


function initRoutes(router) {
    _router.get('/' + ROUTE , function(req, res) {
        //res.json({ users: getCatalog() });
        //console.log("-----body : " + req.query.search);
        getCatalog(res);
    });
    _router.get('/' + ROUTE + "/:search", function(req, res) {
        //res.json({ users: getCatalog() });
        console.log("-----search : " + iconv.decode(new Buffer(req.params.search), "ISO-8859-1"));
        SearchByTag(req.params.search, res);
    });
    _router.post('/' + ROUTE, function(req, res) {
        var model = new models.Tag();
        model.name = (req.body.name) ? req.body.name : "";
        model.value = (req.body.value) ? req.body.value : "";
        model.text = (req.body.text) ? req.body.text : "";
        insert(model, res);
        //res.json({ response: req.body });
    });


    _router.post('/' + ROUTE + '/check', function(req, res) {
        var model = (req.body.data) ? req.body.data : "";
        _getDocument(model, res);
        //res.json({ response: req.body });
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
    var init = function(router, mongodb) {
        _router = router;
        _mongodb = mongodb;
        initDb();
        initRoutes();
    }

    return {
        init: init,
        initData: initData,
        getDocument: getDocument
    };
};