/**
 * EnemySpawner.js：敌人生成器
 * 职责：
 * - 管理敌人生成节奏
 * - 不参与战斗逻辑
 *
 * 说明：
 * - EnemySpawner 不关心敌人是否死亡
 * - 只负责“何时生成、生成什么”
 */
import Enemy from '../Enemy.js';

export default class EnemySpawner {
    constructor(scene, mapManager, gameObjectManager, config = {}) {
        this.scene = scene;
        this.mapManager = mapManager;
        this.gameObjectManager = gameObjectManager;

        // 生成配置
        this.spawnDelay = config.spawnDelay || 2000; // 生成间隔（毫秒）
        this.hardlevel = config.hardlevel || 1; // 难度等级
        this.isSpawning = false; // 是否正在生成

        // 定时器事件（将在 start 中初始化）
        this.spawnTimer = null;
    }

    /**
     * 开始生成敌人
     */
    start() {
        if (this.isSpawning) {
            return; // 已经在生成中
        }

        this.isSpawning = true;
        
        // 定时器，按配置的间隔生成敌人
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.spawnDelay,
            callback: () => {
                this.spawnEnemy();
            },
            loop: true,
        });
    }

    /**
     * 停止生成敌人
     */
    stop() {
        if (!this.isSpawning) {
            return;
        }

        this.isSpawning = false;
        
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
    }

    /**
     * 生成一个敌人
     */
    spawnEnemy() {
        // 获取路径的像素坐标版本
        const pixelPath = this.mapManager.getPixelPath();
        
        // 创建敌人并添加到游戏对象管理器
        const enemy = new Enemy(this.scene, pixelPath, this.hardlevel);
        this.gameObjectManager.addEnemy(enemy);
    }

    /**
     * 设置生成间隔
     * @param {number} delay - 生成间隔（毫秒）
     */
    setSpawnDelay(delay) {
        this.spawnDelay = delay;
        
        // 如果正在生成，重启定时器
        if (this.isSpawning) {
            this.stop();
            this.start();
        }
    }

    /**
     * 设置难度等级
     * @param {number} hardlevel - 难度等级
     */
    setHardlevel(hardlevel) {
        this.hardlevel = hardlevel;
    }

    /**
     * 获取是否正在生成
     * @returns {boolean}
     */
    getIsSpawning() {
        return this.isSpawning;
    }

    /**
     * 立即生成一个敌人（用于测试或特殊事件）
     */
    spawnEnemyNow() {
        this.spawnEnemy();
    }
}

