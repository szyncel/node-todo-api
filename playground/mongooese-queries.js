const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/user');


var id='5a038d9183eaa319b898aea8';

if(!ObjectID.isValid(id)){
    console.log('id not found');
}



User.findById(id).then((user) => {
    if(!user){
        return console.log('user not found');
    }
    console.log(user);
}).catch((e) => {
    console.log(e);
})