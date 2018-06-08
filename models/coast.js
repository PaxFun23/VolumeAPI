const mongoose = require('mongoose');
const config = require('../config/database');

// Coast Schema
const CoastSchema = mongoose.Schema({
    campId:{
        type: String,
        required:true
    },
    coast:{
        type: Number
    }
});

const Coast = module.exports = mongoose.model('Coast',CoastSchema);

module.exports.getCoasts = function(callback){
    Coast.find({},callback);
}

module.exports.getCoast = function(campId,callback){
    Coast.findOne({campId:campId},callback);
}

module.exports.updateCoast = function(coast,callback){
    const updateQuery = {campId:coast.campId,coast:coast.coast}
    Coast.update({campId:coast.campId},updateQuery,callback);
}

module.exports.addCoast = function(coast, callback){
    coast.save(callback);
}