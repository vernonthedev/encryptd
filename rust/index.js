const { join } = require('path');

const PLATFORM_BINARIES = {
  'win32-x64': 'encryptd.win32-x64-msvc.node',
  'darwin-x64': 'encryptd.darwin-x64.node',
  'darwin-arm64': 'encryptd.darwin-arm64.node',
  'linux-x64': 'encryptd.linux-x64-gnu.node',
};

const key = process.platform + '-' + process.arch;
const filename = PLATFORM_BINARIES[key];
if (!filename) throw new Error('[RustLib] Unsupported platform: ' + key);

module.exports = require(join(__dirname, filename));
