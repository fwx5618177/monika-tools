import { AnalyzeDataPlugin } from './AnalyzeDataPlugin';
import { FetchDataPlugin } from './FetchDataPlugin';
import { HelpPlugin } from './HelpPlugin';
import { NotifyPlugin } from './NotifyPlugin';
import { RealTimePlugin } from './RealTimePlugin';
import { ReceiveMessagePlugin } from './ReceiveMessagePlugin';
import { SendMessagePlugin } from './SendMessagePlugin';
import { StartPlugin } from './StartPlugin';

export const pluginList = [
    {
        name: 'start',
        command: '/start',
        plugin: new StartPlugin(),
        description: 'Start the bot',
    },
    {
        name: 'help',
        command: '/help',
        plugin: new HelpPlugin(),
        description: 'Get help',
    },
    {
        name: 'fetchData',
        command: '/fetchData',
        plugin: new FetchDataPlugin(),
        description: 'Fetch data',
    },
    {
        name: 'analyzeData',
        command: '/analyzeData',
        plugin: new AnalyzeDataPlugin(),
        description: 'Analyze data',
    },
    {
        name: 'notify',
        command: '/notify',
        plugin: new NotifyPlugin(),
        description: 'Notify',
    },
    {
        name: 'realTime',
        command: '/realTime',
        plugin: new RealTimePlugin(),
        description: 'Real time data',
    },
    {
        name: 'send',
        command: '/send',
        plugin: new SendMessagePlugin(),
        description: 'Send message',
    },
    {
        name: 'receiveMessage',
        command: '/message',
        plugin: new ReceiveMessagePlugin(),
        description: 'Receive message',
    },
];
