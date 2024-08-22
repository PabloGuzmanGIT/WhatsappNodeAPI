const https = require("https");
const axios = require('axios');
const fs = require("fs");
const path = require('path');

function SendMessageWhatsapp(textResponse, number){
    const data = JSON.stringify({
        
            "messaging_product": "whatsapp",    
            //"recipient_type": "individual",
            "to": number,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": textResponse
            }
    });

    const options = {
        host:"graph.facebook.com",
        path:"/v20.0/114735444913603/messages",
        method:"POST",
        body: data,
        headers:{
            "Content-Type": "application/json",
            Authorization: "Bearer EAAVvyOzXiGMBOZCJVSjyIS8EYLEQOLlJ3eZClEFynh0V7x7uVDKIW02MZCwNhFZBm7sh8ckscystSKRuWZAJiiS1qFgD4XEiZCgKmJffCsSZAxQavA18Vkz9uBfaIIllNKYTG6IC3d2fiTCyjbIWZATD4ommmrgxqAZCDsuqT3lJo6b3IkpN3r65bHAJu2CNcm3uYmeYvZAATB2rcM9bJd"
        }
    };
    const req = https.request(options, res =>{
        res.on("data", d=>{
            process.stdout.write(d);
        });
    });

    req.on("error", error =>{
        console.error(error);
    });

    req.write(data);
    req.end();
}
       
async function DownloadMedia(mediaId) {
        const url = `https://graph.facebook.com/v20.0/${mediaId}`;
        const savePath = path.resolve(__dirname,'imagedataurl');
        const token = "EAAVvyOzXiGMBOZCJVSjyIS8EYLEQOLlJ3eZClEFynh0V7x7uVDKIW02MZCwNhFZBm7sh8ckscystSKRuWZAJiiS1qFgD4XEiZCgKmJffCsSZAxQavA18Vkz9uBfaIIllNKYTG6IC3d2fiTCyjbIWZATD4ommmrgxqAZCDsuqT3lJo6b3IkpN3r65bHAJu2CNcm3uYmeYvZAATB2rcM9bJd"
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer EAAVvyOzXiGMBOZCJVSjyIS8EYLEQOLlJ3eZClEFynh0V7x7uVDKIW02MZCwNhFZBm7sh8ckscystSKRuWZAJiiS1qFgD4XEiZCgKmJffCsSZAxQavA18Vkz9uBfaIIllNKYTG6IC3d2fiTCyjbIWZATD4ommmrgxqAZCDsuqT3lJo6b3IkpN3r65bHAJu2CNcm3uYmeYvZAATB2rcM9bJd`
                },
                responseType: 'arraybuffer'  // Stream the response data directly
            });
            fs.writeFileSync(savePath, response.data);
            console.log(`Image saved successfully to ${savePath}`);

            //return savePath;
            return url.jpeg;
    
 
    
        } catch (error) {
            console.error("Error downloading media: ", error);
            return "Failed to download image";
        }
        
    }

    


module.exports = {
    SendMessageWhatsapp,
    DownloadMedia
}
