import webTorrent, { Torrent } from 'webtorrent'
import { FileTypeResult, fileTypeFromStream } from 'file-type'
import fs, { ReadStream } from 'fs'
import path from 'path'

class TorrentMain {
    private static instance: TorrentMain
    private link: string
    private pwd: string
    private outDir: string
    private client: webTorrent.Instance

    /**
     * 私有构造函数，初始化 TorrentMain 实例
     *
     * @param link - 磁力链接或者 torrent 文件的 URL
     * @param pwd - 如果文件是压缩包，用于解压的密码
     * @param outDir - 文件下载的输出目录
     */
    private constructor(link: string, pwd: string, outDir: string) {
        this.link = link
        this.pwd = pwd
        this.outDir = path.join(outDir, 'downloads')
        this.client = webTorrent()
    }

    /**
     * 获取 TorrentMain 的单例
     *
     * @param link - 磁力链接或者 torrent 文件的 URL
     * @param pwd - 如果文件是压缩包，用于解压的密码
     * @param outDir - 文件下载的输出目录
     * @returns 返回 TorrentMain 的单例
     */
    public static getInstance(link: string, pwd: string, outDir: string): TorrentMain {
        if (!TorrentMain.instance) {
            TorrentMain.instance = new TorrentMain(link, pwd, outDir)
        }

        return TorrentMain.instance
    }

    /**
     * 开始下载 torrent
     *
     * @param callback - 下载完成后的回调函数
     */
    public download(callback: (torrent: Torrent) => void): void {
        this.client.add(this.link, { path: this.outDir }, (torrent: Torrent) => {
            torrent.on('done', () => {
                console.log('Torrent download finished')
                callback(torrent)
            })

            // 这里可以添加其他的事件监听器，例如用于跟踪下载进度的监听器等
            torrent.on('download', (bytes: number) => {
                console.log('just downloaded: ' + bytes)
                console.log('total downloaded: ' + torrent.downloaded)
                console.log('download speed: ' + torrent.downloadSpeed)
                console.log('progress: ' + torrent.progress)
            })
        })
    }

    /**
     * 处理下载的文件
     *
     * @param filePath - 下载文件的路径
     * @param callback - 文件处理完成后的回调函数
     */
    public async processFile(filePath: fs.PathLike, callback: (type: FileTypeResult | undefined, stream: ReadStream) => void) {
        const stream = fs.createReadStream(filePath)
        const type = await fileTypeFromStream(stream)
        // 这里可以添加你的文件处理逻辑
        // 例如解压缩、处理图片或视频等
        callback(type, stream)
    }

    /**
     * 获取 torrent 的链接
     * @returns 返回 torrent 的链接
     */
    public get torrentLink(): string {
        return this.link
    }

    /**
     * 获取 torrent 的密码
     * @returns 返回 torrent 的密码
     *
     */
    public get torrentPwd(): string {
        return this.pwd
    }

    /**
     * 获取 torrent 的输出目录
     * @returns 返回 torrent 的输出目录
     *
     */
    public get torrentOutDir(): string {
        return this.outDir
    }
}

export default TorrentMain
