
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Öffentliche Spieldateien
app.use(express.static(path.join(__dirname, "public")));

// Status-API
app.get("/api/status", (req, res) => {
    res.json({
        name: "CUBE WARS",
        status: "online",
        version: "1.0.0",
        engine: "Three.js",
        graphics: "Low Poly",
        camera: "Third Person"
    });
});

// Startseite
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
app.listen(PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("       CUBE WARS SERVER");
    console.log("--------------------------------");
    console.log(`Server läuft auf Port ${PORT}`);
    console.log(`Lokal: http://localhost:${PORT}`);
});
