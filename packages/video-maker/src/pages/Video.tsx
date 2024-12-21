import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { ArrayBufferTarget, Muxer } from 'webm-muxer';
import styles from './video.module.scss';
import Upload from '@components/Upload';

const VideoPage: React.FC = () => {
  const [ffmpegVideoUrl, setFfmpegVideoUrl] = useState<string | null>(null);
  const [webcodecsVideoUrl, setWebcodecsVideoUrl] = useState<string | null>(
    null
  );
  const [progress, setProgress] = useState<number>(0);
  const [isFfmpegLoaded, setIsFfmpegLoaded] = useState<boolean>(false);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    loadFFmpeg();
  }, []);

  const loadFFmpeg = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
    const ffmpeg = ffmpegRef.current;

    ffmpeg.on('log', ({ type, message }) => {
      console.log(`[FFmpeg ${type}]: ${message}`);
    });

    ffmpeg.on('progress', ({ progress, time }) => {
      console.log(`[FFmpeg progress]: ${progress}% (${time} seconds)`);
    });

    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          'text/javascript'
        ),
      });
      setIsFfmpegLoaded(true);
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
    }
  };

  const handleFFmpegUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isFfmpegLoaded) {
      console.error('FFmpeg is not loaded yet.');
      return;
    }

    const files = Array.from(event.target.files || []);
    await convertImagesToVideoWithFFmpeg(files);
  };

  const handleWebCodecsUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    await convertImagesToVideoWithWebCodecs(files);
  };

  const adjustDimensions = (width: number, height: number) => {
    if (width % 2 !== 0) width -= 1;
    if (height % 2 !== 0) height -= 1;
    return { width, height };
  };

  const convertImagesToVideoWithFFmpeg = async (images: File[]) => {
    const ffmpeg = ffmpegRef.current;

    // 清理虚拟文件系统
    try {
      ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      console.warn('output.mp4 not found in FS, proceeding.');
    }

    const uniqueId = Date.now();
    const processedImages = await processImagesWithWebGPU(images);

    for (let i = 0; i < processedImages.length; i++) {
      const fileName = `image${uniqueId}_${i}.png`;
      try {
        const fileData = await fetchFile(processedImages[i]);
        await ffmpeg.writeFile(fileName, fileData);
        console.log(`File ${fileName} written successfully.`);
      } catch (error) {
        console.error(`Failed to write file ${fileName}:`, error);
        return;
      }
    }

    try {
      //   const { width, height } = adjustDimensions(640, 480); // Adjust dimensions if needed
      const result = await ffmpeg.exec([
        '-framerate',
        '1',
        '-i',
        `image${uniqueId}_%d.png`,
        '-vf',
        'scale=trunc(iw/2)*2:trunc(ih/2)*2', // 强制输入图像的宽高为偶数
        '-c:v',
        'libx264',
        '-r',
        '30', // 增加帧速率
        '-pix_fmt',
        'yuv420p',
        'output.mp4',
      ]);

      if (result !== 0) {
        console.error('Failed to execute FFmpeg command:', result);
        throw new Error('Failed to execute FFmpeg command.');
      }

      console.log('FFmpeg command executed successfully.');
    } catch (error) {
      console.error('Failed to execute FFmpeg command:', error);
      return;
    }

    let fileData;
    try {
      fileData = await ffmpeg.readFile('output.mp4');
      console.log('Output file read successfully.');
    } catch (error) {
      console.error('Failed to read output file:', error);
      return;
    }

    const data = new Uint8Array(fileData as ArrayBuffer);
    setFfmpegVideoUrl(
      URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
    );
  };

  const convertImagesToVideoWithWebCodecs = async (images: File[]) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;

    try {
      // 使用图像的实际宽高进行编码器配置
      const firstImage = new Image();
      firstImage.src = URL.createObjectURL(images[0]);
      await firstImage.decode();
      const { width, height } = adjustDimensions(
        Math.floor(firstImage.width / 2) * 2,
        Math.floor(firstImage.height / 2) * 2
      );

      console.log('Canvas dimensions:', { width, height });

      canvas.width = width;
      canvas.height = height;

      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'V_VP9',
          width: width,
          height: height,
          frameRate: 1000 / 1e6 / 30,
          alpha: true,
        },
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, metadata) => {
          console.log('Encoded chunk:', chunk, metadata);
          muxer.addVideoChunk(chunk, metadata);
        },
        error: (e) => console.error('VideoEncoder error:', e),
      });

      videoEncoder.configure({
        codec: 'vp09.00.10.08', // 使用 AVC Level 4.0 (或更高)
        width,
        height,
        bitrate: 5_000_000,
        framerate: 30,
        latencyMode: 'realtime',
        bitrateMode: 'constant',
      });

      for (const [index, image] of images.entries()) {
        const img = new Image();
        img.src = URL.createObjectURL(image);
        await img.decode();

        context.clearRect(0, 0, width, height);
        context.drawImage(img, 0, 0, width, height);

        const videoFrame = new VideoFrame(canvas, {
          timestamp: index * (1e6 / 30),
          displayWidth: width, // 设置 displayWidth
          displayHeight: height, // 设置 displayHeight
          duration: 1e6 / 30, // 设置每帧的时长
        });
        console.log('Encoding frame:', index);

        console.log('VideoFrame details:', {
          timestamp: videoFrame.timestamp,
          duration: videoFrame.duration,
          codedWidth: videoFrame.codedWidth,
          codedHeight: videoFrame.codedHeight,
          displayWidth: videoFrame.displayWidth,
          displayHeight: videoFrame.displayHeight,
          format: videoFrame.format,
        });

        videoEncoder.encode(videoFrame, { keyFrame: true });
        videoFrame.close();

        setProgress(((index + 1) / images.length) * 100);
      }

      await videoEncoder.flush();
      muxer.finalize();

      console.log('Video encoding completed. Number of chunks:', videoEncoder);

      const blob = new Blob([muxer.target.buffer], {
        type: 'video/webm',
      });

      console.log('MIME Type:', blob.type, blob.size);
      setWebcodecsVideoUrl(URL.createObjectURL(blob));

      console.log('Video URL created:', URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error during WebCodecs video creation:', error);
    }
  };

  const processImagesWithWebGPU = async (images: File[]) => {
    setProgress(0);
    const processedImages = images.map((image, index) => {
      setProgress(((index + 1) / images.length) * 100);
      return image;
    });
    return processedImages;
  };

  return (
    <div className={styles.container}>
      <header>
        <h2>Create Video</h2>
        <p>Upload your images and audio to create a video.</p>
      </header>
      <div>
        <div>
          <div>
            <h3>Images</h3>
            <input type="file" accept="image/*" multiple />

            <Upload
              accept="image/*"
              showInfo
              triggerType="button"
              displayType="thumbnail"
            />
          </div>
        </div>
        <div>
          <h3>Audio</h3>
          <input type="file" accept="audio/*" />
        </div>
      </div>
      <div className={styles.processor}>
        <h2 className={styles.title}>FFmpeg Image to Video</h2>
        <button
          onClick={() => document.getElementById('ffmpeg-upload')?.click()}
          className={styles.uploadButton}
        >
          Upload Images for FFmpeg
        </button>
        <input
          id="ffmpeg-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFFmpegUpload}
          className={styles.fileInput}
        />
        {ffmpegVideoUrl && (
          <div className={styles.videoContainer}>
            <video
              controls
              src={ffmpegVideoUrl}
              className={styles.video}
            ></video>
          </div>
        )}
      </div>
      <div className={styles.processor}>
        <h2 className={styles.title}>WebCodecs Image to Video</h2>
        <button
          onClick={() => document.getElementById('webcodecs-upload')?.click()}
          className={styles.uploadButton}
        >
          Upload Images for WebCodecs
        </button>
        <input
          id="webcodecs-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleWebCodecsUpload}
          className={styles.fileInput}
        />
        {webcodecsVideoUrl && (
          <div className={styles.videoContainer}>
            <video
              controls
              src={webcodecsVideoUrl}
              className={styles.video}
            ></video>
          </div>
        )}
      </div>
      <p className={styles.message}>Progress: {progress}%</p>
    </div>
  );
};

export default VideoPage;
