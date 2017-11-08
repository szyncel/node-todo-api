const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB sever');

    // db.collection('Users').deleteMany({name:"Andrzej"}).then((res) => {
    //     console.log(res.result);
    // })

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a035e139a491103ed3b809f')
    }).then((res) => {
        console.log(res.value);
    })

    //deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat chicken'
    // }).then((res) => {
    //     console.log(res);
    // })

    //deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Eat chicken'
    // }).then((res) => {
    //     console.log(res);
    // })

    // db.collection('Todos').findOneAndDelete({
    //     text: 'Eat chicken'
    // }).then((res) => {
    //     console.log(res);
    // })

    // db.close();
});