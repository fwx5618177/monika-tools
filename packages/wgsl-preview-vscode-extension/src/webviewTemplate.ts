export function getWebviewContent(shaderCode: string): string {
  return `
        <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shader 预览</title>
      <style>
          body,
          html {
              padding: 0;
              margin: 0;
              overflow: hidden;
              background: #d3d3d3;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100vw;
              height: 100vh;
          }
  
          canvas {
              width: 90%;
              height: 90%;
              border: 1px solid #000;
              background-color: #fff;
              box-shadow: 0 0 10px #000;
              border-radius: 12px;
          }
      </style>
  </head>
  
  <body>
      <canvas id="shaderCanvas"></canvas>
      <div id="errorMessage" style="display: none; color: red; padding: 10px; border: 1px solid red; border-radius: 5px;"></div>
      <script>
          const canvas = document.getElementById('shaderCanvas');
          const errorMessageDiv = document.getElementById('errorMessage');
          let frameCount = 0;
  
          async function initShader(code) {
              try {
                  if (!navigator.gpu) {
                      showError('WebGPU 不支持');
                      return;
                  }
  
                  const adapter = await navigator.gpu.requestAdapter();
                  const device = await adapter.requestDevice();
  
                  const canvasContext = canvas.getContext('webgpu');
                  const format = navigator.gpu.getPreferredCanvasFormat();
                  canvasContext.configure({ device, format });
  
                  const shaderModule = device.createShaderModule({ code });
  
                  // 定义 bind group layout 和 pipeline
                  const bindGroupLayout = device.createBindGroupLayout({
                      entries: [
                          {
                              binding: 0,
                              visibility: GPUShaderStage.FRAGMENT,
                              buffer: { type: 'uniform' }
                          }
                      ]
                  });
  
                  const pipeline = device.createRenderPipeline({
                      layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
                      vertex: {
                          module: shaderModule,
                          entryPoint: getEntryPointName(code, 'vertex')
                      },
                      fragment: {
                          module: shaderModule,
                          entryPoint: getEntryPointName(code, 'fragment'),
                          targets: [{ format }]
                      },
                      primitive: { topology: 'triangle-list' }
                  });
  
                  // 创建 uniform buffer 并初始化 bind group
                  const uniformBuffer = device.createBuffer({
                      size: 4, // u32 占用 4 字节
                      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                  });
  
                  const bindGroup = device.createBindGroup({
                      layout: bindGroupLayout,
                      entries: [
                          {
                              binding: 0,
                              resource: { buffer: uniformBuffer }
                          }
                      ]
                  });
  
                  // 渲染函数
                  function render() {
                      frameCount++;
                      device.queue.writeBuffer(uniformBuffer, 0, new Uint32Array([frameCount]));
  
                      const commandEncoder = device.createCommandEncoder();
                      const textureView = canvasContext.getCurrentTexture().createView();
                      const renderPassDescriptor = {
                          colorAttachments: [
                              {
                                  view: textureView,
                                  loadOp: 'clear',
                                  storeOp: 'store',
                                  clearValue: { r: 0, g: 0, b: 0, a: 1 }
                              },
                          ],
                      };
  
                      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
                      passEncoder.setPipeline(pipeline);
                      passEncoder.setBindGroup(0, bindGroup); // 设置 bind group
                      passEncoder.draw(36);
                      passEncoder.end();
  
                      device.queue.submit([commandEncoder.finish()]);
                      requestAnimationFrame(render); // 循环调用
                  }
  
                  render(); // 初次调用渲染
                  clearError();
              } catch (error) {
                  showError("渲染时出错: " + error.message);
                  console.error("渲染时出错:", error);
              }
          }
  
          function showError(message) {
              errorMessageDiv.style.display = 'block';
              errorMessageDiv.textContent = message;
          }
  
          function clearError() {
              errorMessageDiv.style.display = 'none';
              errorMessageDiv.textContent = '';
          }
  
          // 从 shaderCode 中提取 vertex 和 fragment 入口点名称
          function getEntryPointName(code, type) {
              const regex = new RegExp('@' + type + '\\s+fn\\s+(\\w+)', 'i');
              const match = code.match(regex);
              return match ? match[1] : null;
          }
  
          // 初始化 Shader
          initShader(\`${shaderCode}\`);
  
          // 监听来自扩展的消息以更新 Shader
          window.addEventListener('message', event => {
              const message = event.data;
              if (message.type === 'updateShader') {
                  initShader(message.code);
              }
          });
      </script>
  </body>
  
  </html>`;
}
