// Import AWS SDK (for SES) and Twilio
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import twilio from "twilio";

// --- Initialize Clients ---
// 1. SES (Email) Client
const REGION = "ap-south-1";
const sesClient = new SESClient({ region: REGION });

// 2. Twilio (SMS) Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

// --- Main Handler ---
export const handler = async (event) => {
  console.log("--- START: New Invocation ---");
  console.log("Received event.body string:", event.body); 

  let body;
  try {
    body = JSON.parse(event.body);
    console.log("Parsed event.body object:", body); 
  } catch (e) {
    console.error("Error parsing JSON:", e);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid JSON format." }),
    };
  }
  
  // Extract all form data
  const { name, email, message, phone } = body;
  
  console.log(`Extracted phone variable. Type: ${typeof phone}, Value: ${phone}`); 

  // --- Logic: Check if a phone number was provided ---
  if (phone) {
    console.log("Phone number exists, attempting to send SMS."); 
    try {
      const smsParams = {
        body: `New form submission from ${name} (${email}): ${message}`,
        from: twilioNumber,
        to: phone,
      };
      
      console.log("DEBUG: Params being sent to Twilio:", smsParams); // <-- NEW LOG

      const smsResponse = await twilioClient.messages.create(smsParams);
      console.log("SMS sent! Message ID:", smsResponse.sid);
      
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "SMS sent successfully!" }),
      };

    } catch (err) {
      console.error("--- ERROR SENDING SMS ---", err); // <-- NEW LOG
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Error sending SMS." }),
      };
    }

  } else {
    // ---- SEND EMAIL VIA SES ----
    console.log("No phone number, attempting to send Email."); // <-- NEW LOG
    
  const SENDER_EMAIL = "sanjay2patil9@gmail.com";
  const RECIPIENT_EMAIL = "meena98patil@gmail.com";

    const emailParams = {
      Destination: { ToAddresses: [RECIPIENT_EMAIL] },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<h3>New Contact Form Submission</h3>
                   <p><strong>Name:</strong> ${name}</p>
                   <p><strong>Email:</strong> ${email}</p>
                   <p><strong>Message:</strong></p>
                   <p>${message}</p>`,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "New Notification from your Website!",
        },
      },
      Source: SENDER_EMAIL,
    };

    try {
      await sesClient.send(new SendEmailCommand(emailParams));
      console.log("Email sent!");
      
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Email sent successfully!" }),
      };
    } catch (err) {
      console.error("--- ERROR SENDING EMAIL ---", err);
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Error sending email." }),
      };
    }
  }
};