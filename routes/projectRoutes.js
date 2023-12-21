const express = require("express");
const {
  createProject,
  getProject,
  uploadFileToProject,
  getFilesFromProject,
  deleteFile,
  getFile,
  editFile,
} = require("../controller/projectController");
const router = express.Router();

router.post("/create", createProject);
router.get("/get", getProject);
router.post("/uploadFile", uploadFileToProject);
router.get("/getFile", getFilesFromProject);
router.post("/deleteFile", deleteFile);
router.get("/getSingleFile", getFile);
router.put("/editFile", editFile);

module.exports = router;
