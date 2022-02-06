const { Extension, api } = require('clipcc-extension');
const userscript = require('./userscript.js');

class Loader extends Extension {
    async onInit() {
        const vm = api.getVmInstance();
        const block = api.getBlockInstance();
        this.originalSvg = block.BlockSvg;
        try {
            await userscript.default(vm, block);
            console.log('Enabled!', block.BlockSvg);
        } catch (e) {
            alert('Load Error:'+e);
        }
    }

    onUninit() {
        const block = api.getBlockInstance();
        block.BlockSvg = this.originalSvg;
        const workspace = block.getMainWorkspace();
        if (workspace) {
            const vm = api.getVmInstance();
            if (vm.editingTarget) {
                vm.emitWorkspaceUpdate();
            }
            const flyout = workspace.getFlyout();
            if (flyout) {
                const flyoutWorkspace = flyout.getWorkspace();
                block.Xml.clearWorkspaceAndLoadFromXml(block.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
                workspace.getToolbox().refreshSelection();
                workspace.toolboxRefreshEnabled_ = true;
            }
        }
        console.log('Disabled!', block.BlockSvg);
    }
}

module.exports = Loader;
