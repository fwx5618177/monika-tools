import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import * as tfvis from '@tensorflow/tfjs-vis';

const WebGPUTrainComplexModel: React.FC = () => {
  useEffect(() => {
    const trainModel = async () => {
      // 设置 WebGPU 后端
      await tf.setBackend('webgpu');
      await tf.ready();

      // 生成双月形数据集
      const [xs, ys] = tf.tidy(() => {
        const numSamples = 1000;
        const { xs, ys } = makeMoons(numSamples);
        return [
          tf.tensor2d(xs, [numSamples, 2]), // 二维输入
          tf.tensor2d(ys, [numSamples, 1])  // 目标输出（0 或 1）
        ];
      });

      // 创建模型
      const model = tf.sequential();

      // 第一层：隐藏层，Dense（ReLU）
      model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [2] }));
      // 第二层：隐藏层，Dense（ReLU）
      model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
      // 输出层：Dense（Sigmoid），用于二分类
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

      // 编译模型
      model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
      });

      // 训练模型
      await model.fit(xs, ys, {
        batchSize: 32,
        epochs: 100,
        validationSplit: 0.2,
        callbacks: tfvis.show.fitCallbacks(
          { name: '训练过程' },
          ['loss', 'val_loss', 'acc', 'val_acc'],
          { height: 200, callbacks: ['onEpochEnd'] }
        ),
      });

      // 测试模型
      const testXs = tf.tensor2d([[0.5, 0.5], [-0.5, -0.5], [0.3, 0.3]]);
      const preds = model.predict(testXs) as tf.Tensor;
      preds.print();  // 打印预测结果（介于 0 和 1 之间）

      // 释放资源
      xs.dispose();
      ys.dispose();
      testXs.dispose();
    };

    trainModel();
  }, []);

  function makeMoons(nSamples: number, noise: number = 0.1) {
    const nSamplesOut = Math.floor(nSamples / 2);
    const xOut: number[][] = [];
    const yOut: number[] = [];
  
    for (let i = 0; i < nSamplesOut; i++) {
      const theta = Math.PI * i / nSamplesOut;
      xOut.push([Math.cos(theta), Math.sin(theta)]);
      yOut.push(0);
    }
  
    for (let i = 0; i < nSamplesOut; i++) {
      const theta = Math.PI * i / nSamplesOut;
      xOut.push([1 - Math.cos(theta), 1 - Math.sin(theta) - 0.5]);
      yOut.push(1);
    }
  
    if (noise > 0) {
      for (let i = 0; i < xOut.length; i++) {
        xOut[i][0] += noise * (Math.random() - 0.5);
        xOut[i][1] += noise * (Math.random() - 0.5);
      }
    }
  
    return { xs: xOut, ys: yOut };
  }
  

  return <div>Training complex model with WebGPU...</div>;
};

export default WebGPUTrainComplexModel;
