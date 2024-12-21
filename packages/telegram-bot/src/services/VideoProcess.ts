import ffmpeg from 'fluent-ffmpeg';
import fs, { PathLike, ReadStream } from 'fs';
import { logger } from 'utils/loggers';

export class VideoProcess {
    /**
     * 将二进制数据转换为视频文件
     * @param {Buffer} data - 视频数据的Buffer对象
     * @param {string} filePath - 保存视频文件的文件名
     */
    static async writeBinary2file(data: ReadStream, filePath: PathLike) {
        return new Promise((resolve, reject) => {
            logger.info(`${filePath} is processing...`);

            // 创建一个写入流，用于将视频数据写入文件系统
            const writer = fs.createWriteStream(filePath);
            data.pipe(writer); // 将视频数据流导入文件写入流

            writer.on('finish', () => {
                logger.info('Download complete!'); // 当写入完成时打印消息
                resolve('done');
            });

            writer.on('error', err => {
                logger.error('Error occurred while writing the file', err); // 监听错误事件
                reject(err); // 抛出错误
            });
        });
    }

    /**
     * 检测视频文件的格式
     * @param {string} filePath - 视频文件的路径
     * @returns {Promise<string>} 检测到的视频格式
     */
    static async detectVideoFormat(filePath: any): Promise<string> {
        return new Promise((resolve, reject) => {
            // 使用ffmpeg的ffprobe方法获取视频元数据
            ffmpeg.ffprobe(filePath, (err, metadata) => {
                if (err) {
                    logger.error('Error detecting video format', err);
                    reject(err); // 错误时拒绝Promise
                } else {
                    const format: string = metadata.format.format_name as string; // 从元数据中提取格式名称
                    logger.info(`Detected video format: ${format}`);
                    resolve(format);
                }
            });
        });
    }

    /**
     * 转换视频文件的格式
     * @param {string} inputFilePath - 输入视频文件的路径
     * @param {string} outputFilePath - 输出视频文件的路径
     *
     */
    static async convertVideoFormat(inputFilePath: string, outputFilePath: string) {
        return new Promise((resolve, reject) => {
            // 配置ffmpeg命令以转换视频格式
            const command = ffmpeg(inputFilePath)
                .videoCodec('copy') // 复制视频流，不重新编码
                .audioCodec('aac') // 将音频编解码器设置为AAC
                .audioChannels(2) // 设置音频通道数为2
                .audioFrequency(44100) // 设置音频采样频率为44100Hz
                .on('end', () => {
                    logger.info(`Video converted to AAC format`);
                    resolve(outputFilePath); // 转换完成时解决Promise
                })
                .on('error', (err: any) => {
                    logger.error('Error converting video format', err); // 监听错误事件
                    reject(err); // 错误时拒绝Promise
                });

            command.save(outputFilePath); // 执行命令并将转换后的视频保存为新文件
        });
    }

    /**
     * 压缩视频文件 - 仅支持MP4格式
     * @param {string} inputFilePath - 输入视频文件的路径
     * @param {string} outputFilePath - 输出视频文件的路径
     * @returns {Promise<string>} 压缩后的视频文件路径
     */
    static async compressVideo(inputFilePath: string, outputFilePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            ffmpeg(inputFilePath)
                .outputOptions([
                    '-vf scale=640:-2', // 设置输出视频的宽度为640px，高度自动调整保持比例
                    '-b:v 800k', // 设置视频比特率
                    '-c:a aac', // 设置音频编解码器
                    '-b:a 128k', // 设置音频比特率
                ])
                .on('end', () => {
                    console.log('Compression finished successfully');
                    resolve(outputFilePath);
                })
                .on('error', err => {
                    console.log('Compression err:', err);
                    reject(err);
                })
                .save(outputFilePath);
        });
    }
}
