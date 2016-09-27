//var collection = DB.collection(COLLECTION_NAME);
var model = ["1", "2", "3", "4", "5"];
var q = model.map(function(item) {
    return {
        "name": item
    };
});
console.log(q);