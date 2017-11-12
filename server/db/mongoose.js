var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/TodoApp', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

module.exports = {
    mongoose
};

//'mongodb://szyncel:szynka123@ds257245.mlab.com:57245/szyncel-todo-test' ||