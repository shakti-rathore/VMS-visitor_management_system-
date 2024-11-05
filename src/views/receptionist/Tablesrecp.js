import React, { useEffect, useState } from "react";
import CardTable from "components/Cards/CardTableRecep.js";

const Tablesrecp = () => {
  const [user, setUser] = useState([]);
  const [visitorsMap, setVisitorsMap] = useState(new Map());
  const [emailData, setEmailData] = useState({ email: '', emailPassword: '' });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visitorModalVisible, setVisitorModalVisible] = useState(false);
  const [visitorData, setVisitorData] = useState({
    name: '',
    contact: '',
    visitDate: '',
    reason: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Get token from localStorage

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in headers
          },
        });
        const data = await response.json();
        setUser(data);
        if (!data.email || !data.emailPassword) {
          setShowEmailModal(true);
        } else {
          fetchVisitors(); // Initial visitor data load
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch and filter active visitors (checked-out visitors removed)
  const fetchVisitors = async (query = '') => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    try {
      const response = await fetch(`http://localhost:5000/api/visitors?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
      if (response.ok) {
        const data = await response.json();
        const activeVisitors = data.filter(visitor => visitor.status !== 'checked-out');
        setVisitorsMap(new Map(activeVisitors.map(visitor => [visitor._id, visitor])));
      } else {
        alert('Error fetching visitors');
      }
    } catch (error) {
      console.error('Error fetching visitors:', error);
      alert('Error fetching visitors');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Get token from localStorage
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/updateEmail`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify(emailData),
      });
      if (response.ok) {
        alert('Email updated successfully');
        setShowEmailModal(false);
      } else {
        alert('Error updating email');
      }
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleCheckIn = async (visitorId) => {
    const visitor = visitorsMap.get(visitorId);
    if (visitor && visitor.status === 'checked-in') {
      alert('Visitor is already checked in.');
      return;
    }
    if (visitor && visitor.status === 'checked-out') {
      alert('Visitor has already checked out and cannot check in again.');
      return;
    }

    try {
      const receptionistId = localStorage.getItem('userId');
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}/checkin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
        body: JSON.stringify({ receptionistId }),
      });
      if (response.ok) {
        alert('Visitor checked in successfully');
        fetchVisitors(); // Refresh visitor list immediately
      } else {
        alert('Error checking in visitor');
      }
    } catch (error) {
      console.error('Error checking in visitor:', error);
    }
  };

  const handleCheckOut = async (visitorId) => {
    const visitor = visitorsMap.get(visitorId);
    if (visitor && visitor.status !== 'checked-in') {
      alert('Visitor cannot be checked out without checking in first.');
      return;
    }
    if (visitor && visitor.status === 'checked-out') {
      alert('Visitor has already checked out.');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Get token from localStorage
      const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}/checkout`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        },
      });
      if (response.ok) {
        alert('Visitor checked out successfully');
        fetchVisitors(); // Refresh visitor list immediately
      } else {
        alert('Error checking out visitor');
      }
    } catch (error) {
      console.error('Error checking out visitor:', error);
    }
  };

  return (
    <>
      <div className="bg-lightBlue-600 md:pt-64"></div>
      <div className="min-h-screen">
        <div className="container pr-4 pl-4 -mt-40">
          <input
            type="text"
            placeholder="Search Visitor by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded mt-5"
          />
          <button
            className="text-lightBlue-600 px-4 py-2 z-50 bg-white mb-5 ml-6 rounded-md border-2 border-blue-400"
            onClick={() => fetchVisitors(searchQuery)}
          >
            Search
          </button>

          <CardTable
            visitors={Array.from(visitorsMap.values())}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        </div>

        {/* Visitor Registration Modal */}
        {visitorModalVisible && (
          <div className="fixed rounded-md inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Register Visitor</h2>
              <form>
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
        {showEmailModal && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-8 rounded">
              <h2 className="text-xl font-bold mb-4">Please provide your email</h2>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="text"
                    value={emailData.email}
                    onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={emailData.emailPassword}
                    onChange={(e) => setEmailData({ ...emailData, emailPassword: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-1"
                    required
                  />
                </div>
                <div className="text-right">
                  <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                    Save Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Tablesrecp;
