const User = require('../models/user').User;

module.exports = (request, response, next) => {
    if (!request.session.user_id) {
        response.redirect('/login');
    }

    User.findById(request.session.user_id, (error, user) => {
        if (error) {
            console.log(error);
            response.redirect('/login');
        }

        response.locals = { user: user };
        next();
    });
}