const mongoose = require('mongoose');
const connectDB = require('./config/database'); // adjust if different path
const Claim = require('./models/Claim');

const runTest = async () => {
  await connectDB();

  const testClaim = new Claim({
    userId: new mongoose.Types.ObjectId(), // Replace with actual user ID if available
    disasterType: 'Flood',
    amount: 50000,
    status: 'Pending',
    documents: ['https://example.com/doc1.pdf', 'https://example.com/photo.jpg'],
    location: 'Chennai, Tamil Nadu',
    reviewNotes: 'Initial submission by user'
  });

  try {
    const savedClaim = await testClaim.save();
    console.log('✅ Claim saved successfully:', savedClaim);
  } catch (error) {
    console.error('❌ Error saving claim:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

runTest();
