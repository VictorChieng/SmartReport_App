import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { firestore } from 'firebase';
import axios from "axios";

function UserDetails() {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({});
    const history = useHistory();

    async function fetchUserDetailsFromFirestore() {
        const userRef = firestore().collection("users").doc(userId);

        try {
            const doc = await userRef.get();
            if (doc.exists) {
                const data = doc.data();
                setUserDetails(data);
                setUpdatedDetails(data);
            } else {
                // Handle the case where the user with the given ID doesn't exist
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            // Handle the error appropriately
        }
    }

    useEffect(() => {
        fetchUserDetailsFromFirestore();
    }, [userId]);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setUpdatedDetails(userDetails);
    };

    const handleSaveEdit = async () => {
        try {
            const userRef = firestore().collection("users").doc(userId);
            await userRef.update(updatedDetails);
            setUserDetails(updatedDetails);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user details:', error);
            // Handle the error appropriately
        }
    };

    const handleRemoveUser = () => {
        const confirmRemove = window.confirm('Are you sure you want to remove this user?');

        if (confirmRemove) {
            // First, remove the user document from Firestore
            const userRef = firestore().collection("users").doc(userId);

            userRef
                .delete()
                .then(() => {
                    const confirmSuccess = window.confirm('User removed successfully. Click OK to go back.');
                    if (confirmSuccess) {
                        history.goBack();
                    }
                })
                .catch((error) => {
                    const confirmError = window.confirm('Error removing user. Click OK to dismiss.');
                    // You can choose to handle the error in different ways or navigate back if desired
                });

            // Next, send a request to your server to perform any additional actions (e.g., cleanup) if needed
            axios.post('http://localhost:3001/removeUser', {
                uid: userId,
            })
            .then((response) => {
                if (response.status === 200) {
                    const confirmSuccess = window.confirm('User removed successfully from the server. Click OK to go back.');
                    if (confirmSuccess) {
                        history.goBack();
                    }
                } else {
                    const confirmError = window.confirm('Error removing user from the server. Click OK to dismiss.');
                    // You can choose to handle the error in different ways or navigate back if desired
                }
            })
            .catch((error) => {
                const confirmError = window.confirm('Error sending request to the server. Click OK to dismiss.');
                // You can choose to handle the error in different ways or navigate back if desired
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUpdatedDetails({
            ...updatedDetails,
            [name]: value,
        });
    };

    return (
        <div>
            <h1>User Details</h1>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
                    <p>User ID: {userDetails.userId}</p>
                    <p>Name: {userDetails.name}</p>
                    <p>Email: {userDetails.email}</p>
                    <p>Phone Number: {userDetails.phoneNumber}</p>
                    <p>Department: {userDetails.department}</p>
                    <p>Role: {userDetails.role}</p>
                    {!editMode && (
                        <button onClick={handleEditClick}>Edit</button>
                    )}
                    {!editMode && (
                        <button onClick={handleRemoveUser}>Remove User</button>
                    )}
                </div>

                <div style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid black', margin: '5px', backgroundColor: '#BFBAF0', height: '680px' }}>
                    {editMode && (
                        <div>
                            <p>
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={updatedDetails.name}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </p>
                            <p>
                                <label>Email:</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={updatedDetails.email}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </p>
                            <p>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={updatedDetails.phoneNumber}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </p>
                            <p>
                                <label>Department:</label>
                                <input
                                    type="text"
                                    name="department"
                                    value={updatedDetails.department}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </p>
                            <p>
                                <label>Role:</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={updatedDetails.role}
                                    onChange={handleInputChange}
                                    style={{ width: '100%' }}
                                />
                            </p>
                            <p>
                                <button onClick={handleSaveEdit}>Save</button>
                                <button onClick={handleCancelEdit}>Cancel</button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserDetails;
