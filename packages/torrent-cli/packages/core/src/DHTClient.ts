import dgram from 'dgram'
import { randomBytes } from 'crypto'
import bencode from 'bencode'

class DHTClient {
    private infoHash: string
    private onTorrentFound: Function
    private client: dgram.Socket
    private nodes: any[]
    private transactionId: Buffer

    /**
     * @param {string} infoHash Torrent 的 infoHash
     * @param {function} onTorrentFound 当找到 torrent 信息时触发的回调函数
     */
    constructor(infoHash: string, onTorrentFound: Function) {
        this.infoHash = infoHash
        this.onTorrentFound = onTorrentFound
        this.client = dgram.createSocket('udp4')
        this.nodes = [] // 用于存储已知的 DHT 节点
        this.transactionId = randomBytes(2)
        this.bindEvents()
    }

    /**
     * 绑定 UDP 客户端事件
     */
    bindEvents() {
        this.client.on('message', (msg, rinfo) => this.onMessage(msg, rinfo))
    }

    /**
     * 启动 DHT 客户端
     */
    start() {
        this.client.bind(6881, () => {
            console.log('DHT 客户端启动')
            // 添加至少一个知名的 DHT 节点，用于引导 DHT 网络
            this.queryDHTNode({ address: 'router.bittorrent.com', port: 6881 })
        })
    }

    /**
     * 向指定的 DHT 节点发送查询消息
     *
     * @param {object} node 目标 DHT 节点，包含 address 和 port 属性
     */
    queryDHTNode(node: { address: any; port: any }) {
        // 构建 DHT 查询消息
        const query = {
            t: this.transactionId.toString('hex'),
            y: 'q',
            q: 'get_peers',
            a: { id: randomBytes(20), info_hash: Buffer.from(this.infoHash, 'hex') },
        }

        const message = bencode.encode(query)
        this.client.send(message, 0, message.length, node.port, node.address)
    }

    /**
     * 处理接收到的 DHT 消息
     *
     * @param {Buffer} msg 接收到的消息
     * @param {object} rinfo 消息发送者的信息
     */
    onMessage(msg: Buffer, rinfo: Object) {
        const response = bencode.decode(msg)

        // 确保是一个响应消息，并且事务 ID 匹配
        if (response.y !== 'r' || response.t !== this.transactionId.toString('hex')) {
            return
        }

        // 如果找到 peers（种子），则触发回调
        if (response.r && response.r.values) {
            this.onTorrentFound(response.r.values)
        }

        // 如果有 nodes 信息，则继续在 DHT 网络中搜索
        if (response.r && response.r.nodes) {
            // 处理 nodes 信息，继续查找...
        }
    }
}

export default DHTClient
