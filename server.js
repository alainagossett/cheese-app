//Require Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

//Initalize the App
const app = express();

//Configure Settings
require('dotenv').config();

//Mount Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//Connect and Configure MongoDB
mongoose.connect(process.env.DATABASE_URL);

mongoose.connection
    .on('open', () => console.log('Connected to MongoDB'))
    .on('close', () => console.log('Disconnected from MongoDB'))
    .on('error', (error) => console.log(error));

//Define Models
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
});

const Cheese = mongoose.model("Cheese", CheeseSchema);

//Define Routes
//test route
app.get('/', (req, res) => {
    res.send("hello world");
})

//CHEESE INDEX ROUTE
app.get('/cheeses', async(req, res) => {
    try {
        res.send(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
});

//CHEESE CREATE ROUTE
app.post('/cheeses', async(req, res) => {
    try {
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
});

//Tell the app to listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on port: ${PORT}`))