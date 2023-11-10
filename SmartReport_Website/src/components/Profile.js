import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestore, storage } from '../firebase';
import ImageHandler from './ImageHandler';

function Profile() {
  const { currentUser } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const usersRef = firestore.collection('users');
      const query = usersRef.where('userId', '==', currentUser.uid);

      query.get().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setUserDetails(userData);

          // Fetch and set the profile image URL
          if (userData.profileImageUrl) {
            const profileImageRef = storage.refFromURL(userData.profileImageUrl);
            profileImageRef.getDownloadURL().then((url) => {
              setProfileImage(url);
            });
          }
        } else {
          setUserDetails(null); // User not found
        }
      });
    }
  }, [currentUser]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid #333',
    margin: '10px',
  };

  const imageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1>User Profile</h1>

      {profileImage && (
        <img src={profileImage} alt="Profile" style={imageStyle} />
      )}

      {userDetails ? (
        <div>
          <p>Email: {userDetails.email}</p>
          <p>Name: {userDetails.name}</p>
          <p>Phone Number: {userDetails.phoneNumber}</p>
          <p>Department: {userDetails.department}</p>
          <p>Role: {userDetails.role}</p>
        </div>
      ) : (
        <p>User details not found</p>
      )}

      <ImageHandler userId={currentUser ? currentUser.uid : null} />
    </div>
  );
}

export default Profile;




