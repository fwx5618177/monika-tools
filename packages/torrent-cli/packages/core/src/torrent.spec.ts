import { Torrent } from './torrent'

// 单例模式
Torrent.instance = null

/**
 * 获取 Torrent 类的实例
 *
 * @param {string} magnet 磁力链接
 * @returns {Torrent} Torrent 类的实例
 */
Torrent.getInstance = function (magnet) {
    if (!this.instance) {
        this.instance = new Torrent(magnet)
    }
    return this.instance
}

module.exports = Torrent
