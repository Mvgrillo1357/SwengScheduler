const mongoose = require('mongoose');
const User = require('./user');

/**
 * Employee
 * 
 * This will inherit all the user's functionality using Mongoose Discriminator
 */
const Employee = User.discriminator('Employee', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);

module.exports = Employee;