require('./config/config');

var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var {authenticate} = require('./middleware/authenticate');

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
var port = process.env.PORT;

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
        res.status(200).send({
            todo
        });
        // console.log({todo});
    }).catch((e) => {
        res.status(400).send({});
    });

})

app.delete('/todos/:id', (req, res) => {
    //get id
    var id = req.params.id;

    //validate id-> not valid return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            info: "invalidId"
        });
    }
    //remove todobyid
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);


    }).catch((e) => {
        res.status(400).send({});
    })
})


app.patch('/todos/:id', (req, res) => {
    //get Id
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    // console.log(req);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            info: "invalidId"
        });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send(e);
    })

})

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
})



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});



app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};


// app.get('/', function (req, res) {
//     res.send('GET request to the homepage')
//   })