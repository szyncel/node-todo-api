var mongoose=require('mongoose');

var todoSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false

    },
    completedAt: {
        type: Number,
        default: null


    }
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports={Todo}