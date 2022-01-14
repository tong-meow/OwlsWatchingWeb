const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLM = require('passport-local-mongoose');

// the schema for user
const UserSchema = new Schema({
    // fields: 1/ user name 2/ password 3/ e-mail
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

// Feature from 'Passport':
// plug the user-name and password to the user schema
UserSchema.plugin(passportLM);

// export the user schema
module.exports = mongoose.model('User', UserSchema);