import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage({ userData, setUserData }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  const removeUser = (userId) => {
    setUserData(userData.filter(user => user._id !== userId));
  };

  return (
    <div className="container">
      <div className="home-page">
        <h1 className="page-heading">Pending Users</h1>
        {userData && userData.length > 0 ? (
          <div className="user-grid">
            {userData.map((user) => (
              <div
                key={user._id}
                className="user-box"
                onClick={() => handleUserClick(user)}
              >
                <div className="user-info">
                  <h2>
                    {user.name.first} {user.name.middle} {user.name.last}
                  </h2>
                  <p>Email: {user.email}</p>
                  <p>User ID: {user.user_id}</p>
                </div>
                <div className="captured-photo">
                  {user.captured_images.map((image, index) => (
                    <div key={index} className="image-container">
                      <img
                        src={image}
                        alt={`Captured Image ${index + 1}`}
                        className="captured-image"
                        style={{
                          maxWidth: "150px",
                          height: "auto",
                          borderRadius: "5px",
                          marginTop: "15px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No pending users</div>
        )}
        {selectedUser && (
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={handleClosePopup}>
                &times;
              </span>
              <FullPageUserDetails user={selectedUser} removeUser={removeUser} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FullPageUserDetails({ user, removeUser }) {
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);

  const handleAccept = (email) => {
    const data = {
      email: email,
      Approval_Status: "Approved"
    };

    // Send accept request to API
    fetch('http://192.168.1.7:8080/DataApprovalResult', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Remove user from UI
        removeUser(user._id);
      } else {
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleReject = (email) => {
    if (showReasonInput && reason.trim() === '') {
      alert('Please provide a reason.');
      return;
    }

    const data = {
      email: email,
      Approval_Status: "Rejected",
      Reason: reason
    };

    // Send reject request to API
    fetch('http://192.168.1.7:8080/DataApprovalResult', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        // Remove user from UI
        removeUser(user._id);
      } else {
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const handleSendReason = () => {
    setShowReasonInput(false);
    // Now call handleReject function
    handleReject(user.email);
  };

  return (
    <div className="full-page-details">
      <h2>{user.name.first} {user.name.middle} {user.name.last}</h2>
      <p>Email: {user.email}</p>
      <p>Gender: {user.gender}</p>
      <p>Mobile: {user.mobile}</p>
      <p>User ID: {user.user_id}</p>
      {/* Render additional fields as needed */}
      {user && (
        <div>
          <h3>Biometric</h3>
          <div className="captured-images">
            <div className="image-container">
              {user.captured_images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Captured Image ${index + 1}`}
                  className="captured-image"
                  style={{ maxWidth: "200px", height: "auto", borderRadius: '5px', marginRight: '40px', transition: 'transform 0.3s ease' }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.5)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              ))}
            </div>
            {user.file && (
              <div className="image-container">
                <img
                  src={user.file}
                  alt="Uploaded"
                  style={{ maxWidth: "200px", height: "auto", borderRadius: '5px', transition: 'transform 0.3s ease' }} // Adjust size as needed
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.5)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div className="decision-buttons">
        <button onClick={() => handleAccept(user.email)} className="accept-btn">Accept</button>
        <button onClick={() => setShowReasonInput(true)} className="reject-btn">Reject</button>
        {showReasonInput && (
          <div className="reason-input">
            <input type="text" value={reason} onChange={handleChange} placeholder="Enter reason" />
            <button onClick={handleSendReason}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
