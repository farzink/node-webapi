var _mongodb;
var _router;

module.exports = create();




// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/nodejs';

function _initData() {
    var MongoClient = _mongodb.MongoClient;
    // Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            //HURRAY!! We are connected. :)
            console.log('Connection established to', url);

            var collection = db.collection('users');


            var user1 = { name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user'] };
            var user2 = { name: 'modulus user', age: 22, roles: ['user'] };
            var user3 = { name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user'] };

            // Insert some users
            collection.insert([user1, user2, user3], function(err, result) {
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
    this.rc = "some value";
    var MongoClient = _mongodb.MongoClient;
    r = this;
    MongoClient.connect(url, function(err, db) {
        //console.log(rc);
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
            return null;
        } else {
            var result = null;
            var collection = db.collection('users');
            collection.find({}).toArray(function(err, result) {
                if (err) {
                    console.log(err);
                } else if (result.length) {
                    res.json({ users: result });
                    db.close();                    
                } else {
                    db.close();
                }
                //Close connection
                //db.close();
            });

            //console.log(collection.find({}));
            //db.close();
            //console.log("here...");
            //console.log(rc);
            //return this.rc;
            //return "some value";
        }
    });
    return "some value...";
}


function getC() {
    var MongoClient = _mongodb.MongoClient;
}


function initRoutes(router) {
    _router.get('/', function(req, res) {
        //res.json({ users: getCatalog() });
        getCatalog(res);
    });

    _router.get('/res', function(req, res) {
        res.json({ message: 'kir!!!!' });
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