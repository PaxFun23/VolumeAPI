const mongoose = require('mongoose');
const config = require('../config/database');

// Token Schema
const TokenSchema = mongoose.Schema({
    token:{
        type: String,
        required:true
    },
    s:{
        type: String
    }
});

const Token = module.exports = mongoose.model('Token',TokenSchema);

module.exports.getToken = function(callback){
    const query = {s:"token"}
    Token.findOne(query,callback);
}

module.exports.updateToken = function(newToken,callback){
    const updateQuery = {token:newToken,s:"token"}
    Token.update({s:"token"},updateQuery,callback);
}