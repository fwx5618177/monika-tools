export async function drawLampCover(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline) {
  const vertices = new Float32Array([
    // 定义灯罩的顶点 (例如一个半球形灯罩)
    -0.3, 0.5, 0,
    0.3, 0.5, 0,
    0, 1.0, 0,
  ]);

  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  });

  new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
  vertexBuffer.unmap();

  const commandEncoder = device.createCommandEncoder();
  const textureView = context.getCurrentTexture().createView();
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: textureView,
        loadOp: 'clear',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        storeOp: 'store',
      },
    ],
  };

  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(3); // 3个顶点
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}