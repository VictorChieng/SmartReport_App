

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from 'firebase'; // Make sure to import Firebase correctly
import 'quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Import React-Quill
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel'; // Import Carousel from react-responsive-carousel
import firebase from 'firebase'; // Import Firebase correctly
import axios from "axios"; // Import Axios
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useHistory } from 'react-router-dom';



function ReportAssign() {
  const [commentContent, setCommentContent] = useState('<p>Start adding comments here...</p>');
  const { reportId } = useParams(); // Get the reportId from the URL parameter
  const [reportDetails, setReportDetails] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [suggestedAgents, setSuggestedAgents] = useState([]);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [updatedSelectedAgents, setUpdatedSelectedAgents] = useState([]); // Add this line
  const history = useHistory();



  async function fetchUserIdForReport(reportId) {
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);
      const doc = await docRef.get();

      if (doc.exists) {
        const data = doc.data();
        setUserId(data.userId); // Set the userId into the state
      } else {
        // Handle the case where the report with the given ID doesn't exist
      }
    } catch (error) {
      console.error('Error fetching userId:', error);
      // Handle the error appropriately
    }
  }

  async function fetchUserEmailByUserId(userId) {
    try {
      console.log("Fetching user with userId:", userId);

      const usersRef = firestore().collection('users');
      const userQuery = usersRef.where('userId', '==', userId);
      const userSnapshot = await userQuery.get();

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const userEmail = userData.email;

        // Set the user's email into the state
        setUserEmail(userEmail);
        console.log('User email fetched:', userEmail);
      } else {
        console.error('User not found with the provided userId:', userId);
        // Handle the case where the user with the given userId is not found
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      // Handle the error appropriately, e.g., show a message to the user
    }
  }


  async function fetchReportDetailsFromFirestore() {
    const docRef = firestore().collection("report_submissions").doc(reportId);

    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        setReportDetails(data);
        setImageUrls(data.imageUrls || []);
      } else {
        // Handle the case where the report with the given ID doesn't exist
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      // Handle the error appropriately
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchUserIdForReport(reportId);
        await fetchUserEmailByUserId(userId);
        await fetchCommentsFromFirestore(); // Fetch comments when the component mounts
        await fetchReportDetailsFromFirestore();
        // Fetch other data if needed
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error appropriately
      }
    }

    fetchData();
  }, [reportId, userId]);

  useEffect(() => {
    const usersRef = firestore().collection('users');
    const agentQuery = usersRef.where('role', '==', 'agent');
    agentQuery.get()
      .then(querySnapshot => {
        const agents = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const agentInfo = {
            id: doc.id,
            userId: data.userId,
            name: data.name,
            agentemail: data.email,
            agentPhone: data.phoneNumber,
          };


          agents.push(agentInfo);
        });
        setSuggestedAgents(agents);
      })
      .catch(error => {
        console.error('Error fetching agents:', error);
        // Handle the error appropriately
      });
  }, []);

  async function fetchCommentsFromFirestore() {
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        const existingComments = data.comments || [];
        setComments(existingComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Handle the error appropriately
    }
  }

  const handleSaveComment = async () => {
    try {
      const commentText = commentContent.replace(/<\/?[^>]+(>|$)/g, '');
      const timestamp = firebase.firestore.Timestamp.now();

      await firestore()
        .collection("report_submissions")
        .doc(reportId)
        .set(
          {
            comments: firestore.FieldValue.arrayUnion({
              content: commentContent,
              timestamp: timestamp,
            }),
          },
          { merge: true }
        );

      setComments((prevComments) => [
        ...prevComments,
        { content: commentText, timestamp: timestamp },
      ]);

      setCommentContent('<p>Start adding comments here...</p>');
    } catch (error) {
      console.error('Error saving comment:', error);
      // Handle the error appropriately
    }
  }

  const handleAddAgent = async (agent) => {
    const updatedSelectedAgents = [...selectedAgents, agent];
    console.log('Updated Selected Agents:', updatedSelectedAgents); // Log the updated agents

    setSelectedAgents(updatedSelectedAgents);
    setSearchInput('');

    try {
      const usersRef = firestore().collection('users');
      const userQuery = usersRef.where('name', '==', agent.name);

      const userSnapshot = await userQuery.get();
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const userId = userData.userId;

        await firestore()
          .collection("report_submissions")
          .doc(reportId)
          .set(
            {
              agentAssign: firestore.FieldValue.arrayUnion({
                name: agent.name,
                userId: userId,
                agentemail: agent.agentemail,
                agentPhone: agent.agentPhone// Adding the agent's email
              }),
            },
            { merge: true }
          );
      }
    } catch (error) {
      console.error('Error updating agentAssign:', error);
      // Handle the error appropriately
    }
    window.location.reload();

  }

  async function fetchSelectedAgents() {
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        const assignedAgents = data.agentAssign || [];
        setSelectedAgents(assignedAgents);
      }
    } catch (error) {
      console.error('Error fetching assigned agents:', error);
      // Handle the error appropriately
    }
  }

  async function handleRemoveAgent(userId) {
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);

      const doc = await docRef.get();

      if (doc.exists) {
        const currentAgentAssign = doc.data().agentAssign || [];
        const agentIndex = currentAgentAssign.findIndex(agent => agent.userId === userId);

        if (agentIndex !== -1) {
          const updatedAgentAssign = [
            ...currentAgentAssign.slice(0, agentIndex),
            ...currentAgentAssign.slice(agentIndex + 1),
          ];

          await docRef.update({ agentAssign: updatedAgentAssign });
          setSelectedAgents(updatedAgentAssign);
        } else {
          console.error('Agent not found in agentAssign array');
        }
      } else {
        console.error('Report document does not exist');
      }
    } catch (error) {
      console.error('Error removing agent:', error);
      // Handle the error appropriately
    }
    window.location.reload();

  }

  async function handleAssignInProgress() {
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        if (data) {
          const currentDateTime = new Date();
          const currentDate = currentDateTime.toISOString().split('T')[0];
          const currentTime = currentDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });

          // Extract agentAssign data from the document
          const agentAssign = data.agentAssign || [];

          // Extract agent emails from the agentAssign data
          const assignedAgentEmails = agentAssign.map(agent => agent.agentemail);

          const uEmail = userEmail;

          await docRef.set(
            {
              reportStatus: "In Progress",
              dateAssigned: currentDate,
              timeAssigned: currentTime,
            },
            { merge: true }
          );
          // Prepare the data to send to the server
          const dataToSend = {
            reportId,
            assignedAgentEmails, // Use the extracted email addresses
            uEmail,
            // Add other data properties as needed
          };
          await docRef.set(dataToSend, { merge: true });
          const response = await axios.post('http://localhost:3001/assign-report', dataToSend);
          console.log('Assignment response:', response.data);
          confirmAlert({
            title: 'Success',
            message: 'Report successfully assigned.',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                  // Navigate the user back to http://localhost:3000/ManagerDashboard
                  window.location.href = 'http://localhost:3000/ManagerDashboard';
                },
              },
            ],
          });
        } else {
          console.error('Invalid data in Firestore document. userEmail is missing.');
        }
      } else {
        console.error('Report document with ID', reportId, 'does not exist.');
      }
    } catch (error) {
      console.error('Error assigning report to "In Progress":', error);
      // Handle the error appropriately
    }
  }

  function stripHtmlTags(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }



  async function handleRejectRequest() {
  
    try {
      const docRef = firestore().collection("report_submissions").doc(reportId);
      const doc = await docRef.get();
  
      if (doc.exists) {
        const data = doc.data();
  
        if (data) {
          // Prompt a confirmation dialog
          confirmAlert({
            title: 'Confirm Reject',
            message: 'Are you sure you want to reject this request?',
            buttons: [
              {
                label: 'Yes',
                onClick: async () => {
                  try {
                    // Prepare data to send to the server
                    const dataToSend = {
                      reportId,
                      userId,
                    };
  
                    // Make a POST request to an external server
                    const response = await axios.post('http://localhost:3001/reject-report', dataToSend);
                    console.log('Rejection response:', response.data);
  
                    // Display a success message or perform additional actions if needed
  
                    // Navigate back to http://localhost:3000/ReportManagement
                    history.push('/ReportManagement');
                  } catch (postError) {
                    console.error('Error sending POST request:', postError);
                    // Handle the error appropriately, such as showing an error message to the user
                  }
                },
              },
              {
                label: 'No',
                onClick: () => {
                  // Handle the case where the user chooses not to reject
                },
              },
            ],
          });
        } else {
          console.error('Invalid data in Firestore document. userEmail is missing.');
        }
      } else {
        console.error('Report document with ID', reportId, 'does not exist.');
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
      // Handle the error appropriately
    }
  }
  const filteredSuggestedAgents = suggestedAgents.filter(agent => agent.name.toLowerCase().includes(searchInput.toLowerCase()));

  return (
    <div>
      <h1>Manager's Report Pending View</h1>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
          <h2>Report Details</h2>
          <div>
            <p>Report ID: {reportDetails.reportId}</p>
            <p>Decription: {reportDetails.desc}</p>
            <p>Title: {reportDetails.title}</p>
            <p>Category: {reportDetails.category}</p>
            <p>Location: {reportDetails.location}</p>
            <p>Status: {reportDetails.reportStatus}</p>
            <p>Agent Assigned:</p>
            <div style={{ border: '2px solid black', padding: '5px', overflow: 'auto', backgroundColor: 'white' }}>
              {reportDetails.agentAssign && reportDetails.agentAssign.map((agent, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p>{agent.name} (Agent ID: {agent.userId})</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '10px', borderRadius: '10px', overflow: 'auto', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
          <h2>Images</h2>
          <Carousel>
            {imageUrls.map((imageUrl, index) => (
              <div key={index}>
                <img
                  src={imageUrl}
                  alt={`Image ${index}`}
                  style={{ maxWidth: '100%' }}
                />
              </div>
            ))}
          </Carousel>

        </div>
        <div style={{ flex: 1, padding: '10px', overflow: 'auto', borderRadius: '10px', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
          <h2>Add Instruction to agent</h2>
          <ReactQuill
            style={{ backgroundColor: 'white', border: '2px solid black' }}
            value={commentContent}
            onChange={(value) => setCommentContent(value)}
            onFocus={() => {
              if (commentContent === '<p>Start adding comments here...</p>') {
                setCommentContent('<p></p>'); // Clear text on focus
              }
            }}
            onBlur={() => {
              if (commentContent === '<p></p>' || commentContent === '<p><br></p>') {
                setCommentContent('<p>Start adding comments here...</p>'); // Restore text on blur if content is empty
              }
            }}
          />
          <button
            onClick={handleSaveComment}
            style={{
              borderRadius: '10px',
              padding: '10px 20px',
              backgroundColor: '#FF705A',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Save Instruction
          </button>
          <div style={{ marginTop: '10px' }}>
            <h2>Instruction Display</h2>
            <div style={{ border: '2px solid black', padding: '5px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'white', height: '150px' }}>
              {comments.map((comment, index) => (
                <div key={index} style={{ marginBottom: '10px', wordWrap: 'break-word', borderBottom: '1px solid #ccc' }}>
                  <div>
                    {stripHtmlTags(comment.content)}
                  </div>
                  <p style={{ color: 'blue' }}>Timestamp: {comment.timestamp.toDate().toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Assign Agent</h2>
            <input
              type="text"
              placeholder="Search for an agent"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <ul>
                {filteredSuggestedAgents.map(agent => (
                  <li key={agent.id}>
                    {agent.name} ({agent.userId})
                    <button onClick={() => handleAddAgent(agent)}>Add</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Assigned Agent</h2>
            <div style={{ border: '2px solid black', padding: '5px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'white', height: '150px' }}>
              {reportDetails.agentAssign && reportDetails.agentAssign.map((agent, index) => (
                <div key={index} style={{ marginBottom: '10px', wordWrap: 'break-word', borderBottom: '1px solid #ccc' }}>
                  <p>{agent.name} (Agent ID: {agent.userId})</p>
                  <button onClick={() => handleRemoveAgent(agent.userId)}>Remove</button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAssignInProgress}
            style={{
              borderRadius: '10px',
              padding: '10px 20px',
              backgroundColor: '#00A896',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Assign Report to In Progress
          </button>

          <button
            onClick={handleRejectRequest}
            style={{
              borderRadius: '10px',
              padding: '10px 20px',
              backgroundColor: '#FF0000',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              marginTop: '20px',
              marginRight: '10px', // Add margin for spacing
            }}
          >
            Reject Request
          </button>
        </div>
      </div>
    </div>
  );
}



export default ReportAssign;



