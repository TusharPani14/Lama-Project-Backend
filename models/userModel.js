const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;