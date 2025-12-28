/**
 * MapManager.js：地图管理器
 * 职责：
 * - 管理 Tilemap 与地形数据
 * - 提供 Tile 查询与可建造判断
 * - 封装逻辑坐标 ↔ 世界坐标转换
 *
 * 不负责：
 * - 实体创建 / 销毁
 * - 输入处理
 * - 游戏规则决策
 * 
 *  @param {Phaser.Scene} scene
 *  Phaser 场景，仅用于访问框架能力（非业务依赖）
 *  @param {userConfig} MapConfig 预留用户自定义地图配置，覆盖默认配置，一般不动
 */
import { TERRAIN } from '../Constants.js';
import MapConfig from '../Config/MapConfig.js';

export default class MapManager {
    constructor(scene, userConfig = {}) {
        this.scene = scene;
        
        // 地图配置（合并用户配置和默认配置）
        this.tileSize = userConfig.tileSize || MapConfig.tileSize;
        this.terrainData = userConfig.terrainData || MapConfig.terrainData;
        this.path = userConfig.path || MapConfig.path;
        this.tilesetKey = userConfig.tilesetKey || MapConfig.tilesetKey;

        // 地图对象（将在 createMap 中初始化）
        this.map = null;
        this.groundLayer = null;

        // 创建地图
        this.createMap();
    }

    /**
     * 获取HQ位置（逻辑坐标）
     */
    getHQPosition() {
        return MapConfig.hqPosition;
    }

    /**
     * 创建地图
     */
    createMap() {
        // 1. 创建 Tilemap 对象
        this.map = this.scene.make.tilemap({
            data: this.terrainData,
            tileWidth: this.tileSize,
            tileHeight: this.tileSize
        });

        // 2. 关联 Tileset 图像
        const tileset = this.map.addTilesetImage(this.tilesetKey);

        // 3. 创建ground层级，并且手动设置每个Tile的属性
        this.groundLayer = this.map.createLayer(0, tileset, 0, 0);
        this.groundLayer.forEachTile(tile => {
            switch (tile.index) {
                case TERRAIN.BUILDABLE:
                    tile.properties.buildable = true;
                    tile.properties.walkable = false;
                    tile.properties.hasTower = false;
                    break;

                case TERRAIN.ROAD:
                    tile.properties.buildable = false;
                    tile.properties.walkable = true;
                    tile.properties.hasTower = false;
                    break;

                default:
                    tile.properties.buildable = false;
                    tile.properties.walkable = false;
                    tile.properties.hasTower = false;
            }
        });
    }

    /**
     * 判断指定坐标是否可建造
     * @param {Phaser.Tilemaps.Tile} tile
     * @returns {boolean}
     */
    isBuildable(tile) {
        return tile && 
            tile.properties.buildable === true && 
            !tile.properties.hasTower;
    }

    /**
     * 判断指定坐标是否可拆除
     */
    isRemovable(tile) {
        return tile && tile.properties.hasTower === true;
    }

    /**
     * 获取地图宽度（像素）
     */
    getMapWidth() {
        return this.terrainData[0].length * this.tileSize;
    }

    /**
     * 获取地图高度（像素）
     */
    getMapHeight() {
        return this.terrainData.length * this.tileSize;
    }

    /**
     * 获取地图尺寸（像素）
     */
    getMapSize() {
        return {
            width: this.getMapWidth(),
            height: this.getMapHeight()
        };
    }

    /**
     * 将路径点（逻辑坐标）转换为像素坐标
     */
    pathToPixelPath(path) {
        return path.map(p => ({
            x: p.col * this.tileSize + this.tileSize / 2,
            y: p.row * this.tileSize + this.tileSize / 2
        }));
    }

    /**
     * 获取路径的像素坐标版本
     */
    getPixelPath() {
        return this.pathToPixelPath(this.path);
    }

    /**
     * 根据世界坐标获取 Tile
     */
    getTileAtWorldXY(worldX, worldY) {
        return this.groundLayer.getTileAtWorldXY(worldX, worldY);
    }

    /**
     * 根据行列坐标获取 Tile
     */
    getTileAt(col, row) {
        return this.groundLayer.getTileAt(col, row);
    }

    /**
     * 获取 groundLayer（供外部访问）
     */
    getGroundLayer() {
        return this.groundLayer;
    }

    /**
     * 获取 tileSize
     */
    getTileSize() {
        return this.tileSize;
    }

    /**
     * 获取路径点（逻辑坐标）
     */
    getPath() {
        return this.path;
    }
}

