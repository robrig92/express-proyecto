const express = require('express');
const router = express.Router();
const Image = require('./models/image').Image;

router.get('/', (request, response) => {
    response.render('app/home');
});

router.get('/imagenes/new', (request, response) => {
    response.render('app/imagenes/new');
});

router.get('/imagenes/edit', (request, response) => {

});

router.route('/imagenes/:id')
    .get((request, response) => {
        Image.findById(request.params.id, (error, image) => {
            if (error) {
                response.redirect('/app/imagenes');
            }

            response.render('app/imagenes/show', {
                image
            });
        });
    })
    .put((request, reponse) => {

    })
    .delete((request, response) => {

    });

router.route('/imagenes')
    .get((request, response) => {

    })
    .post((request, response) => {
        const image = new Image({
            title : request.body.title
        });

        image.save((error) => {
            if (error) {
                console.log(error);
                response.redirect('/app/imagenes/new');
            }
            response.redirect(`/app/imagenes/${image._id}`);
        });
    })

module.exports = router;