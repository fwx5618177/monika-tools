import React, { useEffect } from 'react';

const WebGPUMatrixMultiply: React.FC = () => {
  useEffect(() => {
    const matrixMultiply = async () => {
      if (!navigator.gpu) {
        console.error('WebGPU is not supported on this browser.');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      const device = await adapter?.requestDevice() as GPUDevice;

      const shaderCode = `
        @group(0) @binding(0) var<storage, read> a : array<f32>;
        @group(0) @binding(1) var<storage, read> b : array<f32>;
        @group(0) @binding(2) var<storage, read_write> result : array<f32>;
        
        @compute @workgroup_size(8, 8)
        fn main(@builtin(global_invocation_id) id : vec3<u32>) {
            let row = id.y;
            let col = id.x;
            var sum : f32 = 0.0;
            for (var k = 0u; k < 8u; k = k + 1u) {
                sum = sum + a[row * 8u + k] * b[k * 8u + col];
            }
            result[row * 8u + col] = sum;
        }
      `;

      const shaderModule = device.createShaderModule({ code: shaderCode });

      const pipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: shaderModule,
          entryPoint: 'main',
        },
      });

      const a = new Float32Array([
        1, 2, 3, 4, 5, 6, 7, 8,
        9, 10, 11, 12, 13, 14, 15, 16,
        17, 18, 19, 20, 21, 22, 23, 24,
        25, 26, 27, 28, 29, 30, 31, 32,
        33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48,
        49, 50, 51, 52, 53, 54, 55, 56,
        57, 58, 59, 60, 61, 62, 63, 64,
      ]);

      const b = new Float32Array([
        64, 63, 62, 61, 60, 59, 58, 57,
        56, 55, 54, 53, 52, 51, 50, 49,
        48, 47, 46, 45, 44, 43, 42, 41,
        40, 39, 38, 37, 36, 35, 34, 33,
        32, 31, 30, 29, 28, 27, 26, 25,
        24, 23, 22, 21, 20, 19, 18, 17,
        16, 15, 14, 13, 12, 11, 10, 9,
        8, 7, 6, 5, 4, 3, 2, 1,
      ]);

      const result = new Float32Array(64);

      const aBuffer = device.createBuffer({
        size: a.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(aBuffer, 0, a);

      const bBuffer = device.createBuffer({
        size: b.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(bBuffer, 0, b);

      const resultBuffer = device.createBuffer({
        size: result.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: aBuffer } },
          { binding: 1, resource: { buffer: bBuffer } },
          { binding: 2, resource: { buffer: resultBuffer } },
        ],
      });

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginComputePass();

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(8, 8);
      passEncoder.end();

      const gpuBuffer = device.createBuffer({
        size: result.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      });

      commandEncoder.copyBufferToBuffer(resultBuffer, 0, gpuBuffer, 0, result.byteLength);

      device.queue.submit([commandEncoder.finish()]);

      await gpuBuffer.mapAsync(GPUMapMode.READ);
      const copyArrayBuffer = gpuBuffer.getMappedRange();
      const copyArray = new Float32Array(copyArrayBuffer);

      console.log("Result:", copyArray);
      gpuBuffer.unmap();
    };

    matrixMultiply();
  }, []);

  return <div>Check the console for matrix multiplication result.</div>;
};

export default WebGPUMatrixMultiply;