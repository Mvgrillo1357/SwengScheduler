const mongoose = require('mongoose');
const User = require('./user');

/**
 * Admin -- EXTENDS USER
 * 
 * This will inherit all the user's functionality using Mongoose Discriminator
 */
const Admin = User.discriminator('Admin', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);
    
module.exports = Admin;