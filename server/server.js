var express = require('express');
var bodyParser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var {
    User
} = require('./models/user');
var Todo = require('./models/todo').Todo;


var app = express()

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    // console.log(req.body.text);
    var todo = new Todo({
        text: req.body.text
    });
    // console.log(todo);
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});



app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {
    app
};


// app.get('/', function (req, res) {
//     res.send('GET request to the homepage')
//   })