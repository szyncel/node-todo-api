const {
    ObjectID
} = require('mongodb');
const {
    Todo
} = require('./../../models/todo');
const {
    User
} = require('./../../models/user');
const jwt = require('jsonwebtoken');



const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => {
        done();
    })
};

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
const users = [{
        _id: userOneId,
        email: "abc@abc.pl",
        password: "pass123",
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userOneId,
                access: 'auth'
            }, 'abc123').toString()
        }]

    },
    {
        _id: userTwoId,
        email: "second@account.pl",
        password: "pass321",
        tokens: [{
            access: 'auth',
            token: jwt.sign({
                _id: userTwoId,
                access: 'auth'
            }, 'abc123').toString()
        }]

    }
];

const todos = [{
    _id: new ObjectID(),
    text: "first Todo",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "Second Todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => {
        done();
    })
};



module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};