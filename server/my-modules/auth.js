const urlDatabase = 'mongodb://localhost:27017/';
var url = require('url');
var sha1 = require('sha1');
var jwt = require('jsonwebtoken');

exports.createAccount = function (req,res){
    var body  = [];
    req.on('data',(b)=>{
        body.push(b)
    }).on('end',()=>{
        let textData = Buffer.concat(body).toString();
        let jsonData = JSON.parse(textData);
         
  
        //  { username:"" , password:"" , fullname:"" }
        
        var MongoClient = require('mongodb').MongoClient;

        // url connection 
        MongoClient.connect(urlDatabase).then((db) => {
            //...
            console.log("DATABASE CONNECTED");
            var database = db.db('technologiaDB');

            // username unique auth 
            database.collection('users').findOne({ 'username': jsonData.username }).then((result)=>{

                if (result === null ) {
                    // we can add the new user
                    let user = {
                        username: jsonData.username,
                        fullname:jsonData.fullname,
                        password: sha1(jsonData.password ) // save password plain text ? we save passwords 
                    }
                    database.collection('users').insertOne( user ).then((resultInsert)=>{

                        res.send({success:true, message:"Account created successfully."})

                    }).catch((err)=>{
                        res.send({success:false, message:"Something went wrong"})
                    })
                }else{
                    res.send({success:false, message:"Username is already in use."})
                }

                 
            }).catch((err)=>{
                res.send({success:false, message:"Something went wrong"})
            })

        })

       
  
    })
}



exports.signInWithUsernameAndPassword = function(req,res){
    var body  = [];
    req.on('data',(b)=>{
        body.push(b)
    }).on('end',()=>{
        let textData = Buffer.concat(body).toString();
        let jsonData = JSON.parse(textData);
         
  
        //  { username:"" , password:"" }
       
  
        // generate a new token !!
        // check login and password first
        // database ????


        
        var MongoClient = require('mongodb').MongoClient;

        // url connection 
        MongoClient.connect(urlDatabase).then((db) => {
            //...
            console.log("DATABASE CONNECTED");
            var database = db.db('technologiaDB');

            database.collection('users').findOne({ username:jsonData.username, password : sha1(jsonData.password) }).then((r)=>{

                if (r !== null) {
                    // generate a new token
                    var token  = jwt.sign({
                        user:r,
                
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + ((60 * 60 ) * 24 ) , // 24 hours
                
                      },
                      'abcd'
                      )
                
                      res.send( { succes:true, token:token } );

                }else{
                    res.send({succes:false, message:"wrong username or password"})
                }
            }).catch((err)=>{
                res.send({succes:false, message:"Something went wrong"})
            })
        })



 
  
    })
}