const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const offerSchema = new Schema({
    images : {
        type : String

    },
    expiry_date : {
        type : String
    }

},{timestamps : true});

const Banners = mongoose.model('banners',offerSchema);

module.exports = { Banners }