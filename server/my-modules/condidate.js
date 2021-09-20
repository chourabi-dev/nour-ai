var mongo = require('mongodb');
const urlDatabase = 'mongodb://localhost:27017/';
var url = require('url');

var ObjectId = require('mongodb').ObjectId;

exports.createCondidate = function (req, res) {

    var body = [];
    req.on('data', (b) => {
        body.push(b)
    }).on('end', () => {
        let textData = Buffer.concat(body).toString();
        let jsonCondidate;
        try {
            jsonCondidate = JSON.parse(textData);
 
            var MongoClient = require('mongodb').MongoClient;

            // url connection 
            MongoClient.connect(urlDatabase).then((db) => {
                //...
                console.log("DATABASE CONNECTED");

                // 
                var database = db.db('technologiaDB');


                database.collection('condidates').insertOne(jsonCondidate).then((data) => {
                    res.send({ success: true, message: "condidate inserted successfully !!" });
                }).catch((err) => {
                    res.send({ success: false, message: "Could't insert the condidate data" });
                })



            }).catch((err) => {
                // 
                res.send({ success: false, message: "Something went wrong" });
            })


        } catch (error) {
            res.send({ success: false, message: "badly formated data" });
        }



    })

}



exports.finById = function (req,res){
    
    const query  = url.parse(req.url,true).query;

    console.log(query);

    let filter = {}

    if (query.id != null) {
        filter._id  =  ObjectId(query.id)
    }

 

    console.log(filter);

    var MongoClient = require('mongodb').MongoClient;

    // url connection 
    MongoClient.connect(urlDatabase).then((db) => {
        //...
        console.log("DATABASE CONNECTED");

        // 
        var database = db.db('technologiaDB');


        // { key : value }
        database.collection('condidates').findOne( filter ).then((result)=>{
            res.send({ success: true, data: result });
        }).catch((err)=>{
            res.send({ success: false, message: "Something went wrong" });
        })



    }).catch((err) => {
        // 
        res.send({ success: false, message: "Something went wrong" });
    })
}


exports.ListCondidates = function (req, res) {

    const query  = url.parse(req.url,true).query;

    console.log(query);

    let filter = {}
 

 

    console.log(filter);

    var MongoClient = require('mongodb').MongoClient;

    // url connection 
    MongoClient.connect(urlDatabase).then((db) => {
        //...
        console.log("DATABASE CONNECTED");

        // 
        var database = db.db('technologiaDB');


        // { key : value }
        database.collection('condidates').find( filter ).toArray().then((result)=>{
            res.send({ success: true, data: result });
        }).catch((err)=>{
            res.send({ success: false, message: "Something went wrong" });
        })



    }).catch((err) => {
        // 
        res.send({ success: false, message: "Something went wrong" });
    })

}


exports.closeMeet =  function (req, res) {
    var body = [];
    req.on('data', (b) => {
        body.push(b)
    }).on('end', () => {
        let textData = Buffer.concat(body).toString();
        let jsonCondidate;
        try {
            jsonCondidate = JSON.parse(textData);
 
            var MongoClient = require('mongodb').MongoClient;

            // url connection 
            MongoClient.connect(urlDatabase).then((db) => {
                //...
                console.log("DATABASE CONNECTED");

                // 
                var database = db.db('technologiaDB');

 
                // update one
                database.collection('condidates').updateOne ( { _id:ObjectId(jsonCondidate.id) } , { $set: { 
                     
  
                    "didPassMeet": true,
                    "result":jsonCondidate.result, 


                 } } ).then((data) => {
                    res.send({ success: true, message: "vehicule updated successfully !!" });
                }).catch((err) => {
                    res.send({ success: false, message: "Could't update the vehicule data" });
                })
                



            }).catch((err) => {
                // 

                console.log(err);
                res.send({ success: false, message: "Something went wrong" });
            })


        } catch (error) {
            res.send({ success: false, message: "badly formated data" });
        }



    })

}
