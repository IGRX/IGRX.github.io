/**
 * main.js
 * 游戏的全局配置对象，从这里进入
 */
import GameContext from './Context/GameContext.js';
import GameScene from '../js/Scene/GameScene.js';
import UIScene from '../js/Scene/UIScene.js';

const gameContext = new GameContext();

const config = {
    type: Phaser.AUTO,// 自动选择 WebGL 或 Canvas
    width: 1920,// 游戏画布宽度
    height: 1080,// 游戏画布高度，这里正好和64契合，方便做地图
    backgroundColor: '#333',// 背景颜色
    // 物理系统（这里用最简单的 arcade）
    physics: {
        default: 'arcade',
        arcade: { debug: true }, // true 可以看到碰撞框，碰撞框就是图片大小
    },
    // 游戏包含的场景
    scene: [
        new GameScene(gameContext),
        new UIScene(gameContext)
    ],
};
// 创建游戏实例
new Phaser.Game(config);
