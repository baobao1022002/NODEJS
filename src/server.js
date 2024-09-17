import express from "express";
import connectDB from "./config/connectdb";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import cors from "cors";

require("dotenv").config();

let app = express();

// app.use(cors({ origin: true }));
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 6969;
app.listen(port, () => {
  console.log("backend nodejs is running in port :" + port);
});
