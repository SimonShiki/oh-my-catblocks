const { Extension, type, api } = require('clipcc-extension');
const userscript = require('./userscript.js');

class Loader extends Extension {
    async onInit() {
        const vm = api.getVmInstance();
        const block = api.getBlockInstance();
        try {
            await userscript.default(vm, block);
        } catch (e) {
            alert('Load Error:'+e);
        }
    }
}

module.exports = Loader;
