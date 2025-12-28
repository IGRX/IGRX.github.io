/**
 * CameraController.js：相机控制器
 * 职责：
 * - 相机拖拽、缩放
 * - 屏幕坐标 ↔ 世界坐标转换
 *
 * 输入优先级：
 * - 若判定为相机操作，应阻止后续输入逻辑
 */
import CameraConfig from '../Config/CameraConfig.js';

export default class CameraController {
    constructor(scene, mapWidth, mapHeight, config = {}) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // 相机缩放配置（合并用户配置和默认配置）
        this.minZoom = config.minZoom !== undefined ? config.minZoom : CameraConfig.minZoom;
        this.maxZoom = config.maxZoom !== undefined ? config.maxZoom : CameraConfig.maxZoom;
        this.zoomStep = config.zoomStep !== undefined ? config.zoomStep : CameraConfig.zoomStep;

        // 相机拖拽状态
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.cameraStart = { x: 0, y: 0 };

        // 初始化键盘输入（用于空格键拖拽）
        this.spaceKey = scene.input.keyboard ? scene.input.keyboard.addKey('SPACE') : null;

        // 设置相机边界和初始位置
        this.setupCamera(mapWidth, mapHeight);
        this.setupZoom();
    }

    /**
     * 设置相机边界和初始位置
     */
    setupCamera(mapWidth, mapHeight) {
        this.camera.setBounds(0, 0, mapWidth, mapHeight);
        this.camera.setZoom(1);
        this.camera.centerOn(mapWidth / 2, mapHeight / 2);
    }

    setupZoom() {
        this.scene.input.on('wheel', (pointer, _, __, deltaY) => {
            const zoomDelta = deltaY > 0 ? -0.1 : 0.1;
            const newZoom = Phaser.Math.Clamp(this.camera.zoom + zoomDelta, 0.5, 2);

            const worldPoint = this.camera.getWorldPoint(pointer.x, pointer.y);
            this.camera.setZoom(newZoom);
            this.camera.scrollX = worldPoint.x - pointer.x / newZoom;
            this.camera.scrollY = worldPoint.y - pointer.y / newZoom;
        });
    }

    zoomBy(delta) {
        const cam = this.camera;
        const newZoom = Phaser.Math.Clamp(cam.zoom + delta, 0.5, 2);
        cam.setZoom(newZoom);
    }

    /**
     * 开始拖拽
     */
    startDrag(pointer) {
        this.isDragging = true;
        this.dragStart.x = pointer.x;
        this.dragStart.y = pointer.y;
        this.cameraStart.x = this.camera.scrollX;
        this.cameraStart.y = this.camera.scrollY;
    }

    /**
     * 处理拖拽移动
     */
    drag(pointer) {
        if (!this.isDragging) return;

        const dx = (this.dragStart.x - pointer.x) / this.camera.zoom;
        const dy = (this.dragStart.y - pointer.y) / this.camera.zoom;
        this.camera.setScroll(
            this.cameraStart.x + dx,
            this.cameraStart.y + dy
        );
    }

    /**
     * 停止拖拽
     */
    endDrag() {
        this.isDragging = false;
    }

    /**
     * 获取是否正在拖拽
     */
    getIsDragging() {
        return this.isDragging;
    }

    /**
     * 将屏幕坐标转换为世界坐标
     * @param {number} x
     * @param {number} y
     * @returns {{x:number, y:number}}
     */
    screenToWorld(screenX, screenY) {
        return this.camera.getWorldPoint(screenX, screenY);
    }
}

