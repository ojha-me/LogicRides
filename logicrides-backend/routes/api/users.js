const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
// import user model
const User =require("../../models/User")

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public (anyone can register)
router.post("/register", async (req, res) => {
    // we need data from request body for this we need a express.json() middleware enabled in server.js
    const { name, email, password, phone } = req.body;
    try {
        let user =  await User.findOne({ email: email.toLowerCase() }); 
        if (user) {
            return res.status(400).json({
                errors: [{
                    msg: "User already exists"
                }]
            })
        }
        user = new User({
            name,
            email: email.toLowerCase(),
            phone,
            password // we will hash before saving
        });

        // generate a 'salt' (random data to add to hashing) - 10 rounds is common
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user : {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        })
    }
    catch (error) {
        console.error("Error registering user", error);
        if (error.message === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ errors: messages });
        }
        res.status(500).send('Server error during registration');
    }
})

module.exports = router;