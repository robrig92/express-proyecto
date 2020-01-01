const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user').User;

const app = express();

const userSchemaJSON = {
    email: String,
    password: String
};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'jade');

app.get('/', (request, response) => {
    response.render('index');
});

app.get('/login', (request, response) => {
    User.find((err, users) => {
        if (err) throw err;
        console.log(users);
    });
    response.render('login');
});

app.post('/users', (request, response) => {
    let user = new User({
        email: request.body.email,
        password: request.body.password,
        password_confirmation: request.body.password_confirmation
    });

    user.save((err, user) => {
        if (err) throw err;
        response.send('Usuario guardado');
    });
});

app.listen(8080);