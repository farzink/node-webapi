var models = require('../model/model')
var mongodb = require('mongodb');
var tagRepo;
var departmentRepo;
var categoryRepo;
var taxRepo;

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

function getDocumentById(id, res) {
    var collection = DB.collection(COLLECTION_NAME);
    collection.findOne({ _id: new mongodb.ObjectID(id) }, function(err, result) {
        if (err) {
            console.log("------------------error---------------------------")
            console.log(err);
        } else if (result != null) {
            console.log("----------------------result----------------------------")
            res.status("201");
            res.json({ status: true, statusCode: 201, item: result });
        } else {
            console.log("-------------------------nothing-------------------------")
        }
    });
}


function insert(model, res) {
    delete model.__proto__._id;
    //console.log(model.prototype);
    var cb = function(data) {
        model.itemTag = data;
        var _cb = function(data) {
            model.itemDepartment = data;

            var __cb = function(data) {
                model.itemCategory = data;

                var ___cb = function(data) {
                    model.taxType = data;



                    var collection = DB.collection(COLLECTION_NAME);

                    if (model.taxType.percentage) {
                        console.log("has percentage");
                        model.taxedPrice = parseInt(model.taxedPrice);
                        model.taxType.percentage = parseFloat(model.taxType.percentage);
                        model.price = parseFloat(model.price);
                        model.taxedPrice = model.price + (model.price * model.taxType.percentage / 100);
                    }
                    collection.insert([model], function(err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Inserted %d documents into the "items" collection. The documents inserted with "_id" are:', result.length, result);
                        }
                        res.status("201");
                        res.json({ status: true, statusCode: 201, item: model });
                    });
                }
                model.taxType = taxRepo.getDocument(model.taxType, ___cb);
            };
            model.itemCategory = categoryRepo.getDocument(model.itemCategory, __cb);

        };
        model.itemDepartment = departmentRepo.getDocument(model.itemDepartment, _cb);




    };
    model.itemTag = tagRepo.getDocument(model.itemTag, cb);
}

function getC() {
    var MongoClient = _mongodb.MongoClient;
}


function initRoutes(router) {
    _router.get('/' + ROUTE, function(req, res) {
        //res.json({ users: getCatalog() });
        getCatalog(res);
    });
    _router.get('/' + ROUTE + "/:id", function(req, res) {
        //res.json({ users: getCatalog() });
        getDocumentById(req.params.id, res);
    });
    _router.post('/' + ROUTE, function(req, res) {
        var model = new models.Item();
        model.itemName = (req.body.itemName) ? req.body.itemName : "";
        model.itemSku = (req.body.itemSku) ? req.body.itemSku : "";
        model.itemTag = (req.body.itemTag) ? req.body.itemTag : "";
        model.itemDepartment = (req.body.itemDepartment) ? req.body.itemDepartment : "";
        model.itemCategory = (req.body.itemCategory) ? req.body.itemCategory : "";
        model.priceType = (req.body.priceType) ? req.body.priceType : "";
        model.cost = (req.body.cost) ? req.body.cost : "";
        model.taxType = (req.body.taxType) ? req.body.taxType : "";
        model.price = (req.body.price) ? req.body.price : "";
        model.taxedPrice = (req.body.taxedPrice) ? req.body.taxedPrice : "";
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
    var init = function(router, mongodb, tagrepo, departmentrepo, categoryrepo, taxrepo) {
        _router = router;
        _mongodb = mongodb;
        tagRepo = tagrepo;
        taxRepo = taxrepo;
        departmentRepo = departmentrepo;
        categoryRepo = categoryrepo;
        initDb();
        initRoutes();
    }

    return {
        init: init,
        initData: initData
    };
};