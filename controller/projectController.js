const Project = require("../models/projectModel");
const User = require("../models/userModel");

const createProject = async (req, res) => {
  const { name, userId } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Project Name can't be empty");
  }
  try {
    const nameExists = await Project.findOne({ name });

    if (nameExists) {
      res.status(400);
      throw new Error("Project name already taken");
    }

    const project = await Project.create({
      name,
    });

    if (project) {
      const user = await User.findById(userId);
      if (user) {
        user.projects.push(project._id);
        await user.save();
      } else {
        res.status(404);
        throw new Error("User not found");
      }

      res.status(201).json({
        _id: project._id,
        name: project.name,
      });
    } else {
      res.status(400);
      throw new Error("Failed to Create the Project");
    }
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getProject = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const projectIds = user.projects;

    const projects = await Project.find({ _id: { $in: projectIds } });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const uploadFileToProject = async (req, res) => {
  try {
    const { name, description, projectName } = req.body;

    const project = await Project.findOne({
      name: { $regex: new RegExp(projectName, "i") },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const newFile = {
      name: name,
      description: description,
    };

    project.files.push(newFile);

    await project.save();

    return res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getFilesFromProject = async (req, res) => {
  try {
    const { projectName } = req.query;
    const project = await Project.findOne({ name: projectName });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const files = project.files;

    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { projectName, fileId } = req.body;
    const project = await Project.findOne({ name: projectName });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedFiles = project.files.filter(
      (file) => file._id.toString() !== fileId
    );
    project.files = updatedFiles;
    await project.save();

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getFile = async (req, res) => {
  try {
    const { projectName, fileId } = req.query;
    const project = await Project.findOne({ name: projectName });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const file = project.files.find((file) => file._id.toString() === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    return res.status(200).json({ file });
  } catch (error) {
    console.error("Error fetching file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editFile = async (req, res) => {
    try {
      const { projectName, fileId, fileDesc } = req.body;
  
      const project = await Project.findOne({ name: projectName });
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      const updatedFiles = project.files.map((file) => {
        if (file._id.toString() === fileId) {
          file.description = fileDesc;
        }
        return file;
      });
  
      project.files = updatedFiles;
      await project.save();
  
      return res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
      console.error("Error updating file description:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

module.exports = {
  createProject,
  getProject,
  uploadFileToProject,
  getFilesFromProject,
  deleteFile,
  getFile,
  editFile
};
