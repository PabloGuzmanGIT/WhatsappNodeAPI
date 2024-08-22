const fs = require("fs");
const console = require('console');
const myConsole = new console.Console(fs.createWriteStream("./log.txt"));
const whatsappService = require("../services/whatsappservice");
const {DownloadMedia} = require("../services/whatsappservice");



const VerifyToken = (req, res) => {

   try{
        var accesstoken = "SAW45439H350JEFRJ423E21EG";
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];

        if(challenge != null && token != null && token === accesstoken){
            return res.send(challenge);
        }else{
            return res.status(400).send("Forbidden");
            
        }
    }catch(e){
        return res.status(400).send("Error processing request");
    }
   
};

const ReceivedMessage = async (req, res) => {

    try{
        var entry = (req.body["entry"])[0];

        var changes = (entry["changes"])[0];

        var value = changes["value"];

        var messagesObject = value["messages"]



        if(typeof messagesObject !== "undefined"){
            var messages = messagesObject[0];
            var number = messages["from"];
            var text = GetTextUser(messages);
            var messageContent = await GetMessageContent(messages);
            
            myConsole.log(messageContent);
            whatsappService.SendMessageWhatsapp("hola " + text,number);
            //line above modified to see sender name or number on message
        }
        res.send(200);
        myConsole.log("Everything will be fine");
    }catch(e){
        myConsole.log(e);
        res.send("Error caught: ");

    }};

async function GetMessageContent(messages) {
    var content = "";
    var typeMessage = messages["type"];

    if (typeMessage === "text") {
        content = messages["text"]["body"];
    } else if (typeMessage === "interactive") {
        var interactiveObject = messages["interactive"];
        var typeInteractive = interactiveObject["type"];

        if (typeInteractive === "button_reply") {
            content = interactiveObject["button_reply"]["title"];
        } else if (typeInteractive === "list_reply") {
            content = interactiveObject["list_reply"]["title"];
        } else {
            myConsole.log("Unexpected interactive type: " + typeInteractive);
        }
    } else if (typeMessage === "image") {
        var mediaId = messages["image"]["id"];
        var mimeType = messages["image"]["mime_type"];
        var imageUrl = await DownloadMedia(mediaId);
        //let url = imageUrl.url.replace(/\\/g,"");
        //content = "Received an image: " + imageUrl;
        //content = "Received an image-ID: " + mediaId;
        content = `https://graph.facebook.com/v20.0/${mediaId}/`;
        console.log(content)
        myConsole.log(content);
        
    } else {
        myConsole.log("Unexpected message type 1: " + typeMessage + `${mediaId}`);
    }
    
    return content;
};

function GetTextUser(messages){
    var text  = "";
    var typeMessage = messages["type"];
    if(typeMessage == "text"){
        text = (messages["text"])["body"];
    

    }else if(typeMessage == "interactive"){
        var interactiveObject = messages["interactive"];
        var typeInteractive = interactiveObject["type"];
        
        if(typeInteractive == "button_reply"){
            text =(interactiveObject["button_reply"])["title"];               
        }
        else if (typeInteractive == "list_reply"){
            text =(interactiveObject["list_reply"])["title"];  
        }
        else{
            myConsole.log("Unexpected interactive type 2: " + typeInteractive);
        }

    }else{
        myConsole.log("User send an " + typeMessage);

    }
    return text;
};

module.exports = {
    VerifyToken,
    ReceivedMessage
};