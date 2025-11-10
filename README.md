Serverless Email & SMS Notification App

This project is a serverless web application that provides a simple contact form. Based on the user's input, it sends a notification via SMS (if a phone number is provided) or email (if no phone number is present).

This was built as a sessional project for a Cloud Computing subject.

Live Project Link: http://my-serverless-notification-form-2025.s3-website.ap-south-1.amazonaws.com/

Features

Static Frontend: A clean and simple contact form built with HTML, CSS, and vanilla JavaScript.

Serverless Backend: The entire backend logic is handled by a single AWS Lambda function.

Conditional Notifications:

SMS: If the user includes a phone number, the app uses the Twilio API to send an SMS notification.

Email: If the phone number field is blank, the app uses AWS SES (Simple Email Service) to send an email notification.

API-Driven: The frontend communicates with the backend via an AWS API Gateway REST endpoint.

Real-time User Feedback: The form provides asynchronous status updates ("Sending...", "Message sent successfully!", "Error...") without a page reload.

How It Works

User: A user visits the static website hosted on AWS S3 and fills out the index.html form.

Frontend (script.js): When the "Send" button is clicked, the JavaScript captures the form data, prevents the default form submission, and creates a JSON payload.

API Gateway: The script sends this JSON payload as a POST request to the project's AWS API Gateway endpoint.

AWS Lambda (index.mjs): The API Gateway triggers the Lambda function, passing the JSON payload to it.

Backend Logic:

The Lambda function parses the incoming data.

It checks if the phone field has a value.

If phone exists: The function uses the Twilio client (configured with environment variables) to send an SMS to the provided number.

If phone is empty: The function uses the AWS SES client to send a formatted HTML email to a pre-configured recipient.

Response: The Lambda function returns a JSON response with a 200 status code for success or a 500 status code for an error.

User Feedback: The frontend script.js receives this response. It then updates the <p id="status-message"> element on the page to inform the user of the result.

Tech Stack

Frontend

HTML5

CSS3

JavaScript (ES6+): Used for form handling and the fetch API.

Backend & Cloud Services

AWS S3: For static website hosting of the frontend files (index.html, style.css, script.js).

AWS API Gateway: To create a public-facing REST API endpoint that triggers the Lambda function.

AWS Lambda: To run the serverless backend logic (Node.js runtime, using index.mjs).

AWS SES (Simple Email Service): For sending email notifications.

Twilio API: For sending SMS notifications.

Configuration & Deployment

To run this project yourself, you would need to configure the following components:

1. Backend (AWS Lambda)

Create a new Lambda function (Node.js runtime).

Upload the code from index.mjs and your node_modules (or create a Lambda Layer) containing the twilio and @aws-sdk/client-ses packages.

Set the following Environment Variables in your Lambda function's configuration:

TWILIO_ACCOUNT_SID: Your Account SID from the Twilio console.

TWILIO_AUTH_TOKEN: Your Auth Token from the Twilio console.

TWILIO_PHONE_NUMBER: Your registered Twilio phone number.

Update the SENDER_EMAIL and RECIPIENT_EMAIL constants in index.mjs to your desired email addresses. You must verify these email addresses in the AWS SES console.

Ensure the Lambda function's IAM Role has permissions to send email (e.g., ses:SendEmail).

2. API Gateway

Create a new REST API in AWS API Gateway.

Create a new resource (e.g., /send) with a POST method.

Integrate this POST method to trigger your AWS Lambda function.

Enable CORS on the resource to allow your S3 website to make cross-origin requests.

Deploy the API to a stage (e.g., prod). This will generate your Invoke URL.

3. Frontend (AWS S3)

Open script.js and replace the placeholder API_ENDPOINT_URL with your own Invoke URL from API Gateway.

// ★ Paste your API Gateway Invoke URL here
const API_ENDPOINT_URL = 'https://YOUR_API_ID.execute-api.YOUR_[REGION.amazonaws.com/prod/send](https://REGION.amazonaws.com/prod/send)';


Create an S3 bucket and enable static website hosting.

Upload index.html, style.css, and your modified script.js to the bucket.

Ensure the bucket has a public-read policy to allow users to access the website.
