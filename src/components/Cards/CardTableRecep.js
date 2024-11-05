import { DataGrid } from '@mui/x-data-grid';

const CustomDateCell = ({ visitDate }) => {
  const formattedDate = new Date(visitDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return <span>{formattedDate}</span>;
};

const CardTableRecep = ({ visitors, onCheckIn, onCheckOut }) => {
  const rows = visitors.map(visitor => ({
    id: visitor._id, // Use the correct ID
    name: visitor.name,
    contact: visitor.contact,
    hostName: visitor.hostName,
    visitDate: visitor.visitDate,
    reason: visitor.reason,
  })).filter(row => row.visitDate); // Filter out any visitors without a visitDate

  const columns = [
    { field: 'name', headerName: 'Name', width: 150, filterable: true },
    { field: 'contact', headerName: 'Contact', width: 150, filterable: true },
    { field: 'hostName', headerName: 'For', width: 150, filterable: true },
    {
      field: 'visitDateTime',
      headerName: 'Visit Date & Time',
      width: 250,
      filterable: true,
      valueGetter: (params) => params?.row?.visitDate || null, // Safely access visitDate
      renderCell: (params) => (
        <CustomDateCell visitDate={params.row.visitDate} />
      ),
    },
    { field: 'reason', headerName: 'Reason', width: 200, filterable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const visitorId = params.row?.id; // Safely access the id
        return (
          <>
            {visitorId && (
              <>
                <button
                  onClick={() => {
                    if (visitorId) {
                      onCheckIn(visitorId); // Only call if id is defined
                    }
                  }}
                  className="bg-lightBlue-500 text-white px-2 py-1 rounded mr-1"
                >
                  Check In
                </button>
                <button
                  onClick={() => {
                    if (visitorId) {
                      onCheckOut(visitorId); // Only call if id is defined
                    }
                  }}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Check Out
                </button>
              </>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="h-screen w-full bg-white">
      {rows.length > 0 ? ( // Only render the DataGrid if there are rows
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          className="text-sm"
          autoHeight
        />
      ) : (
        <div className="text-center p-4">No visitors available.</div> // Message when there are no visitors
      )}
    </div>
  );
};

export default CardTableRecep;
