const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB sever');


    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a035b779a491103ed3b7fbe')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((res) => {
    //     console.log(res);
    // })


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a01eb55373c2c150c8d7114')
    },{
        $inc:{
            age:1
        },
        $set:{
            name:"Mateusz"
        }
    },{
        returnOriginal:false
    }).then((res) => {
        console.log(res);
    })

});