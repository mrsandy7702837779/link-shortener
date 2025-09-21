// backend/server.js
const express = require("express");
const { nanoid } = require("nanoid");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const BASE = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

const store = {}; // temporary in-memory store

// API: shorten link
app.post("/api/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  const id = nanoid(6);
  store[id] = url;

  return res.json({ shortId: id, shortUrl: `${BASE}/${id}` });
});

// Redirect short link
app.get("/:id", (req, res) => {
  const id = req.params.id;
  const dest = store[id];
  if (!dest) return res.status(404).send("Link not found");
  res.redirect(dest);
});

app.listen(PORT, () => console.log(`🚀 Server running on ${BASE}`));
