var models = require('../model/model')

var _mongodb;
var _router;

module.exports = create();

var COLLECTION_NAME = "MDCategory"
var ROUTE = "Category";




var url = 'mongodb://localhost:27017/nodejs';
//var url = 'mongodb://52.6.167.164:27017/nodejs';
//just a simple fucking function to seed some initial data, na gholam!
function _initData() {
    var MongoClient = _mongodb.MongoClient;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            var collection = db.collection(COLLECTION_NAME);


            var category = { name: 'Computers' };
            //var user2 = { name: 'modulus user', age: 22, roles: ['user'] };
            //var user3 = { name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user'] };

            // Insert some users
            collection.insert([category], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
                }
                //Close connection
                db.close();
            });
            // do some work here with the database.

            //Close connection
            db.close();
        }
    });
}


function getCatalog(res) {
    //var MongoClient = _mongodb.MongoClient;
    r = this;
    _mongodb.MongoClient.connect(url, function(err, db) {
        //console.log(rc);
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return null;
        } else {
            var result = null;
            var collection = db.collection(COLLECTION_NAME);
            collection.find({}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
setTimeout(function() {
res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
                    res.json({ items: result });
                    db.close();
}, 2000);

                } else {
                    db.close();
                }
                //Close connection
                //db.close();
            });
        }
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
                db.close();
                res.status("201");
                res.json({ status: "OK" });
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
	console.log("-------------------------" + req.connection.remoteAddress);
        getCatalog(res);
    });

    _router.get('/res', function(req, res) {
        //res.json({ message: 'kir!!!!' });
        res.status("405");
        res.json({ status: "12" });
    });

    _router.post('/' + ROUTE, function(req, res) {
        var model = new models.Category();
        model.name = req.body.name;
        insert(model, res);
        //res.json({ response: req.body });
    });
}



function create() {
    var initData = function() {
        _initData();
    }
    var init = function(router, mongodb) {
        _router = router;
        _mongodb = mongodb;
        initRoutes();
    }

    return {
        init: init,
        initData: initData
    };
};