import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';

const WebGPUTrainModel: React.FC = () => {
  useEffect(() => {
    const trainModel = async () => {
      await tf.setBackend('webgpu');
      await tf.ready();

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
      model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

      const xs = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 1]);
      const ys = tf.tensor2d([1, 3, 5, 7, 9, 11, 13, 15, 17, 19], [10, 1]); // y = 2x - 1

      await model.fit(xs, ys, {
        epochs: 10000,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`);
          },
        },
      });

      const predict = 11;
      const output = model.predict(tf.tensor2d([predict], [1, 1])) as tf.Tensor;
      
      const data = await output.data();
      console.log(`Prediction for x = ${predict}: y = ${data[0]}`);
    };

    trainModel();
  }, []);

  return <div>Training model with WebGPU...</div>;
};

export default WebGPUTrainModel;
