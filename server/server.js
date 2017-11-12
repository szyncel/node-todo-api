var express = require('express');
var bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');

var {
    mongoose
} = require('./db/mongoose');
var {
    User
} = require('./models/user');
var Todo = require('./models/todo').Todo;


var app = express()
var port= process.env.PORT || 3000;

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


app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            // info:"invalidId"
        });
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({});
        }
        res.status(200).send({todo});
        // console.log({todo});
    }).catch((e) => {
        res.status(400).send({});
    });

})



app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};


// app.get('/', function (req, res) {
//     res.send('GET request to the homepage')
//   })