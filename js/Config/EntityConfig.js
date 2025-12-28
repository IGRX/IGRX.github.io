/**
 * EntityConfig.js：实体配置
 * 包含所有游戏实体的属性配置
 */

export default {
    // 防御塔配置
    tower: {
        hp: 200,
        maxHp: 200,
        range: 150,        // 攻击范围（像素）
        fireRate: 1000,   // 攻击间隔（毫秒）
        enableLogging: true,
        entityName: '塔'
    },

    // 敌人配置
    enemy: {
        hp: 100,
        maxHp: 100,
        speed: 100,        // 移动速度（像素/秒）
        damage: 50,        // 造成的伤害
        enableLogging: false,
        entityName: '敌人'
    },

    // HQ配置
    hq: {
        hp: 500,
        maxHp: 500,
        health: 5,         // 每次恢复生命值
        fireRate: 5000,    // 回血间隔（毫秒）
        enableLogging: true,
        entityName: 'HQ'
    },

    // 子弹配置
    bullet: {
        speed: 200,        // 飞行速度（像素/秒）
        damage: 25,        // 伤害值
    }
};

