const mongoose = require('mongoose');
const User = require('./user');

const SuperUser = User.discriminator('SuperUser', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);
    
module.exports = SuperUser;