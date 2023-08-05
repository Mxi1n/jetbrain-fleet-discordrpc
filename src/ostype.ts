import couleurmdr from 'colors';
import process from 'node:process';

export function detect() {
    var opsys = process.platform;
    console.log(couleurmdr.red('[INFO] Detected platform: '+ opsys));

    if (opsys == "darwin") {
        return 2;
    } else if (opsys == "win32") {
        return 3;
    } else if (opsys == "linux") {
        return 1;
    };
};