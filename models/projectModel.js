const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String }
});

const projectSchema = mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        files: [fileSchema] 
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
