const User = require("../models/userModel");

const registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        if (userExists.password === password) {
            res.status(200).json({
                _id: userExists._id,
                email: userExists.email,
            });
        } else {
            res.status(400);
            throw new Error("Incorrect password");
        }
    } else {
        try {
            const user = await User.create({
                email,
                password,
            });

            res.status(201).json({
                _id: user._id,
                email: user.email,
            });
        } catch (error) {
            res.status(400);
            throw new Error("Failed to create the user");
        }
    }
};

module.exports = { registerUser }