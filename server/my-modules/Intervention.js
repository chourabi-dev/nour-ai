var mongo = require('mongodb');
const urlDatabase = 'mongodb://localhost:27017/';
var url = require('url');

var ObjectId = require('mongodb').ObjectId;

exports.createIntevention = function (req, res) {

    var body = [];
    req.on('data', (b) => {
        body.push(b)
    }).on('end', () => {
        let textData = Buffer.concat(body).toString();
        let jsonIntervention;
        try {
            jsonIntervention = JSON.parse(textData);
 
            var MongoClient = require('mongodb').MongoClient;

            // url connection 
            MongoClient.connect(urlDatabase).then((db) => {
                //...
                console.log("DATABASE CONNECTED");

                // 
                var database = db.db('technologiaDB');


                database.collection('interventions').insertOne(jsonIntervention).then((data) => {
                    res.send({ success: true, message: "intervention inserted successfully !!" });
                }).catch((err) => {
                    res.send({ success: false, message: "Could't insert the intervention data" });
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


exports.findByVehiculeId = function (req,res) {
    const query  = url.parse(req.url,true).query;

    console.log(query);

    let filter = {}

    if (query.id != null) {
        filter.vehicule_id  =  (query.id)
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
        database.collection('interventions').find( filter ).toArray().then((result)=>{
            res.send({ success: true, data: result });
        }).catch((err)=>{
            res.send({ success: false, message: "Something went wrong" });
        })



    }).catch((err) => {
        // 
        res.send({ success: false, message: "Something went wrong" });
    })
}