import express from 'express';
import mongoose from 'mongoose';
import config from './config';
import paymentRoutes from './routes/paymentRoutes';
import responseRoutes from './routes/responseRoutes';
import dataStorageRoutes from './routes/dataStorageRoutes';

const app = express();

app.use(express.json());

app.use('/api', paymentRoutes);
app.use('/api', responseRoutes);
app.use('/api', dataStorageRoutes);

mongoose.connect(config.dbConnectionString, {
    user: '',
    dbName: '',
    pass: '',
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const port = config.port;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
