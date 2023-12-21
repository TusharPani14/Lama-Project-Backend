const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const Widget = require("../models/widgetModal");
const { S3Client, GetObjectCommand ,PutObjectCommand} = require("@aws-sdk/client-s3");
const axios = require("axios");

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

async function getObjectUrl(key) {
  const command = new GetObjectCommand({
    Bucket: "lama-bucket",
    Key: key,
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

async function putObjectUrl(filename, contentType) {
  const command = new PutObjectCommand({
    Bucket: "lama-bucket",
    Key: `uploads/icons/${filename}`,
    ContentType: contentType
  });
  const url = await getSignedUrl(s3Client, command);
  return url;
}

const saveGeneralWidget = async (req, res) => {
  const { chatbotName, welcomeMessage, inputPlaceholder } = req.body;
  if (!chatbotName) {
    return res.status(400).json({ error: "Chatbot name cannot be empty" });
  }

  try {
    const widget = await Widget.create({
      chatbotName: chatbotName,
      welcomeMessage: welcomeMessage,
      inputPlaceholder: inputPlaceholder,
    });

    res
      .status(200)
      .json({ message: "Widget details saved successfully", data: widget });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving widget details", message: error.message });
  }
};

const saveDisplayWidget = async (req, res) => {
  const {
    widgetId,
    primaryColor,
    fontColor,
    fontSize,
    chatHeight,
    showSources,
  } = req.body;

  try {
    const widget = await Widget.findById(widgetId);

    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    widget.displaySchema = {
      primaryColor,
      fontColor,
      fontSize,
      chatHeight,
      showSources,
    };

    await widget.save();

    return res.status(200).json({
      message: "Display Widget details saved successfully",
      data: widget,
    });
  } catch (error) {
    console.error("Error saving display widget details:", error);
    return res
      .status(500)
      .json({ message: "Error saving display widget details" });
  }
};

const saveChatIconDetails = async (req, res) => {
  const {
    widgetId,
    iconSize,
    position,
    distanceFromBottom,
    horizontalDistance,
  } = req.body;

  const uploadedFile = req.file;

  try {
    const widget = await Widget.findById(widgetId);

    if (!widget) {
      return res.status(404).json({ message: "Widget not found" });
    }

    const filename = uploadedFile.originalname; 
    const contentType = uploadedFile.mimetype; 

    const uploadUrl = await putObjectUrl(filename, contentType);

    const putResponse = await axios.put(uploadUrl, uploadedFile.buffer, {
      headers: {
        'Content-Type': uploadedFile.mimetype,
      },
    });

    if (putResponse.status !== 200) {
      throw new Error('Failed to upload the file to S3');
    }

    const finalUrl = await getObjectUrl(`uploads/icons/${filename}`);

    widget.chatIconSchema = {
      iconSize,
      position,
      distanceFromBottom,
      horizontalDistance,
    };

    await widget.save();

    return res.status(200).json({
      message: "Chat Icon details saved successfully",
      data: { widget, finalUrl },
    });
  } catch (error) {
    console.error("Error saving Chat Icon details:", error);
    return res.status(500).json({ message: "Error saving Chat Icon details" });
  }
};

module.exports = { saveGeneralWidget, saveDisplayWidget, saveChatIconDetails };
