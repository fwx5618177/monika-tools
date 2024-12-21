import React, { useEffect } from 'react';
import { initWebGPU, createPipeline } from './utils/webgpu-utils';
import { drawBase } from './components/Base';
// import { drawLampCover } from './components/LampCover';
// import { drawWick } from './components/Wick';

// 直接导入 WGSL 着色器文件
import vertexShaderCode from './shaders/vertex.wgsl';
import fragmentShaderCode from './shaders/fragment.wgsl';
import { getModelViewProjectionMatrix } from './utils/getModelViewProjectionMatrix';

const AlcoholFire: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      const canvas = document.getElementById('alcoholCanvas') as HTMLCanvasElement;
      const { device, context } = await initWebGPU(canvas);

      const pipeline = await createPipeline(device, vertexShaderCode, fragmentShaderCode);

      const mvpMatrix = getModelViewProjectionMatrix(canvas);
      const uniformBuffer = device.createBuffer({
        size: mvpMatrix.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix);

      const bindGroupLayout = pipeline.getBindGroupLayout(0);

      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      // 依次调用绘制函数
      await drawBase(device, context, pipeline, bindGroup);
    //   await drawLampCover(device, context, pipeline);
    //   await drawWick(device, context, pipeline);
    };

    init();
  }, []);

  return <canvas id="alcoholCanvas" width="800" height="600"></canvas>;
};

export default AlcoholFire;