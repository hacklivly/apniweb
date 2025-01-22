import React, { useState } from 'react';
import './Profile.css';

function Profile() {
  const [profilePic, setProfilePic] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (!file.type.startsWith('image/')) {
        alert('Unsupported file format. Please upload an image.');
        return;
      }
      setProfilePic(reader.result);
    };
    reader.onerror = () => {
      alert('Error uploading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-container">
      <div className="profile-pic-container">
        <img src={profilePic || '/default-profile.png'} alt="Profile" />
        <input type="file" onChange={handleImageUpload} />
      </div>
      <div className="details">
        <p>Relationship: Single</p>
        <p>Height: 5'8"</p>
      </div>
    </div>
  );
}

export default Profile;
