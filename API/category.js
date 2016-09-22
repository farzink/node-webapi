var models = require('../model/model')

var _mongodb;
var _router;

module.exports = create();

var COLLECTION_NAME = "MDCategory"
var ROUTE = "Category";
var DB;




var url = 'mongodb://localhost:27017/nodejs';
//var url = 'mongodb://52.6.167.164:27017/nodejs';
//just a simple fucking function to seed some initial data, na gholam!
function _initData() {
    var collection = DB.collection(COLLECTION_NAME);
    var category = {
        name: 'Computers'
    };
    collection.insert([category], function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
        }
    });
}


function getCatalog(res) {
    //var MongoClient = _mongodb.MongoClient;   

    var collection = DB.collection(COLLECTION_NAME);
    collection.find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.json({
                items: result
            });
            //db.close();

        } else {
            //db.close();
        }
        //Close connection
        //db.close();
    });


    return "some value...";
}

function insert(model, res) {
    _mongodb.MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return null;
        } else {
            delete model.__proto__._id;
            console.log(model.prototype);
            var collection = db.collection(COLLECTION_NAME);
            collection.insert([model], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }
                
                res.status("201");
                res.json({
                    status: "OK"
                });
            });
        }
    });
}

function getC() {
    var MongoClient = _mongodb.MongoClient;
}


function initRoutes(router) {
    _router.get('/' + ROUTE, function(req, res) {
        //res.json({ users: getCatalog() });        
        getCatalog(res);
    });

    _router.get('/res', function(req, res) {
        //res.json({ message: 'kir!!!!' });
        res.status("405");
        res.json({
            status: "12"
        });
    });

    _router.post('/' + ROUTE, function(req, res) {
        var model = new models.Category();
        model.name = req.body.name;
        insert(model, res);
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
        initData: initData
    };
};