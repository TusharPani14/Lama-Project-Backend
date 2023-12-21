const mongoose = require("mongoose");

const displaySchema = new mongoose.Schema({
  primaryColor: { type: String },
  fontColor: { type: String },
  fontSize: { type: String },
  chatHeight: { type: String },
  showSources: { type: Boolean, default: false },
});

const chatIconSchema = new mongoose.Schema({
  iconSize: { type: String },
  position: { type: String },
  distacnceFromBottom: { type: String },
  horizontalDistance: { type: String },
});

const widgetSchema = mongoose.Schema(
  {
    chatbotName: { type: String, required: true, unique: true },
    welcomeMessage: { type: String },
    inputPlaceholder: { type: String },
    displaySchema: displaySchema, 
    chatIconSchema: chatIconSchema, 
  },
  {
    timestamps: true,
  }
);

const Widget = mongoose.model("Widget", widgetSchema);

module.exports = Widget;
