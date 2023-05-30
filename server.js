const express = require("express");
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if it exists

const Stream = require("node-rtsp-stream");

let stream;

// This is needed to parse the body of POST requests
app.use(express.json());

app.get("/ws-url", (req, res) => {
  res.send({ wsUrl: process.env.WS_URL || "localhost:9999" });
});

app.post("/set-rtsp", (req, res) => {
  const rtspUrl = req.body.rtspUrl;

  // Check if a stream is already running and stop it if it is
  if (stream) {
    stream.stop();
  }

  // Start a new stream with the new URL
  stream = new Stream({
    name: "name",
    streamUrl: rtspUrl,
    wsPort: 9999,
    ffmpegOptions: {
      "-stats": "",
      "-r": 30,
    },
  });

  res.status(200).send("RTSP URL updated and stream started.");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
