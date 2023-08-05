import * as run from './src/runner';
import * as os from './src/ostype';
import init from './src/init';

import couleurmdr from 'colors';

console.log(couleurmdr.red('[INFO] Starting'));

async function __main__() {
    let currentOS = os.detect();

    if (currentOS === 1) {
        init(await run.Linux());
    } else if (currentOS === 2) {
        await run.macOS();
    } else if (currentOS === 3) {
        await run.Windows();
    };
};

__main__();

process.on('unhandledRejection', console.error);