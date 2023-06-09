const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const Stream = require("node-rtsp-stream");
const ffmpegStatic = require("ffmpeg-static");

let stream;

app.use(express.json());

app.get("/ws-url", (req, res) => {
  res.send({ wsUrl: process.env.WS_URL || "6789" });
});

app.post("/set-rtsp", (req, res) => {
  const rtspUrl = req.body.rtspUrl;

  if (stream) {
    stream.stop();
  }

  stream = new Stream({
    name: "name",
    streamUrl: rtspUrl,
    wsPort: 6789,
    ffmpegPath: ffmpegStatic.path, // Add this line
    ffmpegOptions: {
      "-f": "mpegts",
      "-codec:v": "mpeg1video",
      "-b:v": "1000k",
      "-stats": "",
      "-r": 25,
      "-s": "640x480",
      "-bf": 0,
      "-codec:a": "mp2",
      "-ar": 44100,
      "-ac": 1,
      "-b:a": "128k",
    },
  });

  res.status(200).send("RTSP URL updated and stream started.");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
