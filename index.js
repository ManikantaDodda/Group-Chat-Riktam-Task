import express from 'express';
import routes from "./route/routes.js";
import connectDB from "./helper/dbConnection.js";
import { createServer } from 'http';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cors from "cors";

dotenv.config();
const port = process.env.PORT
const app = express();
const corsOptions = {
    origin:  "*",
    methods: ["GET", "POST"],
};
app.use(cors());

app.use(express.json());

connectDB();

app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

app.use("/", routes);
const httpServer = createServer(app);
httpServer.listen(port, () => console.log(`Server Connected to port ${port}`))
