import React, { useState } from 'react';
import './Profile.css';

function Profile() {
  const [profilePic, setProfilePic] = useState(null);
  const [username, setUsername] = useState('JohnDoe123');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [coins, setCoins] = useState(250);
  const [editing, setEditing] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-card">
        <div className="profile-image">
          <img src={profilePic || 'https://via.placeholder.com/150'} alt="Profile" />
          <input type="file" onChange={handleImageUpload} />
        </div>
        <div className="profile-details">
          {editing ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
              />
              <button onClick={() => setEditing(false)}>Save</button>
            </>
          ) : (
            <>
              <h2>{username}</h2>
              <p>Email: {email}</p>
              <p>Phone: {phone}</p>
              <p>Coins: {coins}</p>
              <button onClick={() => setEditing(true)}>Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
