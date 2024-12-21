import React from 'react';
// import ConwayGameOfLife from './ConwayGameOfLife';
// import WebGPUMatrixMultiply from './WebGPUMatrixMultiply';
// import BrownianMotion from './BrownianMotion';
// import WebGPUTrainModel from './WebGPUTrainModel';
// import FluidSimulation from './FluidSimulation';
// import WebGPUVectorAddition from './WebGPUVectorAddition';
// import WebGPUTrainComplexModel from './WebGPUTrainComplexModel';
// import WebGPUNLPSentimentAnalysis from './WebGPUNLPSentimentAnalysis';
import AlcoholFire from './AlcoholFire';

const WebGPUExample: React.FC = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect(() => {
  //   const initWebGPU = async () => {
  //     if (!canvasRef.current) return;
  //     const canvas = canvasRef.current;

  //     if (!navigator.gpu) {
  //       console.error('WebGPU is not supported on this browser.');
  //       return;
  //     }

  //     const adapter = await navigator.gpu.requestAdapter();
  //     const device = await adapter?.requestDevice();

  //     if (!device) {
  //       console.error('Failed to create WebGPU device.');
  //       return;
  //     }

  //     const context = canvas.getContext('webgpu') as GPUCanvasContext;
  //     const format = navigator.gpu.getPreferredCanvasFormat();

  //     context.configure({
  //       device: device,
  //       format: format,
  //       alphaMode: 'opaque',
  //     });

  //     const pipeline = device.createRenderPipeline({
  //       layout: 'auto', // 自动生成布局
  //       vertex: {
  //         module: device.createShaderModule({
  //           code: `
  //             @vertex
  //             fn main(@builtin(vertex_index) vertexIndex: u32)
  //             -> @builtin(position) vec4<f32> {
  //               var pos = array<vec2<f32>, 3>(
  //                 vec2<f32>(0.0, 0.5),
  //                 vec2<f32>(-0.5, -0.5),
  //                 vec2<f32>(0.5, -0.5)
  //               );
  //               return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  //             }
  //           `,
  //         }),
  //         entryPoint: 'main',
  //       },
  //       fragment: {
  //         module: device.createShaderModule({
  //           code: `
  //             @fragment
  //             fn main() -> @location(0) vec4<f32> {
  //               return vec4<f32>(0.0, 1.0, 0.0, 1.0);
  //             }
  //           `,
  //         }),
  //         entryPoint: 'main',
  //         targets: [{ format: format }],
  //       },
  //       primitive: {
  //         topology: 'triangle-list',
  //       },
  //     });

  //     const commandEncoder = device.createCommandEncoder();
  //     const textureView = context.getCurrentTexture().createView();

  //     const renderPassDescriptor: GPURenderPassDescriptor = {
  //       colorAttachments: [
  //         {
  //           view: textureView,
  //           loadOp: 'clear',
  //           clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
  //           storeOp: 'store',
  //         },
  //       ],
  //     };

  //     const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  //     passEncoder.setPipeline(pipeline);
  //     passEncoder.draw(3, 1, 0, 0);
  //     passEncoder.end();

  //     device.queue.submit([commandEncoder.finish()]);
  //   };

  //   initWebGPU();
  // }, []);

  return (
    <>
    {/* <canvas ref={canvasRef} width={640} height={480}></canvas> */}
    {/* <div>

    </div> */}
    {/* <div>
      <BrownianMotion />
    </div> */}
    {/* <div>
      <FluidSimulation />
    </div> */}
    {/* <div>
      <ConwayGameOfLife />
    </div> */}
    {/* <div>
      <WebGPUMatrixMultiply />
    </div> */}
    <div>
      {/* <WebGPUTrainModel /> */}
      {/* <WebGPUTrainComplexModel /> */}
      {/* <WebGPUNLPSentimentAnalysis /> */}
    </div>
    {/* <WebGPUVectorAddition /> */}

    <div>
      <AlcoholFire />
    </div>
    </>
  );
};

export default WebGPUExample;