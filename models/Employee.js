const mongoose = require('mongoose');
const User = require('./user');

const Employee = User.discriminator('Employee', 
    new mongoose.Schema(
        // Custom SuperUser Fields here
        { }, 
        // What key to use for the discriminator
        {discriminatorKey: 'role'}
    )
);

module.exports = Employee;