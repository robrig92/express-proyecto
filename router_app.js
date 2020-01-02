const express = require('express');
const router = express.Router();
const Image = require('./models/image').Image;
const imageFinderMiddleware = require('./middlewares/find_image');
const fs = require('fs');

router.get('/', (request, response) => {
    response.render('app/home');
});

router.get('/imagenes/new', (request, response) => {
    response.render('app/imagenes/new');
});

router.all('/imagenes/:id*', imageFinderMiddleware);

router.get('/imagenes/:id/edit', (request, response) => {
    response.render('app/imagenes/edit');
});

router.route('/imagenes/:id')
    .get((request, response) => {
        response.render('app/imagenes/show');
    })
    .put((request, response) => {
        const image  = response.locals.image;

        image.title = request.body.title;
        image.save((error) => {
            if (error) {
                response.redirect(`/app/imagenes/${request.params.id}/edit`);
            }
            response.redirect('/app/imagenes');
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
        Image.find({
            creator: response.locals.user._id
        }, (error, images) => {
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
        const extension = request.files.file.name.split('.').pop();

        const image = new Image({
            title : request.fields.title,
            creator: response.locals.user._id,
            extension: extension
        });

        image.save((error) => {
            if (error) {
                console.log(error);
                response.redirect('/app/imagenes/new');
            }
            fs.renameSync(request.files.file.path, `public/images/${image._id}.${extension}`);
            response.redirect(`/app/imagenes/${image._id}`);
        });
    })

module.exports = router;