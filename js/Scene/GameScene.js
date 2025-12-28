/**
 * GameScene.js：游戏主场景
 * 负责：
 * - 加载资源
 * - 初始化各个管理器（相机、地图、输入、碰撞、敌人生成、游戏对象管理）
 * - 协调各个管理器之间的交互
 * - 每一帧更新游戏
 */
import CameraController from '../Managers/CameraController.js';
import MapManager from '../Managers/MapManager.js';
import InputHandler from '../Managers/InputHandler.js';
import EnemySpawner from '../Managers/EnemySpawner.js';
import CollisionManager from '../Managers/CollisionManager.js';
import GameObjectManager from '../Managers/GameObjectManager.js';
import GameConfig from '../Config/GameConfig.js';
import AssetConfig from '../Config/AssetConfig.js';

export default class GameScene extends Phaser.Scene {
    constructor(gameContext) {
        super('GameScene');
        this.gameContext = gameContext;
        this.buildMode = this.gameContext.getBuildMode();
        this.hardlevel = GameConfig.initialHardlevel;//预留难度等级变量，未来可以用来调整敌人属性等
    }

    // preload：预加载加载图片、音频等资源，只在游戏开始时执行一次
    preload() {
        // 加载游戏图片资源
        this.load.image('enemy', AssetConfig.images.enemy);
        this.load.image('tower', AssetConfig.images.tower);
        this.load.image('bullet', AssetConfig.images.bullet);
        this.load.image('tileset', AssetConfig.images.tileset);
        this.load.image('hq', AssetConfig.images.hq);
    }

    //create：初始化游戏对象,在 preload 之后执行一次
    create() {
        // 初始化地图管理器
        this.mapManager = new MapManager(this);

        // 设置相机边界和缩放
        const mapSize = this.mapManager.getMapSize();
        
        // 初始化相机控制器
        this.cameraController = new CameraController(this, mapSize.width, mapSize.height);

        // 初始化游戏对象管理器
        this.gameObjectManager = new GameObjectManager(this, this.physics);
        
        // 创建HQ（使用配置中的位置）
        const hqPos = this.mapManager.getHQPosition();
        const hqTile = this.mapManager.getTileAt(hqPos.col, hqPos.row);
        this.gameObjectManager.createHQ(hqTile.getCenterX(), hqTile.getCenterY());
        
        // 初始化输入处理器并添加额外指针，给移动端缩放用。
        // Phaser.Scene自带input成员，类继承自Phaser.Input.InputPlugin，每个Scene默认有两个指针：mousePointer 和 pointer1，所以为了移动端两指缩放还得加一个pointer2，最大可以存在10个pointer
        this.inputHandler = new InputHandler(this, this.cameraController, this.mapManager, this.gameObjectManager, this.gameContext);
        this.input.addPointer(1);
        
        // 初始化碰撞检测管理器
        this.collisionManager = new CollisionManager(this, this.physics);
        
        // 注册碰撞检测
        this.collisionManager.registerEnemyHQCollision(
            this.gameObjectManager.getEnemies(), 
            this.gameObjectManager.getHQ()
        );

        // 初始化敌人生成器
        this.enemySpawner = new EnemySpawner(this, this.mapManager, this.gameObjectManager, {
            spawnDelay: GameConfig.enemySpawn.spawnDelay,
            hardlevel: this.hardlevel
        });
        
        // 开始生成敌人
        this.enemySpawner.start();

    }

    //update：每一帧都会执行（Phaser默认跑60帧，即每秒调用update60次，time为自游戏开始时的毫秒计时器，delta为两帧之间的时间差，一般都稳定在16.66毫秒）
    update(time, delta) {
        const hq = this.gameObjectManager.getHQ();
        if (hq && hq.hp <= 0) {
            console.log('游戏结束！HQ被摧毁');
            this.scene.pause();
            return;
        }
        // 通过游戏对象管理器更新所有对象
        this.gameObjectManager.update(time, delta);
    }
}
