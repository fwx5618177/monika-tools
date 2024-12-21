import inquirer from 'inquirer'
import { QuestionMap, questions } from './options'
import { TorrentMain } from '@torrent-cli/core'
import { Context, PluginInterface } from '../../types/pluginInterface'

export class ParsePlugin implements PluginInterface {
    async prompt<T>(options: any): Promise<T> {
        const answers = await inquirer.prompt(options)

        return answers as T
    }

    async execute(context: Context) {
        const answers = await this.prompt<QuestionMap>(questions)
        context = {
            ...context,
            answers,
        }

        const { link, pwd, outDir } = answers

        // 获取 TorrentMain 的单例
        const torrentMain = TorrentMain.getInstance(link, pwd, outDir)

        console.log({
            torrentMain,
        })
    }
}
