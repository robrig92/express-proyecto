const Image = require('../models/image').Image;
const ownerCheck = require('./image_permission');

module.exports = (request, response, next) => {
    Image.findById(request.params.id)
        .populate('creator')
        .exec((error, image) => {
            if (!image) {
                response.redirect('/app');
            }

            if (!ownerCheck(image, request, response)) {
                console.log('aqui ando');
                
                response.redirect('/app');
            }

            response.locals.image = image;
            next();
        });
}