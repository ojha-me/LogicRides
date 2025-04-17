const mongoose = require("mongoose");

// create a schema constructor
const Schema  = mongoose.Schema;

const UserSchema  = new Schema ({

    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique:true,
        lowercase: true, // lowercase for consistency
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // regex for email from chatgpt
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    timestamps: true
});

// todo: add a presave hook to hash the password before saving

// create a model and export it
// mongoose.model('ModelName', schema) compiles a schema into a model
// User will be model name but users (plural handled by mongoose) will be used for collections
module.exports = mongoose.model("User", UserSchema);