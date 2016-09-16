module.exports = models();


function models() {
    Category.prototype = {
        _id: "",
        name: ""
    };
    Supplier.prototype = {
        _id: "",
        name: "",
        email: "",
        phone: ""
    };

    function Supplier() {}

    function Category() {}
    return {
        Supplier: Supplier,
        Category: Category
    }
}