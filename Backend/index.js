const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

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




