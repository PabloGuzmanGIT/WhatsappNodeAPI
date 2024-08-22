const express = require("express");
const router = express.Router();
const WhatsAppController = require("../controllers/whatsappControlles")

router.get("/", WhatsAppController.VerifyToken).post("/",WhatsAppController.ReceivedMessage)

module.exports = router;
