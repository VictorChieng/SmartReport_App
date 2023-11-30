import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';

function ImageHandler({ userId }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async () => {
    const storage = firebase.storage();
    const firestore = firebase.firestore();

    // Create an input element to trigger file selection
    const imageFileInput = document.createElement('input');
    imageFileInput.type = 'file';
    imageFileInput.accept = 'image/*';

    imageFileInput.onchange = async (event) => {
      const imageFile = event.target.files[0];


      // Implement confirmation logic 

      if (imageFile) {
        // Once confirmed, upload the image to Firebase Storage
        const storageRef = storage.ref().child(`profile_images/${userId}.jpg`);
        const uploadTask = storageRef.put(imageFile);

        uploadTask.on(
          'state_changed',
          null,
          null,
          async () => {
            // Get the URL of the uploaded image
            const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();

            // Update the user's profileImageUrl in Firestore
            firestore.collection('users').doc(userId).update({
              profileImageUrl: imageUrl,
            });
          }
        );
      }
    };

    // Trigger the file input dialog
    imageFileInput.click();
  };

  return (
    <div>
      <button onClick={handleImageUpload}>Select and Update Profile Image</button>
      {selectedImage && <img src={selectedImage} alt="Selected Image" />}
    </div>
  );
}

export default ImageHandler;
