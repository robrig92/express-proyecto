const express = require('express');
const User = require('./models/user').User;
const cookieSession = require('cookie-session');
const router_app = require('./router_app');
const session_middleware = require('./middlewares/session');
const methodOverride = require('method-override');
const formidable = require('express-formidable');

const app = express();

const userSchemaJSON = {
    email: String,
    password: String
};

app.use(express.static('public'));
app.use(cookieSession({
    name: 'session',
    keys: ['llave-1', 'llave-2']
}));
app.use(formidable({ keepExtensions: true }));
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
        email: request.fields.email,
        username: request.fields.username,
        password: request.fields.password,
        password_confirmation: request.fields.password_confirmation
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
            email: request.fields.email,
            password: request.fields.password
    }, (error, user) => {
        if (error) {
            response.render('login');
        }

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