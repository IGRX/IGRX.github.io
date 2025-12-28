/**
 * CollisionManager.js：碰撞检测管理器
 * 负责管理游戏中的所有碰撞检测：
 * - 注册碰撞检测
 * - 处理碰撞回调
 * - 统一管理碰撞逻辑
 */
import { SPRITE_TYPE } from '../Constants.js';

export default class CollisionManager {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        
        // 存储碰撞检测对象（用于后续管理）
        this.collisions = [];
    }

    /**
     * 注册敌人与HQ的碰撞检测
     * @param {Phaser.Physics.Arcade.Group} enemiesGroup - 敌人组
     * @param {HQ} hq - HQ对象
     * @param {Function} callback - 碰撞回调函数
     */
    registerEnemyHQCollision(enemiesGroup, hq, callback) {
        const collision = this.physics.add.overlap(
            enemiesGroup,
            hq,
            (a, b) => {
                // 确定哪个是敌人，哪个是HQ
                const enemy = a.spriteType === SPRITE_TYPE.ENEMY ? a : b;
                const hqObj = a.spriteType === SPRITE_TYPE.BUILDING ? a : b;
                
                // 调用回调函数
                if (callback) {
                    callback(enemy, hqObj);
                } else {
                    // 默认处理：HQ受到伤害，敌人被销毁
                    this.handleEnemyHitHQ(enemy, hqObj);
                }
            },
            null,
            this.scene
        );
        
        this.collisions.push({
            type: 'enemy-hq',
            collision: collision
        });
        
        return collision;
    }

    /**
     * 注册子弹与敌人的碰撞检测
     * @param {Phaser.Physics.Arcade.Group} bulletsGroup - 子弹组
     * @param {Phaser.Physics.Arcade.Group} enemiesGroup - 敌人组
     * @param {Function} callback - 碰撞回调函数
     */
    registerBulletEnemyCollision(bulletsGroup, enemiesGroup, callback) {
        const collision = this.physics.add.overlap(
            bulletsGroup,
            enemiesGroup,
            (bullet, enemy) => {
                // 调用回调函数
                if (callback) {
                    callback(bullet, enemy);
                } else {
                    // 默认处理：敌人受到伤害，子弹被销毁
                    this.handleBulletHitEnemy(bullet, enemy);
                }
            },
            null,
            this.scene
        );
        
        this.collisions.push({
            type: 'bullet-enemy',
            collision: collision
        });
        
        return collision;
    }

    /**
     * 注册自定义碰撞检测
     * @param {Object|Group} object1 - 第一个对象或组
     * @param {Object|Group} object2 - 第二个对象或组
     * @param {Function} callback - 碰撞回调函数
     * @param {Function} processCallback - 可选的碰撞处理函数
     * @param {Object} context - 回调上下文
     * @param {string} type - 碰撞类型标识（用于管理）
     */
    registerCollision(object1, object2, callback, processCallback = null, context = null, type = 'custom') {
        const collision = this.physics.add.overlap(
            object1,
            object2,
            callback,
            processCallback,
            context || this.scene
        );
        
        this.collisions.push({
            type: type,
            collision: collision
        });
        
        return collision;
    }

    /**
     * 默认处理：敌人击中HQ
     * @param {Enemy} enemy - 敌人对象
     * @param {HQ} hq - HQ对象
     */
    handleEnemyHitHQ(enemy, hq) {
        hq.takeDamage(enemy.damage);
        enemy.destroy();
    }

    /**
     * 默认处理：子弹击中敌人
     * @param {Bullet} bullet - 子弹对象
     * @param {Enemy} enemy - 敌人对象
     */
    handleBulletHitEnemy(bullet, enemy) {
        enemy.takeDamage(bullet.damage);
        bullet.destroy();
    }

    /**
     * 移除指定类型的碰撞检测
     * @param {string} type - 碰撞类型
     */
    removeCollision(type) {
        this.collisions = this.collisions.filter(item => {
            if (item.type === type) {
                // 如果碰撞对象有 remove 方法，调用它
                if (item.collision && typeof item.collision.remove === 'function') {
                    item.collision.remove();
                }
                return false;
            }
            return true;
        });
    }

    /**
     * 移除所有碰撞检测
     */
    removeAllCollisions() {
        this.collisions.forEach(item => {
            if (item.collision && typeof item.collision.remove === 'function') {
                item.collision.remove();
            }
        });
        this.collisions = [];
    }

    /**
     * 获取所有碰撞检测
     * @returns {Array} 碰撞检测数组
     */
    getCollisions() {
        return this.collisions;
    }
}

