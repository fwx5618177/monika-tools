import React, { useEffect, useRef } from 'react';

const GRID_SIZE = 256;

const ConwayGameOfLife: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const runGameOfLife = async () => {
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

      const vertexShaderCode = `
        @vertex
        fn main(@builtin(vertex_index) vertexIndex: u32)
          -> @builtin(position) vec4<f32> {
          var pos = array<vec2<f32>, 4>(
              vec2<f32>(-1.0, -1.0),
              vec2<f32>( 1.0, -1.0),
              vec2<f32>(-1.0,  1.0),
              vec2<f32>( 1.0,  1.0)
          );
          return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
        }
      `;

      const fragmentShaderCode = `
        @group(0) @binding(0) var<storage, read> currentGrid : array<u32>;
        @group(0) @binding(1) var<storage, read_write> nextGrid : array<u32>;
        @group(0) @binding(2) var<uniform> gridSize : u32;

        fn getCell(x: u32, y: u32) -> u32 {
          return currentGrid[y * gridSize + x];
        }

        fn getNeighborCount(x: u32, y: u32) -> u32 {
          var count: u32 = 0;
          for (var dy: i32 = -1; dy <= 1; dy++) {
            for (var dx: i32 = -1; dx <= 1; dx++) {
              if (dx == 0 && dy == 0) {
                continue;
              }
              let nx = (x as i32 + dx + gridSize as i32) % gridSize as i32;
              let ny = (y as i32 + dy + gridSize as i32) % gridSize as i32;
              count += getCell(nx as u32, ny as u32);
            }
          }
          return count;
        }

        @fragment
        fn main() -> @location(0) vec4<f32> {
          let id = vec2<u32>(gl_FragCoord.xy);
          let x = id.x;
          let y = id.y;
          let state = getCell(x, y);
          let neighbors = getNeighborCount(x, y);

          let newState = select(0u, 1u, neighbors == 3u || (neighbors == 2u && state == 1u));

          nextGrid[y * gridSize + x] = newState;

          return vec4<f32>(f32(newState), f32(newState), f32(newState), 1.0);
        }
      `;

      const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: device.createShaderModule({
            code: vertexShaderCode,
          }),
          entryPoint: 'main',
        },
        fragment: {
          module: device.createShaderModule({
            code: fragmentShaderCode,
          }),
          entryPoint: 'main',
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-strip',
        },
      });

      let gridBufferA = device.createBuffer({
        size: GRID_SIZE * GRID_SIZE * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      });

      let gridBufferB = device.createBuffer({
        size: GRID_SIZE * GRID_SIZE * Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      });

      const gridSizeBuffer = device.createBuffer({
        size: Uint32Array.BYTES_PER_ELEMENT,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      device.queue.writeBuffer(gridSizeBuffer, 0, new Uint32Array([GRID_SIZE]));

      let bindGroupA = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: gridBufferA } },
          { binding: 1, resource: { buffer: gridBufferB } },
          { binding: 2, resource: { buffer: gridSizeBuffer } },
        ],
      });

      let bindGroupB = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: gridBufferB } },
          { binding: 1, resource: { buffer: gridBufferA } },
          { binding: 2, resource: { buffer: gridSizeBuffer } },
        ],
      });

      const render = () => {
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              storeOp: 'store',
            },
          ],
        });

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroupA);
        passEncoder.draw(4);
        passEncoder.end();

        device.queue.submit([commandEncoder.finish()]);

        // 交换缓冲区以便下一帧使用
        [gridBufferA, gridBufferB] = [gridBufferB, gridBufferA];
        [bindGroupA, bindGroupB] = [bindGroupB, bindGroupA];

        requestAnimationFrame(render);
      };

      render();
    };

    runGameOfLife();
  }, []);

  return <canvas ref={canvasRef} width={GRID_SIZE} height={GRID_SIZE}></canvas>;
};

export default ConwayGameOfLife;