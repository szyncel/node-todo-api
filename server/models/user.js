const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlenth: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    password: {
        type: String,
        require: true,
        minlenth: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}


userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });
    return user.save().then(() => {
        return token;

    });
}



var User = mongoose.model('User', userSchema);
module.exports = {
    User
}