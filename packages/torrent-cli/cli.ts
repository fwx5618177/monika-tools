#!/usr/bin/env node

import { Command } from 'commander'
import { version } from './package.json'
import Main from './src/Main'

const program = new Command()
const main = new Main()

program.addHelpText('beforeAll', ``)

program.usage('<command> [options]').description('An enhanced CLI for downloading torrent files, and check the content of them.')
program.version(version, '-v, --version', 'Output the current version of torrent-cli.').name('torrent-cli') // 这里添加你的CLI命令名
program
    .helpOption('-h, --help', 'Display help for commands and options.')
    .addHelpCommand('help [command]', 'Display help for specific command')
    .usage('<command> [options]')
    .description('An enhanced CLI for downloading torrent files, and check the content of them')

// 1. Parse Command
program
    .command('parse')
    .description('Inquirer a specific parse command')
    .action(() => main.execute('parse'))

// Additional Help Information
program.addHelpText(
    'after',
    `Example usage:
        $ torrent-cli parse
    `,
)

// Parse program arguments or show help by default
const args = process.argv
if (args.length <= 2) {
    program.outputHelp() // Show help if no arguments
    process.exit()
}

program.parse(args)
