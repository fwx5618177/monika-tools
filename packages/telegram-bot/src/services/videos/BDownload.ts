import sanitize from 'sanitize-filename';
import { Stats, existsSync, mkdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { HttpUtil } from 'services/HttpUtil';
import { BApiConfig } from './BApiConfig';
import { VideoProcess } from 'services/VideoProcess';
import { fileURLToPath } from 'url';
import { logger } from 'utils/loggers';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class BDownload {
    public realLink: string = '';

    /**
     * 检测链接是否为bilibili视频的中转链接
     * @param link 链接
     * @returns {boolean} 是否为bilibili视频的中转链接
     */
    isMidLink(link: string): boolean {
        return link.includes('b23.tv');
    }

    /**
     * 获取bilibili视频的真实链接
     * @param link 链接
     * @returns {Promise<string>} 真实链接
     */
    async getRealLink(link: string): Promise<void> {
        const { headers } = await HttpUtil.getRealLocationFromMidLink(link);

        this.realLink = headers['location'] || '';
    }

    /**
     * 获取视频信息
     * @param bvid 视频BV号
     * @returns {Promise<any>} 视频信息
     */
    async getVideoInfo(bvid: string): Promise<any> {
        const url = `${BApiConfig.videoInfo}?bvid=${bvid}`;
        const { data } = await HttpUtil.get(url, {
            headers: {
                Referer: `${BApiConfig.videoReference}${bvid}`,
            },
        });

        return data;
    }

    /**
     * 获取视频下载链接
     * @param cid 视频cid
     * @param bvid 视频BV号
     * @returns {Promise<any>} 视频下载链接
     */
    async getDownloadUrl(cid: string, bvid: string): Promise<any> {
        const url = `${BApiConfig.downloadUrl}?cid=${cid}&bvid=${bvid}`;
        const { data } = await HttpUtil.get(url, {
            headers: {
                Referer: `${BApiConfig.videoReference}${bvid}`,
            },
        });

        return data;
    }

    /**
     * 下载视频
     * @param url 视频链接
     * @param fileName 视频名称
     * @param dest 目录名
     * @param ext 视频格式
     * @returns {Promise<string>} 视频路径
     */
    async downloadVideo(
        url: string,
        fileName: string,
        dest = 'download',
        ext = 'mp4',
    ): Promise<string> {
        const data = await HttpUtil.get(`${url}&type=${ext}`, {
            headers: {
                Referer: BApiConfig.reference,
            },
            responseType: 'stream',
        });

        console.log(`${url}&type=${ext}`);

        const dir = join(__dirname, '../../../', dest);
        const filePath = join(dir, `${fileName}.${ext}`);

        if (!existsSync(dir)) {
            mkdirSync(dir);
        }

        try {
            await VideoProcess.writeBinary2file(data, filePath);
        } catch (error) {
            logger.error('Error occurred while writing the file', error);
        }

        return filePath;
    }

    /**
     * 检测文件是否存在
     * @param fileName 文件名
     * @param dest 目录名
     * @param ext 文件格式
     * @returns {Promise<string>} 返回文件路径
     */
    isFileExist(fileName: string, dest = 'download', ext = 'mp4'): string {
        const dir = join(__dirname, '../../../', dest);
        const filePath = join(dir, `${fileName}.${ext}`);

        if (!existsSync(dir)) {
            mkdirSync(dir);
        }

        if (!existsSync(filePath)) {
            return '';
        }

        return filePath;
    }

    /**
     * 获取本地下载文件的信息
     * @param fileName 文件名
     * @param dest 目录名
     * @param ext 文件格式
     */
    async getFileInfo(fileName: string, dest = 'download', ext = 'mp4'): Promise<Stats> {
        const dir = join(__dirname, '../../../', dest);
        const filePath = join(dir, `${fileName}.${ext}`);

        return statSync(filePath);
    }

    /**
     * 压缩视频文件
     * @param inputFilePath 输入文件路径
     * @returns {Promise<string>} 输出文件路径
     */
    async compressVideo(inputFilePath: string): Promise<string> {
        const outputFilePath = inputFilePath.replace('.mp4', '_compressed.mp4');

        try {
            await VideoProcess.compressVideo(inputFilePath, outputFilePath);
        } catch (error) {
            logger.error('Error occurred while compressing the file', error);
        }

        return outputFilePath;
    }

    /**
     * 检测链接，直接下载视频
     * @param link 链接
     * @param size 视频大小限制
     */
    async getVideo(link: string): Promise<string> {
        if (!link) {
            throw new Error('链接不能为空');
        }

        this.realLink = link;

        if (this.isMidLink(link)) {
            await this.getRealLink(link);
        }

        const bvid = link.match(/BV\w+/)![0];
        const videoInfo = await this.getVideoInfo(bvid);
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cid, aid, title, desc } = videoInfo;
        const downLink = await this.getDownloadUrl(cid, bvid);

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { durl, support_formats } = downLink;
        const { url, size } = durl[0];
        const sizeMb = size / 1024 / 1024;

        // 限制视频大小
        if (sizeMb > 500) {
            logger.error('Size limit exceeded.');
            return '';
        }

        const fileName = sanitize(`${title}-${desc}`);

        // 检查是否存在文件
        const isExist = this.isFileExist(fileName);
        if (isExist) {
            return isExist;
        }

        let filePath = await this.downloadVideo(url, fileName);

        try {
            const fileInfo = await this.getFileInfo(fileName);
            logger.info('File size:', fileInfo.size);

            if (fileInfo.size > 50 * 1024 * 1024) {
                filePath = await this.compressVideo(filePath);
            }
        } catch (error) {
            logger.error('Error occurred while getting file info', error);
        }

        return filePath;
    }
}
