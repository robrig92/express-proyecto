const express = require('express');
const router = express.Router();
const Image = require('./models/image').Image;

router.get('/', (request, response) => {
    response.render('app/home');
});

router.get('/imagenes/new', (request, response) => {
    response.render('app/imagenes/new');
});

router.get('/imagenes/:id/edit', (request, response) => {
    Image.findById(request.params.id, (error, image) => {
        if (error) {
            response.redirect('/app/imagenes');
        }

        response.render('app/imagenes/edit', {
            image
        });
    });
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
    .put((request, response) => {
        Image.findById(request.params.id, (error, image) => {
            if (error) {
                response.redirect(`/app/imagenes/${image._id}/edit`);
            }

            image.title = request.body.title;
            image.save((error) => {
                if (error) {
                    response.redirect(`/app/imagenes/${image._id}/edit`);
                }
                response.redirect('/app/imagenes');
            });
        });
    })
    .delete((request, response) => {
        Image.findOneAndRemove({
            _id: request.params.id
        }, (error, image) => {
            if (error) {
                console.log(error);
                response.redirect(`/app/imagenes/${request.params.id}`);
            }

            response.redirect('/app/imagenes');
        });
    });

router.route('/imagenes')
    .get((request, response) => {
        Image.find({}, (error, images) => {
            if (error) {
                console.log(error);
                response.redirect('/app');
            }
            response.render('app/imagenes/index', {
                images: images
            });
        });
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