/**
 * InputHandler.js：输入处理器
 * 职责：
 * - 解析用户输入（鼠标 / 触控）
 * - 协调 CameraController（拖拽 / 缩放）
 * - 将输入转化为“高层游戏意图”
 *
 * 不负责：
 * - 实体创建 / 销毁
 * - Tile 状态修改
 * - 游戏规则判断
 * 
 * 具体的执行逻辑交给 GameObjectManager 和 MapManager，我们只负责“意图识别”然后发出指令。虽然看起来是包揽职责，但是实际上是职责分离。
 * 
 */
import { BUILD_MODE } from '../Constants.js';


const DRAG_THRESHOLD_MOUSE = 10; // 像素，纯经验值，一般微小的抖动就在10个像素左右，超过就算拖拽
const DRAG_THRESHOLD_TOUCH = 20; // 触控时抖动会更大一些，直接给一倍吧

export default class InputHandler {
    /**
     * @param {Phaser.Scene} scene
     * @param {CameraController} cameraController
     * @param {MapManager} mapManager
     * @param {GameObjectManager} gameObjectManager
     * @param {GameContext} gameContext
     */
    constructor(scene, cameraController, mapManager, gameObjectManager, gameContext) {
        this.scene = scene;
        this.cameraController = cameraController;
        this.mapManager = mapManager;
        this.gameObjectManager = gameObjectManager;
        this.gameContext = gameContext;

        this.pointerDownPos = null;
        this.isDragging = false;

        // 多指触控相关
        this.activePointers = new Set();
        this.isPinching = false;
        this.lastPinchDistance = 0;

        // 注册输入事件
        this.setupInput();

    }

    setupInput() {
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
    }

    onPointerDown(pointer) {
        this.activePointers.add(pointer.id);

        if (this.activePointers.size >= 2) {//判断是否为多指操作
            this.isPinching = true;
            this.cameraController.endDrag();
            return;
        }
        
        console.log('当前input：', this.scene.input);
        console.log('当前pointer触发了onPointerDown：', pointer);
        this.pointerDownPos = { x: pointer.x, y: pointer.y };
        this.isDragging = false;
    }

    onPointerMove(pointer) {
        if (this.isPinching) {
            this.handlePinchZoom();
            return;
        }
        if (!this.pointerDownPos) return;//防炸判断

        const threshold = pointer.wasTouch === false
            ? DRAG_THRESHOLD_MOUSE
            : DRAG_THRESHOLD_TOUCH;

        const dx = pointer.x - this.pointerDownPos.x;
        const dy = pointer.y - this.pointerDownPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (!this.isDragging && dist > threshold) {
            this.isDragging = true;
            this.cameraController.startDrag(pointer);
        }

        if (this.isDragging) {
            this.cameraController.drag(pointer);
        }
    }

    onPointerUp(pointer) {
        this.activePointers.delete(pointer.id);

        if (this.isPinching) {
            if (this.activePointers.size < 2) {
                this.isPinching = false;
                this.lastPinchDistance = 0;
            }
            return;
        }
        if (this.isDragging) {
            this.cameraController.endDrag();
        } else {
            this.handleClick(pointer);
        }

        this.pointerDownPos = null;
        this.isDragging = false;
    }

    handlePinchZoom() {
        const pointers = this.scene.input.pointers.filter(p => p.isDown);
        if (pointers.length < 2) return;

        const [p1, p2] = pointers;

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.hypot(dx, dy);

        if (this.lastPinchDistance === 0) {
            this.lastPinchDistance = distance;
            return;
        }

        const delta = distance - this.lastPinchDistance;
        this.lastPinchDistance = distance;

        this.cameraController.zoomBy(delta * 0.002);
    }

    /**
     * 处理建造/拆除模式
     */
    handleClick(pointer) {
        const world = this.cameraController.screenToWorld(pointer.x, pointer.y);
        const tile = this.mapManager.getTileAtWorldXY(world.x, world.y);
        if (!tile) return;

        const mode = this.gameContext.getBuildMode();

        switch (mode) {
            case BUILD_MODE.BUILD:
                this.gameObjectManager.tryBuildTower(tile);
                this.gameContext.setBuildMode(BUILD_MODE.NONE);
                break;

            case BUILD_MODE.REMOVE:
                this.gameObjectManager.tryRemoveTower(tile);
                this.gameContext.setBuildMode(BUILD_MODE.NONE);
                break;
        }
    }
}

