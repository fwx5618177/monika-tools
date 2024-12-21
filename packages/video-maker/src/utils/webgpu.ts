export async function computeScrollPosition(
  containerWidth: number,
  thumbnailWidth: number,
  thumbnailOffsetLeft: number
): Promise<number> {
  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error('WebGPU not supported');
  }

  const device = await adapter.requestDevice();
  const queue = device.queue;

  const inputBuffer = device.createBuffer({
    size: 3 * 4, // 三个 32 位浮点数的空间
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });

  const outputBuffer = device.createBuffer({
    size: 4, // 一个 32 位浮点数的空间
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.MAP_READ,
  });

  const shaderModule = device.createShaderModule({
    code: `
      @group(0) @binding(0) var<storage, read> inputData: array<f32, 3>;
      @group(0) @binding(1) var<storage, read_write> outputData: array<f32, 1>;

      @compute @workgroup_size(1) fn main() {
        let containerWidth = inputData[0];
        let thumbnailWidth = inputData[1];
        let thumbnailOffsetLeft = inputData[2];

        outputData[0] = thumbnailOffsetLeft - containerWidth / 2.0 + thumbnailWidth / 2.0;
      }
    `,
  });

  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [
        device.createBindGroupLayout({
          entries: [
            {
              binding: 0,
              visibility: GPUShaderStage.COMPUTE,
              buffer: { type: 'read-only-storage' },
            },
            {
              binding: 1,
              visibility: GPUShaderStage.COMPUTE,
              buffer: { type: 'storage' },
            },
          ],
        }),
      ],
    }),
    compute: { module: shaderModule, entryPoint: 'main' },
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: inputBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
    ],
  });

  const inputArray = new Float32Array([
    containerWidth,
    thumbnailWidth,
    thumbnailOffsetLeft,
  ]);
  device.queue.writeBuffer(
    inputBuffer,
    0,
    inputArray.buffer,
    inputArray.byteOffset,
    inputArray.byteLength
  );

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(1);
  passEncoder.end();

  // 将输出缓冲区的数据复制到可读的缓冲区
  const readBuffer = device.createBuffer({
    size: 4, // 一个 32 位浮点数的空间
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });

  commandEncoder.copyBufferToBuffer(outputBuffer, 0, readBuffer, 0, 4);

  queue.submit([commandEncoder.finish()]);

  // 映射缓冲区以读取数据
  await readBuffer.mapAsync(GPUMapMode.READ);
  const arrayBuffer = readBuffer.getMappedRange();
  const resultArray = new Float32Array(arrayBuffer);

  // 提取并返回结果
  const result = resultArray[0];

  // 解除映射并清理资源
  readBuffer.unmap();
  readBuffer.destroy();
  outputBuffer.destroy();
  inputBuffer.destroy();

  return result;
}
