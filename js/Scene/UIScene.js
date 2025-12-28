/**
UIScene.js：负责游戏界面UI的场景
- 提供建造和拆除按钮，切换GameScene的建造模式
- 其他所有通过UI对GameScene的操作均通过此场景进行，比如后续的金钱、升级、建造种类等
*/
import { BUILD_MODE, TOWER_TYPE } from '../Constants.js';
import AssetConfig from '../Config/AssetConfig.js';

export default class UIScene extends Phaser.Scene {
    constructor(gameContext) {
        super({ key: 'UIScene', active: true });
        this.gameContext = gameContext;
    }

    preload() {
        this.load.image('btnBuild', AssetConfig.ui.btnBuild);
        this.load.image('btnRemove', AssetConfig.ui.btnRemove);
    }

    create() {
        const buildBtn = this.add.image(this.cameras.main.width - 100, 80, 'btnBuild')
            .setInteractive()
            .setScrollFactor(0); // 🔒 不跟随 camera

        buildBtn.on('pointerdown', () => {
            console.log('选择建造模式');
            this.gameContext.setBuildMode(BUILD_MODE.BUILD);
        });

        const removeBtn = this.add.image(this.cameras.main.width - 100, 160, 'btnRemove')
            .setInteractive()
            .setScrollFactor(0);

        removeBtn.on('pointerdown', () => {
            console.log('选择拆除模式');
            this.gameContext.setBuildMode(BUILD_MODE.REMOVE);
        });
    }
}
