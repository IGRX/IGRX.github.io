/**
 * Constants.js:游戏常量定义
 * 统一管理所有游戏中的常量，避免重复定义
 */

// 地形类型
export const TERRAIN = {
    EMPTY: 0,     // 空白/装饰
    BUILDABLE: 1, // 可建地面
    ROAD: 2,      // 道路
};

// 精灵类型
export const SPRITE_TYPE = {
    ENEMY: 0,     // 敌人
    BUILDING: 1,  // 建筑物（防御塔、HQ）
    BULLET: 2,    // 子弹
};

// 塔类型
export const TOWER_TYPE = {
    BASIC: 0,
    SNIPER: 1,
    CANNON: 2,
};

// 建造模式
export const BUILD_MODE = {
    NONE: 0,
    BUILD: 1,
    REMOVE: 2,
};

