const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { rmSync, readdirSync } = require("fs");
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const YD = new YoutubeMp3Downloader({
  ffmpegPath: "/usr/local/bin/ffmpeg", // FFmpeg binary location
  outputPath: __dirname + "/mp3", // Output file location (default: the home directory)
  youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
  queueParallelism: 2, // Download parallelism (default: 1)
  progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
  allowWebm: false, // Enable download from WebM sources (default: false)
});

const port = process.env.PORT;

console.log("App is running at Port " + port);
app.listen(port, "localhost");

app.get("/yt/mp3/:id", (req, res) => {
  const videoId = req.params.id;

  const fileName = videoId + ".mp3";
  console.log("filename", fileName);
  console.log("video id", videoId);
  YD.download(videoId, fileName);
  YD.on("finished", function (err, data) {
    const fs = require("fs");
    const file = fs.readFileSync(__dirname + "/mp3/" + fileName);
    console.log("file", file);
    res.download(__dirname + "/mp3/" + fileName);
  });
});
