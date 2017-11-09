var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TodoApp', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

module.exports={mongoose};