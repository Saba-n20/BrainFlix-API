import express from 'express';
import cors from 'cors';
import route from './route/route.js'; 

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/', route);
export default app;