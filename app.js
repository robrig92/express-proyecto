const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user').User;
const cookieSession = require('cookie-session');
const router_app = require('./router_app');
const session_middleware = require('./middlewares/session');
const methodOverride = require('method-override');

const app = express();

const userSchemaJSON = {
    email: String,
    password: String
};

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    name: 'session',
    keys: ['llave-1', 'llave-2']
}));
app.use(methodOverride('_method'));

app.set('view engine', 'jade');

app.get('/', (request, response) => {
    console.log(request.session.user_id);
    
    response.render('index');
});

app.get('/login', (request, response) => {
    response.render('login');
});

app.get('/signup', (request, response) => {
    response.render('signup');
});

app.post('/users', (request, response) => {
    let user = new User({
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        password_confirmation: request.body.password_confirmation
    });

    user.save().then((document) => {
        response.send('Usuario guardado');
    }, (error) => {
        if (error) {
            console.log(error);
            response.send('Ocurrió un error al insertar el usuario');
        }
    });
});

app.post('/sessions', (request, response) => {
    User.findOne({
            email: request.body.email,
            password: request.body.password
    }, (error, user) => {
        if (error) {
            response.render('login');
        }

        console.log(user);

        if (!user) {
            response.render('login');
        }

        request.session.user_id = user._id;
        response.redirect('/app');
    });
});

app.use('/app', session_middleware);
app.use('/app', router_app);

app.listen(8080);