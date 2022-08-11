const mongoose = require('mongoose');
const User = require('./user');

/**
 * SuperUser
 * 
 * This will inherit all the user's functionality using Mongoose Discriminator
 */
const SuperUser = User.discriminator('SuperUser', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);
    
module.exports = SuperUser;