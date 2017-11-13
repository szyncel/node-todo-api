var env = process.env.NODE_ENV || 'development';
console.log('env ***********', env);
if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost/TodoAppTest';
} else if (env === 'production') {
    process.env.MONGODB_URI = 'mongodb://szyncel:szynka123@ds257245.mlab.com:57245/szyncel-todo-test';
}