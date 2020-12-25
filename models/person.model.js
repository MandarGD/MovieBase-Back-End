const mongoose = require('mongoose');

let personSchema = mongoose.Schema(
    {
        name: String,
        works: [String],
        frequent: [String],
        Followers: [String]
    }
)

const register = mongoose.model('Person', personSchema);
module.exports = register;