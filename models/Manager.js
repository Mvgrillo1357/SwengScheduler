const mongoose = require('mongoose');
const User = require('./user');

/**
 * Manager
 * 
 * This will inherit all the user's functionality using Mongoose Discriminator
 */
const Manager = User.discriminator('Manager', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);
    
module.exports = Manager;