const mongoose = require('mongoose');

let userSchema = mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        reviews: [String],
        followed: [String],
        peopleFollowed:[String],
        isContributing: {type: Boolean, required: true}
    }
)

const register = mongoose.model('User', userSchema);
module.exports = register;