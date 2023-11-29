const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // Import Nodemailer
const functions = require('firebase-functions');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/smartreport-272fa/database/smartreport-272fa-default-rtdb/data/~2F', // Replace with your Firebase database URL
});

// Configure Nodemailer with your Gmail app-specific password
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'noreply.smartreport@gmail.com', // your Gmail email
    pass: 'kuzd bbka jpba ygmg', // your Gmail app-specific password
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('Error setting up email transporter:', error);
  } else {
    console.log('Email transporter is ready to send emails');
  }
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post('/createUser', async (req, res) => {
  try {
    const { email, password, name, phoneNumber, department, role } = req.body;

    const user = await admin.auth().createUser({
      email,
      password,
    });

    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      role,
      name,
      phoneNumber,
      department,
      userId: user.uid,
    }, { merge: true });

    // Send a welcome email to the user with login credentials
    const mailOptions = {
      from: 'noreply.smartreport@gmail.com',
      to: email,
      subject: 'Welcome to SmartReport',
      text: `Dear User, welcome to SmartReport! Your account have successfully created. Your login credentials are as follows:\n\nUsername: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Could not create user' });
  }
});

///////////////////////////////////////////////////////////////////////////////
//when user submit report
app.post('/submitReport', async (req, res) => {
  try {
    const { userId, reportId, title } = req.body;

    // Fetch the user's email based on the provided userId
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const userEmail = userSnapshot.data().email;

    // Send an email to the user
    const userMailOptions = {
      from: 'noreply.smartreport@gmail.com',
      to: userEmail,
      subject: `Report Submission Confirmation - ${title}`,
      text: `Dear User, you have successfully submitted the report "${title}" (Report ID: ${reportId}).`,
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
      } else {
        console.log('Email sent to user:', info.response);
      }
    });

    // Fetch all managers and send emails to them
    const managersSnapshot = await admin.firestore().collection('users').where('role', '==', 'manager').get();
    const managerEmails = managersSnapshot.docs.map((doc) => doc.data().email);

    managerEmails.forEach((managerEmail) => {
      const managerMailOptions = {
        from: 'noreply.smartreport@gmail.com',
        to: managerEmail,
        subject: `New Maintenance Request - ${reportId}`,
        text: `New Maintenance request (Report ID: ${reportId}) received from user (UserID: ${userId}).`,
      };

      transporter.sendMail(managerMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email to manager:', error);
        } else {
          console.log('Email sent to manager:', info.response);
        }
      });
    });

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Could not submit report' });
  }
});

/////////////////////////////////////////////////////////////////////////
//Assign Agent
app.post('/assign-report', async (req, res) => {
  try {
    const { reportId, reportStatus, dateAssigned, timeAssigned, assignedAgentEmails, uEmail } = req.body;

    // Log the assigned agent email addresses
    console.log('Assigned Agent Emails:', assignedAgentEmails);

    // Send emails to assigned agents
    for (const agentEmail of assignedAgentEmails) {
      const agentMailOptions = {
        from: 'noreply.smartreport@gmail.com',
        to: agentEmail,
        subject: `New Assignment - Report ID: ${reportId}`,
        text: `You have been assigned a new report (Report ID: ${reportId}). Please check your dashboard for details.`,
      };

      // Use async/await here for email sending
      const info = await transporter.sendMail(agentMailOptions);

      // Log email sent successfully
      console.log(`Email sent to agent ${agentEmail}:`, info.response);
    }

    // Send email to the user
    const userMailOptions = {
      from: 'noreply.smartreport@gmail.com',
      to: uEmail, // Use the userEmail passed from reportAssign.js
      subject: `Report Update - Report ID: ${reportId}`,
      text: `Hi user, your report: "${reportId}" is currently attended by our agents. Please refer to your mobile app for more info.`,
    };

    // Use async/await for sending the email to the user
    const userMailInfo = await transporter.sendMail(userMailOptions);

    // Log email sent to the user
    console.log(`Email sent to user ${uEmail}:`, userMailInfo.response);

    // Respond to the client with a success message
    res.status(200).json({ message: 'Report assigned successfully' });
  } catch (error) {
    console.error('Error assigning report:', error);

    // Handle errors and respond with an appropriate error message
    res.status(500).json({ error: 'Could not assign report' });
  }
});

////////////////////////////////////
//when agent completed the report
app.post('/completed-report-agent', async (req, res) => {
  try {
    const { userId, reportId, title } = req.body;
    // Fetch all managers and send emails to them
    const managersSnapshot = await admin.firestore().collection('users').where('role', '==', 'manager').get();
    const managerEmails = managersSnapshot.docs.map((doc) => doc.data().email);

    managerEmails.forEach((managerEmail) => {
      const managerMailOptions = {
        from: 'noreply.smartreport@gmail.com',
        to: managerEmail,
        subject: `Maintenance Completed by Agent- ${reportId}`,
        text: `Maintenance request (Report ID: ${reportId}) has been completed by the agent, please check the web portal for more details.`,
      };

      transporter.sendMail(managerMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email to manager:', error);
        } else {
          console.log('Email sent to manager:', info.response);
        }
      });
    });

    res.status(200).json({ message: 'Manager successfully notified' });
  } catch (error) {
    console.error('Error notifying manager:', error);
    res.status(500).json({ error: 'Could not make notification to manager' });
  }
});

/////////////////////////////////////////////////////////////////////
//when manager comfirm completion of the report
app.post('/comfirm-completion-by-manager', async (req, res) => {
  try {
    const { userId, reportId, title } = req.body;

    // Fetch the user's email based on the provided userId
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const userEmail = userSnapshot.data().email;

    // Send an email to the user
    const userMailOptions = {
      from: 'noreply.smartreport@gmail.com',
      to: userEmail,
      subject: `Maintenance Completed - Report ID:${reportId}`,
      text: `Dear User, your report (Report ID: ${reportId}), has been completed, please check and give rating using the mobile app, thank you.`,
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
      } else {
        console.log('Email sent to user:', info.response);
      }
    });

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Could not submit report' });
  }
});
///////////////////////////////////////////////////////////////////////////////
//when user submit rating
app.post('/submitRating', async (req, res) => {
  try {
    const { userId, reportId, title } = req.body;

    // Fetch the user's email based on the provided userId
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    const userEmail = userSnapshot.data().email;

    // Send an email to the user
    const userMailOptions = {
      from: 'noreply.smartreport@gmail.com',
      to: userEmail,
      subject: `Report Rating Comfirmation - ${title}`,
      text: `Dear User, you have successfully submitted the rating for "${title}" (Report ID: ${reportId}), thank for your feedback.`,
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email to user:', error);
      } else {
        console.log('Email sent to user:', info.response);
      }
    });

    // Fetch all managers and send emails to them
    const managersSnapshot = await admin.firestore().collection('users').where('role', '==', 'manager').get();
    const managerEmails = managersSnapshot.docs.map((doc) => doc.data().email);

    managerEmails.forEach((managerEmail) => {
      const managerMailOptions = {
        from: 'noreply.smartreport@gmail.com',
        to: managerEmail,
        subject: `Report Feedback - ${reportId}`,
        text: `Report Feedback for (Report ID: ${reportId}) has been received from user (UserID: ${userId}), please check the web portal for the feedback.`,
      };

      transporter.sendMail(managerMailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email to manager:', error);
        } else {
          console.log('Email sent to manager:', info.response);
        }
      });
    });

    res.status(200).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Could not submit report' });
  }
});

////////////////////////////////////////////////////////////
// Remove User
app.post('/removeUser', async (req, res) => {
  try {
    const { uid } = req.body; // Get the user's UID from the request body

    // Step 1: Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Step 2: Delete the user's document from Firestore
    await admin.firestore().collection('users').doc(uid).delete();

    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Could not remove user' });
  }
});

app.post('/reject-report', async (req, res) => {
  try {
    const { reportId, userId } = req.body;

    // Fetch the user's email based on the provided userId from the "users" collection
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    
    // Check if the user document exists and contains the email field
    if (userSnapshot.exists) {
      const userEmail = userSnapshot.data().email;

      // Send rejection email
      console.log('Recipient email:', userEmail);

      const mailOptions = {
        from: 'noreply.smartreport@gmail.com',
        to: userEmail,
        subject: 'Report Rejection',
        text: `Dear User,\n\nWe regret to inform you that your report with ID ${reportId} has been rejected due to invalid details. If you want to resubmit a new report, please do so with valid details. Thank you.\n\nSincerely,\nSmartReport Management`,
      };

      await transporter.sendMail(mailOptions);

      console.log(`Rejected report ${reportId} and sent rejection email to ${userEmail}`);

      // Delete the document from the "report_submissions" collection
      const reportRef = admin.firestore().collection('report_submissions').doc(reportId);
      await reportRef.delete();

      console.log(`Deleted report ${reportId} from the "report_submissions" collection`);

      res.json({ success: true });
    } else {
      // Handle the case where the user document with the given userId does not exist
      console.error(`User document with userId ${userId} does not exist.`);
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error rejecting report:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



////
////////////////////////////
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






