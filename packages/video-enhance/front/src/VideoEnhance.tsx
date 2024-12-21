import { useEffect, useRef, useState } from 'react';
import { Box, Slider, Typography, AppBar, Toolbar, Container, Grid, CssBaseline, createTheme, ThemeProvider, CircularProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import ReactPlayer from 'react-player';
import axios from 'axios';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#bbbbbb' },
  },
});

const VideoEnhance = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [beautyLevel, setBeautyLevel] = useState<number>(50);
  const [brightness, setBrightness] = useState<number>(50);
  const [noiseReduction, setNoiseReduction] = useState<number>(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      uploadVideo(file);
    },
  });

  const uploadVideo = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVideoSrc(URL.createObjectURL(file));  // 直接使用本地视频源
      setLoading(false);
    } catch (error) {
      console.error('Upload failed:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canvasRef.current && videoSrc) {
      initializeWebGPU(canvasRef.current);
    }
  }, [videoSrc, brightness, noiseReduction]);

  const initializeWebGPU = async (canvas: HTMLCanvasElement) => {
    if (!navigator.gpu) {
      console.error("WebGPU is not supported.");
      return;
    }
    
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) return;

    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    const presentationFormat = context.getPreferredFormat(adapter);

    context.configure({
      device,
      format: presentationFormat,
    });

    // 创建 WebGPU 渲染流水线，用于处理亮度调节和降噪
    const shaderCode = `
      @vertex
      fn vs_main(@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4<f32> {
        var positions = array<vec2<f32>, 6>(
          vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0),
          vec2<f32>(-1.0, 1.0), vec2<f32>(-1.0, 1.0),
          vec2<f32>(1.0, -1.0), vec2<f32>(1.0, 1.0)
        );
        return vec4<f32>(positions[vertexIndex], 0.0, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4<f32> {
        return vec4<f32>(0.8, 0.2, 0.2, 1.0);  // 示例着色器
      }
    `;

    const shaderModule = device.createShaderModule({
      code: shaderCode,
    });

    const pipeline = device.createRenderPipeline({
      vertex: {
        module: shaderModule,
        entryPoint: 'vs_main',
      },
      fragment: {
        module: shaderModule,
        entryPoint: 'fs_main',
        targets: [{ format: presentationFormat }],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 0, g: 0, b: 0, a: 1 },
      }],
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.draw(6, 1, 0, 0);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">Video Enhancer</Typography>
          </Toolbar>
        </AppBar>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Upload and Enhance Your Video
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Box
                {...getRootProps()}
                p={3}
                border="2px dashed #ccc"
                borderRadius="8px"
                textAlign="center"
                bgcolor={'#333'}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <Typography>Video uploading...</Typography>
                ) : (
                  <Typography>Drag and drop a video here, or click to select a file</Typography>
                )}
              </Box>

              {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress />
                </Box>
              ) : (
                videoSrc && (
                  <Box mt={2}>
                    <canvas ref={canvasRef} width="800" height="450"></canvas>
                    <ReactPlayer
                      url={videoSrc}
                      controls
                      width="100%"
                      height="500px"
                      style={{ marginTop: '20px' }}
                    />
                  </Box>
                )
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Enhance Controls
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Beauty Level</Typography>
                <Slider
                  value={beautyLevel}
                  onChange={(e, value) => setBeautyLevel(value as number)}
                  min={0}
                  max={100}
                  style={{ width: '200px' }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Brightness</Typography>
                <Slider
                  value={brightness}
                  onChange={(e, value) => setBrightness(value as number)}
                  min={0}
                  max={100}
                  style={{ width: '200px' }}
                />
              </Box>

              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography>Noise Reduction</Typography>
                <Slider
                  value={noiseReduction}
                  onChange={(e, value) => setNoiseReduction(value as number)}
                  min={0}
                  max={100}
                  style={{ width: '200px' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default VideoEnhance;