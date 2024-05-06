const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const aunten = require('./auth/aunten');

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function connectToDB() {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log('Connected to MongoDB');
}

connectToDB().catch(console.error);

app.use('/api/signup', require('./routes/signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/user',aunten, require('./routes/user'));
app.use('/api/todos',aunten,  require('./routes/todos'));
app.use('/api/refresh-token', require('./routes/refreshToken'));
app.use('/api/signout', require('./routes/signout'));
app.use('/api/mqtt_manager', require('./routes/mqtt_manager'));


app.get('/', (req, res) => {
    res.send('Hello World!');
    });

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    });



