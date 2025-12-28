/**
 * Bullet.js：子弹
 * 构造函数参数为：Phaser.scene，x，y，Enemy:target（目标敌人对象）
 * 功能：
 * - 飞向敌人
 * - 命中后造成伤害
 */
import { SPRITE_TYPE } from './Constants.js';
import EntityConfig from './Config/EntityConfig.js';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, target) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const config = EntityConfig.bullet;
        this.spriteType = SPRITE_TYPE.BULLET;
        this.bulletType = 'basicBullet';
        this.target = target;
        this.speed = config.speed;// 飞行速度
        this.damage = config.damage;// 伤害值
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // 目标没了，子弹消失
        if (!this.target || !this.target.active) {
            this.destroy();
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 命中敌人
        if (dist < 5) {
            this.target.takeDamage(this.damage);
            this.destroy();
        } else {
            // 向敌人移动
            this.x += (dx / dist) * this.speed * (delta / 1000);
            this.y += (dy / dist) * this.speed * (delta / 1000);
        }
    }
}
