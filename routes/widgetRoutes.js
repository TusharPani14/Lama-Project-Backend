const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  saveGeneralWidget,
  saveDisplayWidget,
  saveChatIconDetails,
} = require("../controller/widgetController");
const router = express.Router();

router.post("/generalWidget", saveGeneralWidget);
router.post("/displayWidget", saveDisplayWidget);
router.post("/chatIcon", upload.single("file"), saveChatIconDetails);

module.exports = router;
