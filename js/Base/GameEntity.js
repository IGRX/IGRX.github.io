/**
 * GameEntity.js：游戏实体基类
 * 提供所有游戏实体的共同功能：
 * - 生命值管理
 * - 伤害处理
 * - 基础属性
 */
export default class GameEntity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config = {}) {
        super(scene, x, y, texture);
        
        // 添加到场景
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 生命值配置
        this.maxHp = config.maxHp || config.hp || 100;
        this.hp = config.hp || this.maxHp;
        
        // 其他配置
        this.enableLogging = config.enableLogging !== undefined ? config.enableLogging : false;
        this.entityName = config.entityName || 'Entity';
    }

    /**
     * 受到伤害
     * @param {number} dmg - 伤害值
     */
    takeDamage(dmg) {
        this.hp -= dmg;
        
        if (this.enableLogging) {
            console.log(`${this.entityName}受到伤害:`, dmg, '当前HP:', this.hp);
        }
        
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    /**
     * 恢复生命值
     * @param {number} amount - 恢复量
     */
    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
        
        if (this.enableLogging) {
            console.log(`${this.entityName}恢复生命值:`, amount, '当前HP:', this.hp);
        }
    }

    /**
     * 设置生命值
     * @param {number} hp - 生命值
     */
    setHp(hp) {
        this.hp = Phaser.Math.Clamp(hp, 0, this.maxHp);
    }

    /**
     * 设置最大生命值
     * @param {number} maxHp - 最大生命值
     */
    setMaxHp(maxHp) {
        this.maxHp = maxHp;
        if (this.hp > this.maxHp) {
            this.hp = this.maxHp;
        }
    }

    /**
     * 获取生命值百分比
     * @returns {number} 0-1 之间的值
     */
    getHpPercent() {
        return this.maxHp > 0 ? this.hp / this.maxHp : 0;
    }

    /**
     * 是否存活
     * @returns {boolean}
     */
    isAlive() {
        return this.hp > 0 && this.active;
    }
}

