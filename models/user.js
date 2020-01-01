const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://127.0.0.1:27017/fotos');

const genres = ['M', 'F'];

const userSchema = new Schema({
    name: String,
    username: {type: String, required: 'The username is required', maxlength: [50, 'The max length alloweed is 50']},
    password: {type: String, minlength: [8, 'The min length is 8']},
    age: {type: Number, min: [5, 'The min age is 5'], max: [99, 'The max alloweed age is 99']},
    email: {type: String, required: 'The e-mail is required'},
    date_of_birth: Date,
    genre: {type: String, enum: {values: genres, message: 'Invalid option'}}
});

userSchema.virtual('password_confirmation')
    .get(() => {
        return this.p_c;
    })
    .set((password) => {
        this.p_c = password;
    });

const User = mongoose.model('User', userSchema);

module.exports.User = User;
