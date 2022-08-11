const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const options = { discriminatorKey: 'role' };

/**
 * USER SCHEMA
 * 
 * This schema holds all the information that is unique to the user class
 */
const UserSchema  = new mongoose.Schema({
    firstName :{
        type  : String,
        required : [true, 'Must enter first name'],
    },
    lastName :{
        type  : String,
        required : [true, 'Must enter last naem'],
    },
    personalEmail :{
        type  : String,
        required : [true, 'Must enter personal email'],
        unique: [true, "Email Already exists"],
    },
    login :{
        type  : String,
        required : [true, 'Must enter a login/username'],
        unique: [true, "Login is already in use"],
    },
    password : {
        type  : String,
        required : [true, 'Must have a password']
    },
    dateOfHire :{
        type : Date,
        default : Date.now
    },
    numberOfReports :{
        type  : Number,
    },
    permissionLevel :{
        type  : Number,
        default: 1,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization', 
    },
    secret: {
        type: String,
    },
    lastLoggedIn: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['active', 'terminated'],
        default: 'active',
    },
    manager :{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    },
}, options);

/**
 * Returns the name for the user that concats the first and last names
 */
UserSchema.virtual('name')
    .get(function() {
        return this.firstName + ' ' + this.lastName;
    });

/** 
 * Return's the last date the user logged in in a readable format
 * 
 */
UserSchema.virtual('lastLoggedInDate')
    .get(function() {
        if(this.lastLoggedIn) {
            var mm = this.lastLoggedIn.getMonth() + 1; // getMonth() is zero-based
            var dd = this.lastLoggedIn.getDate();
          
            return [this.lastLoggedIn.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('-');
        }
        return "Never";
    });

    /**
     * Returns the roles that can be set for an employee
     * 
     * @returns (array) A list of roles
     */
UserSchema.methods.getRoles = function() {
    return ['Employee', 'SuperUser', 'Manager', 'HR'];
}

/** Check to see if the user can change role
 * newRole - The role the user will become
 * userMakingTheChange - the user who is trying to change this user
 */
UserSchema.methods.canChangeRole = async function(newRole, userMakingTheChange) {
    // If the user is the same as the one making the change, show an error
    if(userMakingTheChange._id.toString() == this._id.toString()) {
        return [false, "Users cannot change their own role"];
    }

    // If the user is a super user and they are changing to not a super user
    if(this.role == 'SuperUser' && newRole != 'SuperUser') {
        // Check to see if they're the last SuperUser
        let list = await User.find({
            _id: {$ne: this._id},
            role: 'SuperUser',
            organization: this.organization,
        })
        // If list length is 0, then there are no other SuperUsers
        if(list.length == 0) { return [false, "Cannot remove the last SuperUser"]; }
    }

    // If they have manging role and they are moving to a non-manager role, 
    // then we need to check to see if they are manging any employees
    // If they're going into a managing role it is OK
    if(['HR', 'Manager', 'SuperUser'].includes(this.role) && newRole == 'Employee') {
        let managedEmployees = await User.find({
            manager: this,
        });

        if(managedEmployees.length > 0) {
            let names = managedEmployees.map((item) => item.name).join('\n\t');
            return [false, `Cannot change until employee no longer manages other Employees.\n Currently managing: \n ${names}`];
        }
    }
    // Check to make sure the user has permissions to make changes to a higher role
                // [0,          1,      2,      3]
    let roles = ['Employee', 'Manager', 'HR', 'SuperUser'];

    if(roles.indexOf(userMakingTheChange.role) < roles.indexOf(newRole)) {
        return [false, "You cannot give a higher role than you are."];
    }
    if(roles.indexOf(userMakingTheChange.role) < roles.indexOf(this.role)) {
        return [false, "You cannot change a higher role than you are."];
    }
    
    // If we get this far then we've passed all the checks and they can change the role.
    return [true, ""];
};

UserSchema.methods.setRole = async function(role) {
    // Must include overwriteDiscriminatorKey to be able to change the role
    // https://github.com/Automattic/mongoose/issues/6087#issuecomment-652056299
    return await User.findByIdAndUpdate(
        this._id,
        {role: role},
        {overwriteDiscriminatorKey: true}
    );
}

// UserSchema.path('personalEmail').validate(async function(value) {
//     let count = await this.model('User').count({ personalEmail: value });
//     return count == 0;
// }, 'Email already exists');

// UserSchema.path('login').validate(async function(value) {
//     let count = await this.model('User').count({ login: value });
//     return count == 0;
// }, 'Login already exists');


/**
 * setPassword
 * 
 * Sets the user's password using bcrypt
 * 
 * @param {String} newPassword 
 * @returns 
 */
UserSchema.methods.setPassword = async function(newPassword) {
    const user = this;
    // Return a promise to make it async
    return new Promise( function(resolve, reject) {
        // Hash and salt the user's passsword
        bcrypt.genSalt(10, function (err,salt) {
            if(err) reject(err)
            bcrypt.hash(newPassword, salt,
                function (err,hash)  {
                    if(err) reject(err);
                    // Save it to the database
                    user.password = hash;
                    resolve();
                }
            )
        });
    });
};

const User = mongoose.model('User',UserSchema);

module.exports = User;