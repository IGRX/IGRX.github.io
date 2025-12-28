/**
 * GameContext.js
 * 全局游戏状态容器（不包含业务逻辑）
 */
import { BUILD_MODE } from '../Constants.js';

export default class GameContext {
    constructor() {
        this._buildMode = BUILD_MODE.NONE;
        this._selectedTowerType = null;
        this._paused = false;
    }

    /* ---------------- 建造模式 ---------------- */

    getBuildMode() {
        return this._buildMode;
    }

    setBuildMode(mode) {
        this._buildMode = mode;
    }

    /* ---------------- 塔类型 ---------------- */

    getSelectedTowerType() {
        return this._selectedTowerType;
    }

    setSelectedTowerType(type) {
        this._selectedTowerType = type;
    }

    /* ---------------- 游戏状态 ---------------- */

    isPaused() {
        return this._paused;
    }

    setPaused(value) {
        this._paused = value;
    }
}
