import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  visitDate: { type: Date, required: true },
  reason: { type: String, required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to the host (User)
  hostName: { type: String, required: true }, // Store the host's username (employee's name)
  status: { type: String, default: 'pending' }, // To track check-in/check-out status
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
});

 const Visitor = mongoose.model('Visitor',visitorSchema);
export default Visitor;