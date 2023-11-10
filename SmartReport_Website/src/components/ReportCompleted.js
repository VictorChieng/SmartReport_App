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



function ReportCompleted() {
    const [commentContent, setCommentContent] = useState('<p>Start adding comments here...</p>');
    const [feedbackContent, setFeedbackContent] = useState('<p>Provide feedback here...</p>');
    const { reportId } = useParams(); // Get the reportId from the URL parameter
    const [reportDetails, setReportDetails] = useState({});
    const [imageUrls, setImageUrls] = useState([]);
    const [comments, setComments] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [suggestedAgents, setSuggestedAgents] = useState([]);

    // Function to fetch report details based on reportId
    async function fetchReportDetailsFromFirestore() {
        const docRef = firestore().collection("report_submissions").doc(reportId);

        try {
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                setReportDetails(data); // Set the fetched report details into the state
                setImageUrls(data.imageUrls || []); // Set the image URLs into the state (default to an empty array)
            } else {
                // Handle the case where the report with the given ID doesn't exist
            }
        } catch (error) {
            console.error('Error fetching report details:', error);
            // Handle the error appropriately
        }
    }

    useEffect(() => {
        fetchReportDetailsFromFirestore(); // Fetch report details when the component mounts
        fetchCommentsFromFirestore(); // Fetch comments when the component mounts
        fetchSelectedAgents(); // Fetch assigned agents when the component mounts
    }, [reportId]); // Add reportId as a dependency to re-fetch when it changes

    useEffect(() => {
        // Fetch users with the "agent" role from Firebase
        const usersRef = firestore().collection('users');
        const agentQuery = usersRef.where('role', '==', 'agent');
        agentQuery.get()
            .then(querySnapshot => {
                const agents = [];
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    agents.push({
                        id: doc.id, // Firestore document ID
                        userId: data.userId, // Extract the userId from the Firestore document
                        name: data.name, // Agent name
                    });
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

    // Function to handle saving comments
    // Function to handle saving comments
    const handleSaveComment = async () => {
        try {
            const commentText = commentContent.replace(/<\/?[^>]+(>|$)/g, '');
            const timestamp = firebase.firestore.Timestamp.now();

            // Update Firestore document with the new comment using merge: true
            await firestore()
                .collection("report_submissions")
                .doc(reportId)
                .set(
                    {
                        comments: firestore.FieldValue.arrayUnion({
                            content: commentContent,
                            timestamp: timestamp, // Save the Firestore Timestamp object
                        }),
                    },
                    { merge: true }
                );

            setComments((prevComments) => [
                ...prevComments,
                { content: commentText, timestamp: timestamp }, // Use the Firestore Timestamp object
            ]);

            // Clear the comment input
            setCommentContent('<p>Start adding comments here...</p>');
        } catch (error) {
            console.error('Error saving comment:', error);
            // Handle the error appropriately
        }
    }

    const handleAddAgent = async (agent) => {
        // Add the agent to the selectedAgents state
        const updatedSelectedAgents = [...selectedAgents, agent];
        setSelectedAgents(updatedSelectedAgents);
        setSearchInput('');

        try {
            // Fetch the user ID for the selected agent
            const usersRef = firestore().collection('users');
            const userQuery = usersRef.where('name', '==', agent.name);

            const userSnapshot = await userQuery.get();
            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                const userId = userData.userId; // Assuming there is a field called "userId"

                // Update the Firestore document with the selected agent names and user ID in the agentAssign field using merge: true
                await firestore()
                    .collection("report_submissions")
                    .doc(reportId)
                    .set(
                        {
                            agentAssign: firestore.FieldValue.arrayUnion({
                                name: agent.name,
                                userId: userId,
                            }),
                        },
                        { merge: true }
                    );
            }
        } catch (error) {
            console.error('Error updating agentAssign:', error);
            // Handle the error appropriately
        }
    }


    const handleSaveFeedback = async () => {
        try {
            const feedbackText = feedbackContent.replace(/<\/?[^>]+(>|$)/g, '');

            // Update Firestore document with the new feedback using merge: true
            await firestore()
                .collection("report_submissions")
                .doc(reportId)
                .set(
                    {
                        feedback: firestore.FieldValue.arrayUnion({
                            content: feedbackContent,
                            timestamp: new Date(),
                        }),
                    },
                    { merge: true }
                );

            // Clear the feedback input
            setFeedbackContent('<p>Provide feedback here...</p>');
        } catch (error) {
            console.error('Error saving feedback:', error);
            // Handle the error appropriately
        }
    }


    const [feedback, setFeedback] = useState([]);

    async function fetchFeedbackFromFirestore() {
        try {
            const docRef = firestore().collection("report_submissions").doc(reportId);
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                const existingFeedback = data.feedback || [];
                setFeedback(existingFeedback);
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
            // Handle the error appropriately
        }
    }

    useEffect(() => {
        // Fetch feedback when the component mounts
        fetchFeedbackFromFirestore();
    }, [reportId]);



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
            // Reference to the Firestore document
            const docRef = firestore().collection("report_submissions").doc(reportId);

            // Get the current report document
            const doc = await docRef.get();

            if (doc.exists) {
                // Get the current agentAssign array from the document data
                const currentAgentAssign = doc.data().agentAssign || [];

                // Find the index of the agent with the matching userId in the array
                const agentIndex = currentAgentAssign.findIndex(agent => agent.userId === userId);

                if (agentIndex !== -1) {
                    // Remove the agent from the array by creating a new array without the agent
                    const updatedAgentAssign = [
                        ...currentAgentAssign.slice(0, agentIndex),
                        ...currentAgentAssign.slice(agentIndex + 1),
                    ];

                    // Update the Firestore document with the modified agentAssign array
                    await docRef.update({ agentAssign: updatedAgentAssign });

                    // Update the local state if needed
                    setSelectedAgents(updatedAgentAssign);
                } else {
                    // Handle the case where the agent with the given userId is not found
                    console.error('Agent not found in agentAssign array');
                }
            } else {
                // Handle the case where the document does not exist
                console.error('Report document does not exist');
            }
        } catch (error) {
            console.error('Error removing agent:', error);
            // Handle the error appropriately
        }
    }

    async function handleComplete() {
        try {
            // Reference to the Firestore document
            const docRef = firestore().collection("report_submissions").doc(reportId);
            // Get the document snapshot
            const docSnapshot = await docRef.get();
            // Check if the document exists
            if (docSnapshot.exists) {
                // Extract the "userId" field from the document data
                const userId = docSnapshot.data().userId;
                // Get the current date and time
                const currentDateTime = new Date();
                const currentDate = currentDateTime.toISOString().split('T')[0]; // Extract date (YYYY-MM-DD)
                const currentTime = currentDateTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                });
    
                // Update the Firestore document with the reportStatus, Date Assigned, and Time Assigned fields
                await docRef.set(
                    {
                        reportStatus: "Completed",
                        dateCompleted: currentDate,
                        timeCompleted: currentTime,
                    },
                    { merge: true }
                );
    
                // Prepare the data to send
                const dataToSend = {
                    reportId,
                    userId,  // Add the userId to the data
                    // Add other data properties as needed
                };
                // Send the data to the server
                await axios.post('http://localhost:3001/comfirm-completion-by-manager', dataToSend);

                confirmAlert({
                    title: 'Success',
                    message: 'Successfully confirm and notified the User about completion.',
                    buttons: [
                      {
                        label: 'OK',
                        onClick: () => {
                          // Navigate the user back to http://localhost:3000/AgentDashboard
                          window.location.href = 'http://localhost:3000/ManagerDashboard';
                        },
                      },
                    ],
                  });
            } else {
                console.error(`Document with ID ${reportId} does not exist.`);
            }
        } catch (error) {
            console.error('Error assigning report to "Completed by agent":', error);
            // Handle the error appropriately
        }
    }
    
    function stripHtmlTags(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    const filteredSuggestedAgents = suggestedAgents.filter(agent => agent.name.toLowerCase().includes(searchInput.toLowerCase()));

    return (
        <div>
            <h1>Task Completed by Agent (Manager Report) </h1> {/* Add the header here */}

            <div style={{ display: 'flex' }}>
                {/* Left Section for Report Data */}
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
                        {/* Display other report details here */}
                    </div>
                </div>

                {/* Center Section for Displaying Images */}
                <div style={{ flex: 1, padding: '10px', borderRadius: '10px', overflow: 'auto', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
                    <h2>Images</h2>
                    <Carousel >
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


                {/* Right Section for Adding Comments and Assigning Agents */}
                <div style={{ flex: 1, padding: '10px', overflow: 'auto', borderRadius: '10px', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
                    {/* <h2>Add Instruction to agent</h2>
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
                    </button> */}
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
                        <h2>Agent Feedback</h2>
                        <div style={{ border: '2px solid black', padding: '5px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: 'white', height: '150px' }}>
                            {feedback.map((feedbackItem, index) => (
                                <div key={index} style={{ marginBottom: '10px', wordWrap: 'break-word', borderBottom: '1px solid #ccc' }}>
                                    <div>
                                        {stripHtmlTags(feedbackItem.content)}
                                    </div>
                                    <p style={{ color: 'blue' }}>Timestamp: {feedbackItem.timestamp.toDate().toLocaleString()}</p>
                                </div>

                                // <div key={index} style={{ marginBottom: '10px', wordWrap: 'break-word', borderBottom: '1px solid #ccc' }}>
                                // <p>{stripHtmlTags(feedbackItem.content)}</p>
                                // </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <button onClick={handleComplete} style={{
                                borderRadius: '10px',
                                padding: '10px 20px',
                                backgroundColor: '#FF705A',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}>
                                Confirm Completion
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>

        </div>
    );


}

export default ReportCompleted;




