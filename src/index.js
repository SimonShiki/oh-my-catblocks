const ClipCC = require('clipcc-extension');
const userscript = require('./userscript.js');
const gui = ClipCC.API.getGuiInstance();
const vm = ClipCC.API.getVmInstance();
const block = ClipCC.API.getBlockInstance();

class ScriptLoader extends ClipCC.Extension {
    async onInit() {
        try {
            await userscript.default(vm, block);
        } catch (e) {
            alert("Load Error:"+e);
        }
    }
}

module.exports = ScriptLoader;
