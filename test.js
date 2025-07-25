require('dotenv').config();
const mongoose = require('./config/database'); // assuming your db connect logic is exported from here

const User = require('./lib/models/User');
const Claim = require('./lib/models/Claim');

const test = async () => {
  try {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      role: "beneficiary",
      aadhaar: "123456789012",
      verified: false
    });

    const claim = await Claim.create({
      userId: user._id,
      disasterType: 'Flood',
      amount: 5000,
      status: 'Pending',
      documents: ['doc1.pdf', 'doc2.pdf'],
      location: 'Chennai',
    });

    console.log("User and claim saved successfully");
    console.log({ user, claim });
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

test();
