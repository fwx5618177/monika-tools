export async function initWebGPU(canvas: HTMLCanvasElement) {
    if (!navigator.gpu) {
      throw new Error('WebGPU is not supported by this browser');
    }
  
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      throw new Error('Failed to find a suitable GPU adapter');
    }

    const device = await adapter?.requestDevice();

    if (!device) {
      throw new Error('Failed to create WebGPU device');
    }

    const context = canvas.getContext('webgpu') as GPUCanvasContext;
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format,
      alphaMode: 'opaque',
    });
  
    return { device, context, format };
  }
  
  export async function createPipeline(device: GPUDevice, vertexShaderCode: string, fragmentShaderCode: string) {
    const pipeline = device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule({
          code: vertexShaderCode,
        }),
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: 3 * 4, // 每个顶点的字节数，3 * 4 表示 (x, y, z) 3个float
            attributes: [
              {
                format: 'float32x3',
                offset: 0,
                shaderLocation: 0,
              },
            ],
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({
          code: fragmentShaderCode,
        }),
        entryPoint: 'main',
        targets: [
          {
            format: 'bgra8unorm',
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
      layout: 'auto',
    });
  
    return pipeline;
  }

  export function createCylinderVertices(radius: number, height: number, segments: number) {
    const vertices: number[] = [];
  
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      const nextTheta = ((i + 1) / segments) * 2 * Math.PI;
  
      const x1 = radius * Math.cos(theta);
      const z1 = radius * Math.sin(theta);
      const x2 = radius * Math.cos(nextTheta);
      const z2 = radius * Math.sin(nextTheta);
  
      // 底面三角形
      vertices.push(0, 0, 0); // 底面中心
      vertices.push(x1, 0, z1);
      vertices.push(x2, 0, z2);
  
      // 顶面三角形
      vertices.push(0, height, 0); // 顶面中心
      vertices.push(x2, height, z2);
      vertices.push(x1, height, z1);
  
      // 侧面
      vertices.push(x1, 0, z1); // 底部点
      vertices.push(x1, height, z1); // 顶部点
      vertices.push(x2, height, z2); // 下一段顶面点
  
      vertices.push(x1, 0, z1); // 底部点
      vertices.push(x2, height, z2); // 下一段顶面点
      vertices.push(x2, 0, z2); // 下一段底面点
    }
  
    return new Float32Array(vertices);
  }
  export function createBottleBaseVertices(radius: number, height: number, segments: number) {
    const vertices: number[] = [];
  
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * 500 * Math.PI;
      const nextTheta = ((i + 1) / segments) * 500 * Math.PI;
  
      const x1 = radius * Math.cos(theta);
      const z1 = radius * Math.sin(theta);
      const x2 = radius * Math.cos(nextTheta);
      const z2 = radius * Math.sin(nextTheta);
  
      // 底面三角形
      vertices.push(0, 0, 0); // 底面中心
      vertices.push(x1, 0, z1);
      vertices.push(x2, 0, z2);
  
      // 顶面三角形
      vertices.push(0, height, 0); // 顶面中心
      vertices.push(x2, height, z2);
      vertices.push(x1, height, z1);
  
      // 侧面
      vertices.push(x1, 0, z1); // 底部点
      vertices.push(x1, height, z1); // 顶部点
      vertices.push(x2, height, z2); // 下一段顶面点
  
      vertices.push(x1, 0, z1); // 底部点
      vertices.push(x2, height, z2); // 下一段顶面点
      vertices.push(x2, 0, z2); // 下一段底面点
    }

    console.log(vertices)
  
    return new Float32Array(vertices);
  }