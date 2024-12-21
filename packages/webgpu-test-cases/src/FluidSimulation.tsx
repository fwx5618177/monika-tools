import React, { useEffect, useRef } from 'react';

const GRID_SIZE = 256;

const FluidSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const runFluidSimulation = async () => {
      if (!navigator.gpu) {
        console.error('WebGPU is not supported on this browser.');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
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

      const shaderCode = `
        struct Particle {
          position: vec2<f32>,
          velocity: vec2<f32>,
        };

        @group(0) @binding(0) var<storage, read_write> particles : array<Particle>;

        @compute @workgroup_size(16, 16)
        fn main(@builtin(global_invocation_id) id : vec3<u32>) {
          let i = id.x + id.y * 256u;
          if (i >= arrayLength(&particles)) { return; }

          var p = particles[i];
          p.velocity += vec2<f32>(0.0, -0.1);
          p.position += p.velocity;

          if (p.position.y < 0.0) {
            p.position.y = 0.0;
            p.velocity.y = -p.velocity.y * 0.5;
          }

          particles[i] = p;
        }
      `;

      const particleData = new Float32Array(GRID_SIZE * GRID_SIZE * 4);
      for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        particleData[i * 4 + 0] = Math.random() * canvasRef.current.width;
        particleData[i * 4 + 1] = Math.random() * canvasRef.current.height;
        particleData[i * 4 + 2] = 0;
        particleData[i * 4 + 3] = 0;
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
        layout: 'auto',
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
        layout: 'auto',
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
                return vec4<f32>(0.3, 0.5, 1.0, 1.0);
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
        const commandEncoder = device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(GRID_SIZE / 16, GRID_SIZE / 16);
        computePass.end();

        // Render the particles
        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              storeOp: 'store',
            },
          ],
        });

        renderPass.setPipeline(renderPipeline);
        renderPass.setVertexBuffer(0, particleBuffer);
        renderPass.draw(GRID_SIZE * GRID_SIZE);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(render);
      };

      render();
    };

    runFluidSimulation();
  }, []);

  return <canvas ref={canvasRef} width={800} height={800}></canvas>;
};

export default FluidSimulation;
