var mongoose = require('mongoose');
mongoose.connect('mongodb://szyncel:szynka123@ds257245.mlab.com:57245/szyncel-todo-test', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

module.exports = {
    mongoose
};

//mongodb://localhost/TodoApp
//'mongodb://szyncel:szynka123@ds257245.mlab.com:57245/szyncel-todo-test' ||