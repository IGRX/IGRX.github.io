/**
 * HQ.js：家
 * 构造函数参数为：Phaser.scene，x，y
 * 功能：
 * - 这还需要介绍吗
 */
import { SPRITE_TYPE } from './Constants.js';
import GameEntity from './Base/GameEntity.js';
import EntityConfig from './Config/EntityConfig.js';

export default class HQ extends GameEntity {
    constructor(scene, x, y) {
        const config = EntityConfig.hq;
        super(scene, x, y, 'hq', {
            hp: config.hp,
            maxHp: config.maxHp,
            enableLogging: config.enableLogging,
            entityName: config.entityName
        });

        this.setImmovable(true);

        this.spriteType = SPRITE_TYPE.BUILDING;
        this.buildType = 'hq';
        this.health = config.health;// 每次恢复生命值
        this.fireRate = config.fireRate;// 回血间隔（毫秒）
        this.lastFired = 0;// 上次攻击时间
    }

    update(time, delta) {
        // 是否到了可以回血的时间
        if (time > this.lastFired + this.fireRate) {
            if (this.hp < this.maxHp) {
                this.heal(this.health);
            }
            this.lastFired = time;
        }
    }
}
