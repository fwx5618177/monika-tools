export const questions = [
    {
        type: 'input',
        name: 'link',
        message: '请输入磁力链接或 torrent 文件的 URL:',
    },
    {
        type: 'password',
        name: 'pwd',
        message: '如果文件是压缩包，请输入用于解压的密码:',
    },
    {
        type: 'input',
        name: 'outDir',
        message: '请输入文件下载的输出目录:',
        default: './downloads',
    },
] as const

type Question = typeof questions
export type QuestionNames = Question[number]['name']
export type QuestionMap = Record<QuestionNames, any>
