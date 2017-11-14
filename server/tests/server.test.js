const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');
const {
    User
} = require('./../models/user');

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }, (e) => {
                    done(e);
                })
            })
    })

    it('should not create todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                })
            })
    })


})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);



    })
});


describe('GET /todos/:id', () => {
    it('should return  todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });


    it('should return 404 if todo not found', (done) => {
        var testId = new ObjectID();
        request(app)
            .get(`/todos/${testId}`)
            .expect(404)
            // .expect((res) => {
            //     expect(res.body).toEqual({});
            // })
            .end(done);
    });

    it('should return 404 for non object ids', (done) => {

        request(app)
            .get(`/todos/123ss`)
            .expect(404)
            .end(done);

    });
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                // console.log(res.body);
                expect(res.body._id).toBe(id);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });
    it('should return 404 if todo not found', (done) => {
        var testId = new ObjectID();
        request(app)
            .delete(`/todos/${testId}`)
            .expect(404)
            // .expect((res) => {
            //     expect(res.body).toEqual({});
            // })
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete(`/todos/123ss`)
            .expect(404)
            .end(done);
    });
})

describe('PATCH /todos/id', () => {
    it('should update the todo', (done) => {
        var id = todos[1]._id.toHexString();
        var text = "Tralala";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: text,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                // console.log(res.body);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is  not completed', (done) => {
        var id = todos[1]._id.toHexString();
        var text = "Tralala second test";
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);

    })
})

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toEqual(users[0]._id);
                expect(res.body.email).toEqual(users[0].email);
            })
            .end(done);
    })

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'test')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    })
})


describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'test1@test.pl';
        var password = '123123123';
        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toExist();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    done(e);
                })

            });
    });

    it('should return validation error if request invalid', (done) => {
        var email = 'test1@test.pl';
        request(app)
            .post('/users')
            .send({
                email: email,
            })
            .expect(400)
            .end(done);
    });

    it('should not create a user if email in use', (done) => {
        var email = users[1].email;
        request(app)
            .post('/users')
            .send({
                email: email,
                password:'123123123'
            })
            .expect(400)
            .end(done);
    });
})