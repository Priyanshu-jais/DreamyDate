const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors());
app.use(express.json());

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/uploads", express.static(__dirname + "/uploads"));

require("./config/DB/database").connect();

const authRoutes = require("./routes/auth");
const profile = require("./routes/profile");
const location = require("./routes/location");

// Setting up routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profile);
app.use("/api/v1/locations", location);

// Testing the server
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
