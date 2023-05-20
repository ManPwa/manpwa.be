const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@rout POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Form is not completed!");
    }
    const available_user = await User.findOne({
        "email": email
    });
    console.log(available_user);
    if (available_user) {
        res.status(400);
        throw new Error("This email is already registered!");
    };

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    req.body.password = hashedPassword;
    req.body.is_admin = false;
    const user = await User.create(req.body);
    if (user) {
        res.status(201).json(
            {
                "_id": user._id
            }
        )
    } else {
        res.status(400);
        throw new Error("User data is invalid!")
    }
});


//@desc Login user
//@rout POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Form is not completed!");
    }
    const user = await User.findOne({email});
    //compare password with hash password
    if (user && (await bcrypt.compare(password, user.password))) {
        const access_token = jwt.sign(
            {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin,
                    date_of_birth: user.date_of_birth,
                    avatar_url: user.avatar_url
                },
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.status(200).json({
            "user_id": user._id,
            "access_token": access_token
        });
    } else {
        res.status(401);
        throw new Error("Email or password is not correct");
    };
});


//@desc Current user info
//@rout GET /api/user/current
//@access public
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser }