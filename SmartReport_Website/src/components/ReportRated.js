import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from 'firebase'; // Make sure to import Firebase correctly
import 'quill/dist/quill.snow.css'; // Import Quill styles
import ReactQuill from 'react-quill'; // Import React-Quill
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from 'react-responsive-carousel'; // Import Carousel from react-responsive-carousel
import firebase from 'firebase'; // Import Firebase correctly


function ReportRated() {
    const { reportId } = useParams(); // Get the reportId from the URL parameter
    const [reportDetails, setReportDetails] = useState({});
    const [imageUrls, setImageUrls] = useState([]);
    const [comments, setComments] = useState([]);
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


    function stripHtmlTags(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }


    return (
        <div>
            <h1>Task Completed by Agent (Manager Report) </h1> {/* Add the header here */}

            <div style={{ display: 'flex' }}>
                {/* Left Section for Report Data */}
                <div style={{ flex: 1, padding: '10px', borderRadius: '10px', overflow: 'auto',  border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
                    <h2>Report Details</h2>
                    <div>
                        <p>Report ID: {reportDetails.reportId}</p>
                        <p>Decription: {reportDetails.desc}</p>
                        <p>Title: {reportDetails.title}</p>
                        <p>Category: {reportDetails.category}</p>
                        <p>Location: {reportDetails.location}</p>
                        <p>Status: {reportDetails.reportStatus}</p>
                        <p>Report Rating: {reportDetails.Rating}</p>
                        <p>Report Feedback: {reportDetails.serviceFeedback}</p>
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

                    <div >
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

                            ))}
                        </div>

                    </div>
                    
                </div>
            </div>

        </div>
    );


}

export default ReportRated;




