/**
 * Enemy.js：敌人类
 * 构造函数参数为：Phaser.scene，path（路径点数组，格式：[{x, y}, ...]），hq（家对象）
 * 功能：
 * - 沿路径移动
 * - 有血量
 * - 可以被攻击消灭
 */
import { SPRITE_TYPE } from './Constants.js';
import GameEntity from './Base/GameEntity.js';
import EntityConfig from './Config/EntityConfig.js';

export default class Enemy extends GameEntity {
    constructor(scene, path, hardlevel) {
        const config = EntityConfig.enemy;
        // 初始化精灵位置和图片
        super(scene, path[0].x, path[0].y, 'enemy', {
            hp: config.hp,
            maxHp: config.maxHp,
            enableLogging: config.enableLogging,
            entityName: config.entityName
        });

        this.hardlevel = hardlevel; // 难度等级，影响属性，先预留
        this.spriteType = SPRITE_TYPE.ENEMY;
        this.enemyType = 'basicEnemy';
        this.path = path;// 路径点数组
        this.pathIndex = 0;// 当前走到第几个点
        this.speed = config.speed;// 移动速度
        this.damage = config.damage;// 造成的伤害
    }

    update(time, delta) {
        // 如果还没走到终点
        if (this.pathIndex < this.path.length - 1) {
            const target = this.path[this.pathIndex + 1];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 到达当前目标点
            if (dist < 5) {
                this.pathIndex++;
            } else {
                // 按方向向目标点移动
                this.x += (dx / dist) * this.speed * (delta / 1000);
                this.y += (dy / dist) * this.speed * (delta / 1000);
            }
        } else {
            // 走到终点销毁
            this.destroy();
        }
    }
}
