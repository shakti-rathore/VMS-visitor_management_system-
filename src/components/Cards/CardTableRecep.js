import React from 'react';

const CardTableRecep = ({ visitors, onCheckIn, onCheckOut }) => {
  console.log(visitors)
  return (
    <div className="overflow-x-auto rounded-md">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Contact</th>
            <th className="py-2">For</th>
            <th className="py-2">Visit Date</th>
            <th className="py-2">Reason</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor._id}>
              <td className="border px-4 py-2">{visitor.name}</td>
              <td className="border px-4 py-2">{visitor.contact}</td>
              <td className="border px-4 py-2">{visitor.hostName}</td>
              <td className="border px-4 py-2">{visitor.visitDate}</td>
              <td className="border px-4 py-2">{visitor.reason}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onCheckIn(visitor._id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                >
                  Check In
                </button>
                <button
                  onClick={() => onCheckOut(visitor._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Check Out
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTableRecep;
