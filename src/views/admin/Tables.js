import React, { useState, useEffect } from "react";
import CardTable from "components/Cards/CardTable.js";

export default function Tables() {
  const [visitors, setVisitors] = useState([]);
  const [visitorModalVisible, setVisitorModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [visitorData, setVisitorData] = useState({
    name: '',
    contact: '',
    visitDate: '',
    reason: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!localStorage.getItem('role')) {
      window.location.href = 'https://iotcom.io/';
    }

    // Fetch visits for the logged-in host
    loadVisits(userId);

    // Check if the logged-in host has an email
    checkForEmail(userId);
  }, []);

  const loadVisits = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/visitors?hostId=${userId}`);
      const visitsData = await response.json();
      console.log(visitsData);  
      setVisitors(visitsData);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const checkForEmail = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      const user = await response.json();
      if (!user.email || !user.emailPassword) {
        setEmailModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    const hostId = localStorage.getItem('userId');
    try {
      const response = await fetch('http://localhost:5000/api/visitorss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...visitorData, hostId }),
      });
      if (response.ok) {
        alert('Visitor successfully registered');
        setVisitorModalVisible(false);
        setVisitorData({ name: '', contact: '', visitDate: '', reason: '' });
        loadVisits(hostId); // Refresh visit list
      } else {
        alert('Error registering visitor');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className=" bg-lightBlue-600 md:pt-64     ">
        
      </div>
      {/* Debugging modal visibility */}
      {console.log("Visitor Modal Visible State:", visitorModalVisible)}

      {/* Button to trigger the visitor registration modal */}
     

      <div className="flex flex-wrap -mt-36 ">
        <div className="w-full  px-4 ">
           <button
  className=" text-lightBlue-600 px-4 py-2 z-50 bg-white mb-5  rounded-md border-2 border-blue-400"
  onClick={() => {
    console.log("Button clicked!");
    setVisitorModalVisible(true);
  }}
>
  Register New Visitor
</button>
          <CardTable visitors={visitors} />
        </div>
      </div>

      {/* Visitor Registration Modal */}
      {visitorModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Register Visitor</h2>
            <form onSubmit={handleVisitorSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={visitorData.name}
                  onChange={(e) => setVisitorData({ ...visitorData, name: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact</label>
                <input
                  type="text"
                  value={visitorData.contact}
                  onChange={(e) => setVisitorData({ ...visitorData, contact: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Visit Date</label>
                <input
                  type="datetime-local"
                  value={visitorData.visitDate}
                  onChange={(e) => setVisitorData({ ...visitorData, visitDate: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Reason</label>
                <input
                  type="text"
                  value={visitorData.reason}
                  onChange={(e) => setVisitorData({ ...visitorData, reason: e.target.value })}
                  className="border rounded px-2 py-1 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setVisitorModalVisible(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalVisible && (
        <div className="modal">
          {/* Email Modal Content */}
        </div>
      )}
    </>
  );
}
