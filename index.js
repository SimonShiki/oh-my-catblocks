const { Extension, api } = require('clipcc-extension');
const userscript = require('./userscript.js');

class Loader extends Extension {
    async onInit() {
        const vm = api.getVmInstance();
        const block = api.getBlockInstance();
        this.originalSvgData = {
            START_HAT_HEIGHT: block.BlockSvg.START_HAT_HEIGHT,
            START_HAT_PATH: block.BlockSvg.START_HAT_PATH,
            TOP_LEFT_CORNER_DEFINE_HAT: block.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT,
            originalRenderDraw: block.BlockSvg.prototype.renderDraw_,
            originalDispose: block.BlockSvg.prototype.dispose,
            originalSetGlowStack: block.BlockSvg.prototype.setGlowStack,

        }
        console.log('original svg', this.originalSvgData);
        try {
            await userscript.default(vm, block);
            console.log('Enabled!', block.BlockSvg);
        } catch (e) {
            alert('Load Error:'+e);
        }
    }

    onUninit() {
        const block = api.getBlockInstance();

        block.BlockSvg.START_HAT_HEIGHT = this.originalSvgData.START_HAT_HEIGHT;
        block.BlockSvg.START_HAT_PATH = this.originalSvgData.START_HAT_PATH;
        block.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT = this.originalSvgData.TOP_LEFT_CORNER_DEFINE_HAT;
        block.BlockSvg.prototype.renderDraw_ = this.originalSvgData.originalRenderDraw;
        block.BlockSvg.prototype.dispose = this.originalSvgData.originalDispose;
        block.BlockSvg.prototype.setGlowStack = this.originalSvgData.originalSetGlowStack;

        // refresh workspace
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
