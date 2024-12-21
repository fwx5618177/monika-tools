import React, { useEffect, useRef } from 'react';
import shaderCode from './brown/shader.wgsl?raw';

const NUM_PARTICLES = 10000;

const BrownianMotion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const simulateBrownianMotion = async () => {
      if (!navigator.gpu) {
        console.error('WebGPU is not supported on this browser.');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      
      if (!adapter) {
        throw new Error("No appropriate GPUAdapter found.");
      }

      const device = await adapter?.requestDevice();

      if (!device || !canvasRef.current) {
        console.error('Failed to create WebGPU device or context.');
        return;
      }

      const context = canvasRef.current.getContext('webgpu') as GPUCanvasContext;
      const format = navigator.gpu.getPreferredCanvasFormat();

      context.configure({
        device,
        format,
        alphaMode: 'opaque',
      });

      const particleData = new Float32Array(NUM_PARTICLES * 4);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particleData[i * 4 + 0] = Math.random() * canvasRef.current.width;
        particleData[i * 4 + 1] = Math.random() * canvasRef.current.height;
        particleData[i * 4 + 2] = (Math.random() - 0.5) * 2;
        particleData[i * 4 + 3] = (Math.random() - 0.5) * 2;
      }

      const particleBuffer = device.createBuffer({
        size: particleData.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
      });

      device.queue.writeBuffer(particleBuffer, 0, particleData.buffer);

      const shaderModule = device.createShaderModule({
        code: shaderCode,
      });

      const computePipeline = device.createComputePipeline({
        layout: device.createPipelineLayout({
          bindGroupLayouts: [
            device.createBindGroupLayout({
              entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
              ],
            }),
          ],
        }),
        compute: {
          module: shaderModule,
          entryPoint: 'main',
        },
      });

      const bindGroup = device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: particleBuffer } },
        ],
      });


      const renderPipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
          bindGroupLayouts: [],
        }),
        vertex: {
          module: device.createShaderModule({
            code: `
              @vertex
              fn main(@location(0) position : vec2<f32>)
                -> @builtin(position) vec4<f32> {
                return vec4<f32>(position, 0.0, 1.0);
              }
            `,
          }),
          entryPoint: 'main',
          buffers: [
            {
              arrayStride: 16,
              attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' },
              ],
            },
          ],
        },
        fragment: {
          module: device.createShaderModule({
            code: `
              @fragment
              fn main() -> @location(0) vec4<f32> {
                return vec4<f32>(1.0, 1.0, 1.0, 1.0);
              }
            `,
          }),
          entryPoint: 'main',
          targets: [{ format }],
        },
        primitive: {
          topology: 'point-list',
        },
      });


      const render = () => {
        const textureView = context.getCurrentTexture().createView();

        if (!textureView) {
          console.error('Failed to create TextureView');
          return;
        }

        const commandEncoder = device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(Math.ceil(NUM_PARTICLES / 64));
        computePass.end();

        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: textureView,
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0.4, a: 1 },
              storeOp: 'store',
            },
          ],
        });

        renderPass.setPipeline(renderPipeline);
        renderPass.setVertexBuffer(0, particleBuffer);
        renderPass.draw(NUM_PARTICLES);
        renderPass.end();

        // 提交命令并确保在提交后进行下一次渲染
        device.queue.submit([commandEncoder.finish()]);

        // requestAnimationFrame(render);
      };
        render();
    };

    simulateBrownianMotion();
  }, []);

  return <canvas ref={canvasRef} width={800} height={600}></canvas>;
};

export default BrownianMotion;
