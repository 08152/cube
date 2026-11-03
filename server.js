
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

// Hauptadresse
app.get("/", (req, res) => {
    res.send("CUBE WARS SERVER ONLINE");
});

// Echter Status-Endpunkt
app.get("/health", (req, res) => {
    res.status(200).json({
        online: true,
        game: "CUBE WARS",
        status: "ready"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("CUBE WARS SERVER gestartet auf Port " + PORT);
});
