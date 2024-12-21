import express from "express";
import WebTorrent from "webtorrent";
import cors from "cors";
import ffmpeg from "fluent-ffmpeg";
import { PassThrough } from "stream";

const app = express();
app.use(cors());
app.use(express.json());

const client = new WebTorrent();
const torrentCache = new Map(); // 缓存已添加的 torrent

const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const imageStream = file.createReadStream();
    const chunks = [];
    imageStream.on("data", (chunk) => chunks.push(chunk));
    imageStream.on("end", () => {
      const base64Image = Buffer.concat(chunks).toString("base64");
      resolve({
        name: file.name,
        size: file.length,
        type: file.name.split(".").pop()?.toLowerCase() || "unknown",
        screenshot: `data:image/${file.name.split(".").pop()?.toLowerCase()};base64,${base64Image}`,
      });
    });
    imageStream.on("error", reject);
  });
};

const processVideoFile = (file) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const fileStream = file.createReadStream();

    fileStream.on("data", (chunk) => chunks.push(chunk));
    fileStream.on("end", () => {
      const buffer = Buffer.concat(chunks);

      if (buffer.length === 0) {
        return reject(new Error("File buffer is empty."));
      }

      const bufferStream = new PassThrough();
      bufferStream.end(buffer);

      const screenshots = [];
      console.log("Processing video file:", file.name, buffer.length);

      // 配置 FFmpeg
      const ffmpegCommand = ffmpeg(bufferStream)
        .inputFormat("mp4") // 明确使用 mp4 格式
        .outputOptions(["-vf", "thumbnail", "-frames:v 5", "-vsync", "vfr"])
        .outputFormat("image2pipe")
        .on("start", (cmd) => console.log("FFmpeg command:", cmd))
        .on("error", (err) => {
          console.error("FFmpeg error:", err.message);
          reject(err);
        })
        .on("end", () => {
          console.log("FFmpeg processing finished.");
          resolve({
            name: file.name,
            size: file.length,
            type: "mp4", // 假定格式为 mp4
            screenshots,
          });
        });

      // 管道输出流
      const outputStream = ffmpegCommand.pipe(new PassThrough(), { end: true });

      outputStream.on("data", (chunk) => {
        const base64Image = `data:image/jpeg;base64,${chunk.toString("base64")}`;
        screenshots.push(base64Image);
      });

      outputStream.on("error", (err) => {
        console.error("Output stream error:", err.message);
        reject(err);
      });
    });

    fileStream.on("error", (err) => {
      console.error("File stream error:", err.message);
      reject(err);
    });
  });
};

const processFile = (file) => {
  const fileType = file.name.split(".").pop()?.toLowerCase() || "unknown";
  if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
    return processImageFile(file);
  } else if (["mp4", "mkv", "avi"].includes(fileType)) {
    return processVideoFile(file);
  } else {
    return Promise.resolve({
      name: file.name,
      size: file.length,
      type: fileType,
      screenshot: null,
    });
  }
};

app.post("/api/query-magnet", (req, res) => {
  const { magnetLink } = req.body;

  if (!magnetLink) {
    return res.status(400).json({ error: "Magnet link is required" });
  }

  if (torrentCache.has(magnetLink)) {
    return res.status(200).json({ files: torrentCache.get(magnetLink) });
  }

  client.add(magnetLink, async (torrent) => {
    try {
      const filesWithScreenshots = await Promise.all(
        torrent.files.map(processFile)
      );
      torrentCache.set(magnetLink, filesWithScreenshots);
      res.status(200).json({ files: filesWithScreenshots });
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).json({ error: "Failed to process files" });
    }
  });

  client.on("error", (error) => {
    console.error("Error adding torrent:", error);
    res.status(500).json({ error: "Failed to parse magnet link" });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
