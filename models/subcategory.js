const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    
    subCategoryName : {
        type : String,
        required : true
    },
    category_id : {
        type : Schema.Types.ObjectId,
        required:true
    }
});

const SubCategory = mongoose.model('subcategory',subCategorySchema);
module.exports = SubCategory;