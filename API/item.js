var models = require('../model/model')
var tagRepo = require('../API/tag')
var departmentRepo = require('../API/department')
var categoryRepo = require('../API/category')

var _mongodb;
var _router;

module.exports = create();

var COLLECTION_NAME = "MDItem"
var ROUTE = "Item";
var DB;

// well, k0o0ne goshad, later on a global setting file will let us to get rid of this manual database url setting in every file :) 


var url = 'mongodb://localhost:27017/nodejs';
//var url = 'mongodb://52.6.167.164:27017/nodejs';




function getCatalog(res) {
    var collection = DB.collection(COLLECTION_NAME);
    collection.find({}).toArray(function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.length) {
            res.json({ items: result });
        } else {

        }
    });
}

// var collection = DB.collection(COLLECTION_NAME);
//         collection.insert([model], function(err, result) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log('Inserted %d documents into the "items" collection. The documents inserted with "_id" are:', result.length, result);
//             }
//             res.status("201");
//             res.json({ status: model });
//         });




function insert(model, res) {
    delete model.__proto__._id;
    //console.log(model.prototype);
    var cb = function(data) {
        model.itemtag = data;
        var _cb = function(data) {
            model.itemdepartment = data;

            var __cb = function(data) {
                model.itemcategory = data;

                var collection = DB.collection(COLLECTION_NAME);
            collection.insert([model], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted %d documents into the "items" collection. The documents inserted with "_id" are:', result.length, result);
                }
                res.status("201");
                res.json({ status: model });
            });
            };
            model.itemcategory = categoryRepo.getDocument(model.itemcategory, __cb);

        };
        model.itemdepartment = departmentRepo.getDocument(model.itemdepartment, _cb);




    };
    model.itemtag = tagRepo.getDocument(model.itemtag, cb);
}

function getC() {
    var MongoClient = _mongodb.MongoClient;
}


function initRoutes(router) {
    _router.get('/' + ROUTE, function(req, res) {
        //res.json({ users: getCatalog() });
        getCatalog(res);
    });
    _router.post('/' + ROUTE, function(req, res) {
        var model = new models.Item();
        model.itemname = (req.body.itemname) ? req.body.itemname : "";
        model.itemsku = (req.body.itemsku) ? req.body.itemsku : "";
        model.itemtag = (req.body.itemtag) ? req.body.itemtag : "";
        model.itemdepartment = (req.body.itemdepartment) ? req.body.itemdepartment : "";
        model.itemcategory = (req.body.itemcategory) ? req.body.itemcategory : "";
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