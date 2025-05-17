import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/router", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const options = {
    //key: fs.readFileSync("C:/Certificados-SSL/asterisk.key"),
   // cert: fs.readFileSync("C:/Certificados-SSL/asterisk.crt"),
    key: fs.readFileSync("C:/Users/ismae/Desktop/certificates/privkey.pem"),
    cert: fs.readFileSync("C:/Users/ismae/Desktop/certificates/fullchain.pem")
};

https.createServer(options, app).listen(4205, '0.0.0.0', () => {
    console.log("Servidor https rodando na porta https://localhost:4205");
});
