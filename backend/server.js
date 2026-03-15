import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'node:http';
import connectDB from './config/connectToDatabase.js';
import { authRoutes } from './routes/auth.routes.js';
import { codeRoutes } from './routes/code.routes.js';
import { roomRoutes } from './routes/room.routes.js';
import { initSocket } from './socket/socketIO.js';

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);

app.use(express.json());

// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "https://i-tproject-nine.vercel.app"
//   ],
//   methods: ["GET","POST","PUT","DELETE"],
//   credentials: true
// };

// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));





const allowedOrigins = [
  "http://localhost:5173",
  "https://i-tproject-nine.vercel.app"
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"]
};

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/code', codeRoutes);

initSocket(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is Running on the PORT ${PORT}`);
})