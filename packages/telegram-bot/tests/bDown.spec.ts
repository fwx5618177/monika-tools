import assert from 'assert';
import { BDownload } from '@services/videos/BDownload';

describe('bDown', () => {
    describe('#getVideo()', function () {
        it('should return the path of the downloaded video', async function () {
            this.timeout(5000);

            const bDownload = new BDownload();
            // 请根据你的环境替换成有效的测试链接
            const link =
                'https://www.bilibili.com/video/BV1rr42147vW/?spm_id_from=333.1007.tianma.1-1-1.click&vd_source=92e9146e5777f4f896dcb9912a9094cf';
            const expectedPath =
                '/Users/fengwenxuan/Desktop/node/telegram-bot/download/第十三集 《不做大师兄了却开始听见心声》-第十三集 《不做大师兄了却开始听见心声》嗨害嗨，我又来了啊！.mp4'; // 请根据你的逻辑定义预期路径

            const resultPath = await bDownload.getVideo(link);
            assert.strictEqual(resultPath, expectedPath);
        });

        it('should throw an error for empty link', async function () {
            const bDownload = new BDownload();
            try {
                await bDownload.getVideo('');
                assert.fail('Expected an error to be thrown');
            } catch (error: any) {
                assert.strictEqual(error.message, '链接不能为空');
            }
        });
    });
});
