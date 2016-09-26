module.exports = models();


function models() {
    Category.prototype = {
        _id: "",
        name: ""
    };
    Tag.prototype = {
        _id: "",
        name: "",
        value: "",
        text: ""        
    };
    Tax.prototype = {
        _id: "",
        name: "",
        percentage: ""
    };
    Department.prototype = {
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

    function Tag() {}

    function Department() {}


    function Tax() {}

    function Category() {}
    return {
        Supplier: Supplier,
        Category: Category,
        Tag: Tag,
        Department: Department,
        Tax: Tax
    }
}