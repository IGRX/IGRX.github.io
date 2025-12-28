/**
 * GameObjectManager.js：游戏对象管理器
 * 职责：
 * - 统一创建与销毁游戏实体
 * - 管理实体集合（Tower / Enemy / Bullet）
 *
 * 设计原则：
 * - Scene 不直接 new 实体
 * - Entity 不自行注册到系统
 */
import Tower from '../Tower.js';
import HQ from '../HQ.js';
import Bullet from '../Bullet.js';

export default class GameObjectManager {
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.ArcadePhysics} physics
     */
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        
        // 初始化对象组
        this.enemies = physics.add.group();  // 敌人组（使用Phaser Group）
        this.towers = [];                    // 防御塔数组
        this.bullets = physics.add.group();  // 子弹组（使用Phaser Group）
        this.hq = null;                      // HQ对象（单个对象）
    }

    /**
     * 初始化HQ
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @returns {HQ} HQ对象
     */
    createHQ(x, y) {
        if (this.hq) {
            console.warn('HQ已经存在，将销毁旧的HQ');
            this.hq.destroy();
        }
        this.hq = new HQ(this.scene, x, y);
        return this.hq;
    }

    /**
     * 获取HQ对象
     * @returns {HQ|null} HQ对象
     */
    getHQ() {
        return this.hq;
    }

    /**
     * 添加敌人到敌人组
     * @param {Enemy} enemy - 敌人对象
     */
    addEnemy(enemy) {
        this.enemies.add(enemy);
        return enemy;
    }

    /**
     * 移除敌人
     * @param {Enemy} enemy - 敌人对象
     */
    removeEnemy(enemy) {
        if (enemy && enemy.active) {
            enemy.destroy();
        }
    }

    /**
     * 获取所有敌人
     * @returns {Phaser.Physics.Arcade.Group} 敌人组
     */
    getEnemies() {
        return this.enemies;
    }

    /**
     * 获取所有活跃的敌人
     * @returns {Array} 活跃敌人数组
     */
    getActiveEnemies() {
        return this.enemies.getChildren().filter(enemy => enemy && enemy.active);
    }

    /**
     * 获取指定范围内的敌人
     * @param {number} x - 世界中心X坐标
     * @param {number} y - 世界中心Y坐标
     * @param {number} range - 范围
     * @returns {Enemy|null} 最近的敌人，如果没有则返回null
     */
    getEnemyInRange(x, y, range) {
        return this.enemies.getChildren().find(enemy => {
            if (!enemy || !enemy.active) return false;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            return dist < range;
        });
    }

    /**
     * 获取所有指定范围内的敌人
     * @param {number} x - 世界中心X坐标
     * @param {number} y - 世界中心Y坐标
     * @param {number} range - 范围
     * @returns {Array} 范围内的敌人数组
     */
    getEnemiesInRange(x, y, range) {
        return this.enemies.getChildren().filter(enemy => {
            if (!enemy || !enemy.active) return false;
            const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            return dist < range;
        });
    }

    /**
     * 尝试在指定 Tile 上建造防御塔
     * @param {Phaser.Tilemaps.Tile} tile
     * @returns {boolean} 是否成功
     */
    tryBuildTower(tile) {
        if (!tile) return false;

        if (tile.properties.hasTower) {
            console.warn('该 Tile 已有防御塔');
            return false;
        }

        if (!tile.properties.buildable) {
            console.warn('该 Tile 不可建造');
            return false;
        }

        const x = tile.getCenterX();
        const y = tile.getCenterY();

        const tower = this.createTower(x, y);

        tile.properties.hasTower = true;
        tile.tower = tower;

        return true;
    }

    /**
     * 尝试拆除指定 Tile 上的防御塔
     * @param {Phaser.Tilemaps.Tile} tile
     * @returns {boolean} 是否成功
     */
    tryRemoveTower(tile) {
        if (!tile || !tile.tower) {
            console.warn('该 Tile 上没有防御塔');
            return false;
        }

        this.removeTower(tile.tower);

        tile.properties.hasTower = false;
        tile.tower = null;

        return true;
    }

    /**
     * 添加防御塔
     * @param {Tower} tower - 防御塔对象
     */
    addTower(tower) {
        this.towers.push(tower);
        return tower;
    }

    /**
     * 创建并添加防御塔
     * @param {number} x - 世界X坐标
     * @param {number} y - 世界Y坐标
     * @returns {Tower} 创建的防御塔对象
     */
    createTower(x, y) {
        const tower = new Tower(this.scene, x, y);
        this.addTower(tower);
        return tower;
    }

    /**
     * 移除防御塔
     * @param {Tower} tower - 防御塔对象
     */
    removeTower(tower) {
        const index = this.towers.indexOf(tower);
        if (index !== -1) {
            this.towers.splice(index, 1);
        }
        if (tower && tower.active) {
            tower.destroy();
        }
    }

    /**
     * 获取所有防御塔
     * @returns {Array} 防御塔数组
     */
    getTowers() {
        return this.towers;
    }

    /**
     * 获取指定位置的防御塔
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} tolerance - 容差（默认5像素）
     * @returns {Tower|null} 防御塔对象，如果没有则返回null
     */
    getTowerAt(x, y, tolerance = 5) {
        return this.towers.find(tower => {
            if (!tower || !tower.active) return false;
            const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
            return dist < tolerance;
        });
    }

    /**
     * 添加子弹到子弹组
     * @param {Bullet} bullet - 子弹对象
     */
    addBullet(bullet) {
        this.bullets.add(bullet);
        return bullet;
    }

    /**
     * 创建并添加子弹
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {Enemy} target - 目标敌人
     * @returns {Bullet} 创建的子弹对象
     */
    createBullet(x, y, target) {
        const bullet = new Bullet(this.scene, x, y, target);
        this.addBullet(bullet);
        return bullet;
    }

    /**
     * 移除子弹
     * @param {Bullet} bullet - 子弹对象
     */
    removeBullet(bullet) {
        if (bullet && bullet.active) {
            bullet.destroy();
        }
    }

    /**
     * 获取所有子弹
     * @returns {Phaser.Physics.Arcade.Group} 子弹组
     */
    getBullets() {
        return this.bullets;
    }

    /**
     * 获取所有活跃的子弹
     * @returns {Array} 活跃子弹数组
     */
    getActiveBullets() {
        return this.bullets.getChildren().filter(bullet => bullet && bullet.active);
    }

    /**
     * 更新所有游戏对象
     * @param {number} time - 游戏时间
     * @param {number} delta - 帧时间差
     */
    update(time, delta) {
        // 更新敌人
        this.enemies.children.iterate(enemy => {
            if (enemy && enemy.active && typeof enemy.update === 'function') {
                enemy.update(time, delta);
            }
        });

        // 更新防御塔
        this.towers.forEach(tower => {
            if (tower && tower.active && typeof tower.update === 'function') {
                tower.update(time, delta);
            }
        });

        // 更新HQ
        if (this.hq && this.hq.active && typeof this.hq.update === 'function') {
            this.hq.update(time, delta);
        }
    }

    /**
     * 清理所有对象
     */
    clearAll() {
        // 清理敌人
        this.enemies.clear(true, true);
        
        // 清理防御塔
        this.towers.forEach(tower => {
            if (tower && tower.active) {
                tower.destroy();
            }
        });
        this.towers = [];
        
        // 清理子弹
        this.bullets.clear(true, true);
        
        // 清理HQ
        if (this.hq && this.hq.active) {
            this.hq.destroy();
        }
        this.hq = null;
    }

    /**
     * 清理所有敌人
     */
    clearEnemies() {
        this.enemies.clear(true, true);
    }

    /**
     * 清理所有防御塔
     */
    clearTowers() {
        this.towers.forEach(tower => {
            if (tower && tower.active) {
                tower.destroy();
            }
        });
        this.towers = [];
    }

    /**
     * 清理所有子弹
     */
    clearBullets() {
        this.bullets.clear(true, true);
    }

    /**
     * 获取所有对象的统计信息
     * @returns {Object} 统计信息对象
     */
    getStats() {
        return {
            enemies: {
                total: this.enemies.getLength(),
                active: this.getActiveEnemies().length
            },
            towers: {
                total: this.towers.length,
                active: this.towers.filter(t => t && t.active).length
            },
            bullets: {
                total: this.bullets.getLength(),
                active: this.getActiveBullets().length
            },
            hq: {
                exists: this.hq !== null,
                active: this.hq && this.hq.active
            }
        };
    }
}

