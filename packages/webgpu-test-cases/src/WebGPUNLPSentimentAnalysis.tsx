import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';
import * as tfvis from '@tensorflow/tfjs-vis';
import { Tokenizer } from 'natural'; // 使用 natural 库来代替 Tokenizer

// 自定义的 Tokenizer，使用 natural 库
class SimpleTokenizer {
  private tokenizer: any;
  private wordIndex: { [key: string]: number };
  private numWords: number;

  constructor(numWords: number) {
    this.tokenizer = new Tokenizer();
    this.wordIndex = {};
    this.numWords = numWords;
  }

  fitOnTexts(texts: string[]) {
    const allWords = texts
      .flatMap(text => this.tokenizer.tokenize(text.toLowerCase()))
      .filter(word => word.length > 1);

    const uniqueWords = Array.from(new Set(allWords));
    uniqueWords.slice(0, this.numWords).forEach((word, index) => {
      this.wordIndex[word] = index + 1; // 索引从 1 开始，0 留给 padding
    });
  }

  textsToSequences(texts: string[]): number[][] {
    return texts.map(text =>
      this.tokenizer.tokenize(text.toLowerCase()).map(word => this.wordIndex[word] || 0)
    );
  }
}

const WebGPUNLPSentimentAnalysis: React.FC = () => {
  useEffect(() => {
    const trainModel = async () => {
      // 设置 WebGPU 后端
      await tf.setBackend('webgpu');
      await tf.ready();

      // 加载并预处理 IMDb 数据集
      const { train, validation } = await loadIMDBDataset();

      // 定义模型
      const model = tf.sequential();

      // 嵌入层：将单词索引映射到固定维度的向量
      model.add(tf.layers.embedding({ inputDim: 10000, outputDim: 128, inputLength: 256 }));

      // LSTM 层：用于捕捉序列中的上下文信息
      model.add(tf.layers.lstm({ units: 128 }));

      // 全连接层：将 LSTM 的输出映射到二分类结果
      model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

      // 编译模型
      model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
      });

      // 训练模型
      await model.fit(train.xs, train.ys, {
        batchSize: 128,
        epochs: 5,
        validationData: [validation.xs, validation.ys],
        callbacks: tfvis.show.fitCallbacks(
          { name: '训练过程' },
          ['loss', 'val_loss', 'acc', 'val_acc'],
          { height: 200, callbacks: ['onEpochEnd'] }
        ),
      });

      // 测试模型
      const testSentence = "This movie was really good and I enjoyed it a lot!";
      const input = preprocessText(testSentence);
      const prediction = model.predict(input) as tf.Tensor;
      prediction.print();  // 输出预测结果（0到1之间）
    };

    trainModel();
  }, []);

  // 加载并预处理 IMDb 数据集
async function loadIMDBDataset() {
    const imdb = require('@tensorflow/tfjs-datasets');
    const { trainData, testData } = await imdb.loadImdbDataset({ numWords: 10000 });
  
    const tokenizer = new SimpleTokenizer(10000);
    const trainTexts = trainData.map(({ xs }) => xs);
    const validationTexts = testData.map(({ xs }) => xs);
    tokenizer.fitOnTexts(trainTexts.concat(validationTexts));
  
    const trainXs = tf.tensor2d(
      tokenizer.textsToSequences(trainTexts).map(seq => tf.pad(seq, [[0, 256 - seq.length]], 0)),
      [trainData.length, 256]
    );
    const trainYs = tf.tensor2d(trainData.map(({ ys }) => ys), [trainData.length, 1]);
  
    const validationXs = tf.tensor2d(
      tokenizer.textsToSequences(validationTexts).map(seq => tf.pad(seq, [[0, 256 - seq.length]], 0)),
      [testData.length, 256]
    );
    const validationYs = tf.tensor2d(testData.map(({ ys }) => ys), [testData.length, 1]);
  
    return { train: { xs: trainXs, ys: trainYs }, validation: { xs: validationXs, ys: validationYs } };
  }
  
  // 预处理文本
  function preprocessText(text: string) {
    const tokenizer = new SimpleTokenizer(10000);
    tokenizer.fitOnTexts([text]);
    const sequences = tokenizer.textsToSequences([text]);
    const paddedSequences = tf.pad(sequences[0], [[0, 256 - sequences[0].length]], 0);
    return tf.tensor2d([paddedSequences], [1, 256]);
  }
  

  return <div>Training NLP sentiment analysis model with WebGPU...</div>;
};

export default WebGPUNLPSentimentAnalysis;
