const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const request = require('request');
const fs = require('fs');
const jsonfile = require('jsonfile');
const Token = require('../models/token')
const Coast = require('../models/coast')


// router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
//     res.json({user: req.user});
//   });
let accessId;
let accessKey;
jsonfile.readFile('apikey.json', function(err, obj) {
    accessId = obj.accessId;
    accessKey = obj.accessKey;
})

let apikey;
Token.getToken((err,token)=>{
    if(err) throw err;
    apikey = token.token;
    console.log(apikey);
});


let keyValidated;
function getToken(){
    console.log("Getting new token...");
    request.post({
        headers: {'content-type' : 'application/json','Accept': 'application/json'},
        url:     'https://api.voluum.com/auth/access/session',
        body:    `{"accessId": "${accessId}", "accessKey": "${accessKey}"}`
        }, function(error, response, body){
        let data = JSON.parse(body);
        apikey = data.token;
        Token.updateToken(apikey,(err,token)=>{
            keyValidated = false;
        });
    });
}
function checkToken(){
    request.get({
        headers: {'cwauth-token' : apikey},
        url:     'https://api.voluum.com/auth/access',
        }, function(error, response, body){
        if(response.statusCode == 401){
            getToken();
        }
        else {
            keyValidated = true;
        }
    });
}


router.get('/campaigns/:qstr', passport.authenticate('jwt', {session:false}),(req,res) => {
    let queryString = req.params.qstr;
    let totaldbcoast = 0;
    request.get({
        headers: {'cwauth-token' : apikey},
        url:     'https://api.voluum.com/report?' + queryString,
        }, function(error, response, body){

            Coast.getCoasts((err,data)=>{
                if(err) throw err;
                body = JSON.parse(body);
                    for(let i=0;i < body.rows.length;i++){
                        for(let j = 0; j < data.length;j++){
                            if(body.rows[i].campaignId == data[j].campId){
                                body.rows[i].dbcoast = data[j].coast;
                                totaldbcoast += data[j].coast;
                                break;
                            }
                            else {
                                body.rows[i].dbcoast = 0;
                            }
                        }
                    }
                body.totals.dbcoasts = totaldbcoast;
                body = JSON.stringify(body);
                res.json(body);
        });
            
    });

    
           
});

router.get('/validatekey', passport.authenticate('jwt', {session:false}),(req,res)=>{
    checkToken();
    if(keyValidated){
        res.json({msg:"Key validated!",code:"1"});
    }
    else {
        res.json({msg:"Refreshing",code:"0"});
    }
});

router.post('/coasts', passport.authenticate('jwt', {session:false}),(req,res)=>{
    
    const coast = new Coast({
        campId:req.body.campId,
        coast:req.body.coastNum
    });

    Coast.getCoast(coast.campId,(err,data)=>{
        if (err) throw err;
        if(data == null){

            Coast.addCoast(coast,(err,data)=>{
                if (err) throw err;
            });
        }
        else {
            Coast.updateCoast(coast,(err,data)=>{
                if (err) throw err;
            });
        }
    });
    res.json({
        success:true
    })

});

// router.get('/coast', passport.authenticate('jwt', {session:false}),(req,res)=>{
    
//     const campId = 123;
//     Coast.getCoast(campId,(err,data)=>{

//         let msg = "";
//         if(err) throw err;
//         if(data == null){
//             msg = "Ne postoji"
//         }
//         else {
//             msg = "Postoji";
//             res.json(data);
//         }
        
//     });

// });


module.exports = router;

