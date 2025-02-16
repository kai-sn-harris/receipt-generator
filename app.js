require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const api = require("./api");

const app = express();
const PORT = process.env.PORT || 3000;

function connect(url) {
    mongoose.connect(url)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(e => {
            console.error(e);
        });
}

connect("mongodb://127.0.0.1:27017/receipt-generator");

app.use(express.json());
app.use("/api", api);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));