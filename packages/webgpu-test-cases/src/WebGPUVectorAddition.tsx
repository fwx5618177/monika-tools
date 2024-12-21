import React, { useEffect } from 'react';

const N = 1024 * 1024; // 向量的长度为 1,048,576

const WebGPUVectorAddition: React.FC = () => {
  useEffect(() => {
    const runVectorAddition = async () => {
      if (!navigator.gpu) {
        console.error('WebGPU is not supported on this browser.');
        return;
      }

      const adapter = await navigator.gpu.requestAdapter();
      const device = await adapter?.requestDevice();

      if (!device) {
        console.error('Failed to create WebGPU device.');
        return;
      }

      // 创建输入数据
      const a = new Float32Array(N);
      const b = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        a[i] = i;
        b[i] = i * 2;
      }

      // 创建输出数据的缓冲区
      const result = new Float32Array(N);

      // 创建 WebGPU 缓冲区
      const bufferA = device.createBuffer({
        size: a.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(bufferA, 0, a);

      const bufferB = device.createBuffer({
        size: b.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      });
      device.queue.writeBuffer(bufferB, 0, b);

      const bufferResult = device.createBuffer({
        size: result.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
      });

      const gpuReadBuffer = device.createBuffer({
        size: result.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
      });

      // 创建计算着色器
      const computeShaderCode = `
        @group(0) @binding(0) var<storage, read> bufferA : array<f32>;
        @group(0) @binding(1) var<storage, read> bufferB : array<f32>;
        @group(0) @binding(2) var<storage, read_write> bufferResult : array<f32>;

        @compute @workgroup_size(64)
        fn main(@builtin(global_invocation_id) id : vec3<u32>) {
          let index = id.x;
          bufferResult[index] = bufferA[index] + bufferB[index];
        }
      `;

      const shaderModule = device.createShaderModule({
        code: computeShaderCode,
      });

      // 创建计算管道
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
          { binding: 0, resource: { buffer: bufferA } },
          { binding: 1, resource: { buffer: bufferB } },
          { binding: 2, resource: { buffer: bufferResult } },
        ],
      });

      // 创建指令编码器
      const commandEncoder = device.createCommandEncoder();

      // 开始计算 pass
      const passEncoder = commandEncoder.beginComputePass();
      passEncoder.setPipeline(computePipeline);
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.dispatchWorkgroups(Math.ceil(N / 64)); // 每个工作组处理 64 个元素
      passEncoder.end();

      // 将结果缓冲区复制到可读取缓冲区
      commandEncoder.copyBufferToBuffer(bufferResult, 0, gpuReadBuffer, 0, result.byteLength);

      // 提交命令
      device.queue.submit([commandEncoder.finish()]);

      // 异步读取 GPU 结果
      await gpuReadBuffer.mapAsync(GPUMapMode.READ);
      const arrayBuffer = gpuReadBuffer.getMappedRange();
      const outputArray = new Float32Array(arrayBuffer);

      // 验证结果
      console.log('First 10 results:', outputArray.slice(0, 10));
      console.log('Last 10 results:', outputArray.slice(N - 10, N));
    };

    runVectorAddition();
  }, []);

  return <div>Running vector addition on WebGPU...</div>;
};

export default WebGPUVectorAddition;
