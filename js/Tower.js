/**
 * Tower.js：防御塔
 * 构造函数参数为：Phaser.scene，x，y
 * 功能：
 * - 搜索范围内的敌人
 * - 定时发射子弹
 */
import Bullet from './Bullet.js';
import { TOWER_TYPE, SPRITE_TYPE } from './Constants.js';
import GameEntity from './Base/GameEntity.js';
import EntityConfig from './Config/EntityConfig.js';

export default class Tower extends GameEntity {
    constructor(scene, x, y) {
        const config = EntityConfig.tower;
        super(scene, x, y, 'tower', {
            hp: config.hp,
            maxHp: config.maxHp,
            enableLogging: config.enableLogging,
            entityName: config.entityName
        });

        this.spriteType = SPRITE_TYPE.BUILDING;
        this.buildType = TOWER_TYPE.BASIC;
        this.scene = scene;
        this.range = config.range;// 攻击范围
        this.fireRate = config.fireRate;// 攻击间隔（毫秒）
        this.lastFired = 0;// 上次攻击时间
    }

    update(time, delta) {
        // 是否到了可以攻击的时间
        if (time > this.lastFired + this.fireRate) {
            // 通过游戏对象管理器找最近的敌人
            const target = this.scene.gameObjectManager.getEnemyInRange(this.x, this.y, this.range);
            if (target) {
                // 通过游戏对象管理器创建子弹
                this.scene.gameObjectManager.createBullet(this.x, this.y, target);
                this.lastFired = time;
            }
        }
    }

}
