var mongoose=require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        minlenth: 1,
        trim: true

    }
})

var User = mongoose.model('User', userSchema);

module.exports={User}