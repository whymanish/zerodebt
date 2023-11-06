const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://Manish026636:manish1728@cluster0.fotxcbf.mongodb.net/debt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema for collection records
const collectionRecordSchema = new mongoose.Schema({
  date: String,
  amount: Number,
});

const CollectionRecord = mongoose.model('CollectionRecord', collectionRecordSchema);

app.use(cors()); // Allow requests from any origin (for development purposes)

// Body parser middleware
app.use(bodyParser.json());

// API endpoint to add today's collection
app.post('/api/add-collection', async (req, res) => {
  const { date, amount } = req.body;

  try {
    // Create a new collection record and save it to the database
    const newRecord = new CollectionRecord({ date, amount });
    await newRecord.save();

    // Respond with a success message
    res.status(200).send('Collection added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while saving the collection record' });
  }
});

// API endpoint to retrieve summary data
app.get('/api/summary', async (req, res) => {
  try {
    // Implement logic to calculate total debt, total collection, and today's collection
    const totalDebt = 250000;

    // Calculate the total collection for all dates
    const totalCollection = await CollectionRecord.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).exec();

    const totalCollectionValue = totalCollection.length > 0 ? totalCollection[0].total : 0;

    // Calculate the total collection for today's date
    const today = new Date(); // Get today's date
    const todayCollection = await CollectionRecord.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
            $lte: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59),
          },
        },
      },
      { $group: { _id: null, today: { $sum: '$amount' } }
    }]).exec();

    const todayCollectionValue = todayCollection.length > 0 ? todayCollection[0].today : 0;

    res.json({ totalDebt, totalCollection: totalCollectionValue, todayCollection: todayCollectionValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving summary data' });
  }
});

// API endpoint to retrieve collection records
app.get('/api/collection-records', async (req, res) => {
  try {
    // Retrieve all collection records from the database
    const records = await CollectionRecord.find().exec();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving collection records' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
