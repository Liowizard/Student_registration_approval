import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import "./app.css"

function App() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://student-registration-backend-yk25kmkzeq-el.a.run.app/DataForApproval');
      setLoading(false); // Set loading to false when data is fetched
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setUserData(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Router>
      {loading ? ( // Render loader if loading is true
        <div><div className="loader"></div></div>
      ) : (
        <Routes>
          <Route path="/" element={<HomePage userData={userData} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
