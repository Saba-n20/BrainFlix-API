// server.js
import express from 'express';
import cors from 'cors';
import route from './route/route.js'; 

const app = express();

app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' folder
app.use(express.json()); // Parse JSON bodies

app.use('/', route); // Use the defined routes

export default app;
