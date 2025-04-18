const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
// import user model
const User =require("../../models/User");
const authMiddleware = require("../../middleware/auth");

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


// @route   POST api/users/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post("/login", async (req, res)=> {
    const { email, password } = req.body;
  
    if (!email || !password) {
        return res.status(400).json({
            errors: [{
                message: "Email or password missing"
            }]
        })
    }

    try {
        /**
         * Mongoose schemas, by default, exclude the password field when converting to JSON 
         * (like in the register response),but the findOne query does retrieve it from the 
         * database for comparison purposes
         */
        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if (!user) {
           return res.status(400).json({
                errors: [{
                    message: "This user doesn't exist."
                }]
            })
        }
        // bcrypt compares plain password to stored hash securely
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    message: "Worng password"
                }]
            })
        }

        // if the password matches, we create a JWT token and store that in the users browser
        const payload = {
            id: user.id,
            email: user.email
        };
        const jwtSecret = process.env.JWT_SECRET;
        const options = {
            expiresIn: '1h'
        }

        // create the jwt token
        // jwt.sign(payload,secret,options,callback)
        jwt.sign(
        payload,
        jwtSecret,
        options,
        (err, token) =>{
            if (err) {
                throw err;
            }
            res.status(200).json({
                message: "Login Successful",
                token: token
            })
        })
    }
    catch (error) {
        console.error("Something went wrong while logging in", error.message);
        res.status(500).send("Server error during login")
    }
        
})

// @route   GET api/users/profile
// @desc    Get current user's profile
// @access  Private (requires token)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const fullUser = await User.findById(req.user.id).select('-password');
        if (!fullUser) {
            return res.status(404).json({
                msg: 'User not found' 
            });
        }
        res.json(fullUser);
    }
    catch (err) {
        console.error("Couldnt find profile for the user", err.message)
        res.status(500).json({
            status: 500,
            message: "Server error. Couldn't find profile",
        });
    }
});


// @route   GET api/users/profile
// @desc    Get current user's profile
// @access  Private (requires token)
router.put('/profile', authMiddleware, async (req, res) => {
    const { name, phone } = req.body

    // create profileFields object to update
    const profileFields = {};
    if (name) profileFields.name = name;
    if (phone) profileFields.phone = phone;
 if (Object.keys(profileFields).length === 0) {
     return res.status(400).json({ message: "No fields to update" });
 }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: profileFields
            },
            { new: true, runValidators: true }
        ).select('-password')
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Profile updated successfully', user });

    }
    catch (err) {
        console.error('Update Profile Error:', err.message);
         // Handle potential validation errors during update
        if (err.name === 'ValidationError') {
             const messages = Object.values(err.errors).map(val => val.message);
             return res.status(400).json({ errors: messages });
        }
        res.status(500).send('Server Error');
    }
})


module.exports = router;