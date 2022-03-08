const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const CategorySchema = new Schema({
    
    categoryName : {
        type :  String,
        required : true
    },
    items_sold : {
        type : Number,
        default : 0
    }
});

const Category = mongoose.model('category',CategorySchema,'category');
module.exports = { Category };