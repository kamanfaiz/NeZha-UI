/**
 * =================================================================
 * 樱花花瓣飘散动画效果 (Sakura Petal Animation Effect)
 * 
 * @description 创建美丽的樱花花瓣随风飘散的动画效果
 * @author Faiz
 * @version 1.0.0
 * =================================================================
 */

/**
 * 樱花花瓣特效模块配置
 * 在引入此模块前设置这些配置项
 */
window.EffectSakuraConfig = window.EffectSakuraConfig || {
  enabled: true, // 【樱花特效】是否启用樱花花瓣飘散特效 (true/false)
  petalCount: 50, // 【花瓣数量】屏幕上同时显示的花瓣数量 (建议范围: 20-100)
  petalSize: { min: 8, max: 16 }, // 【花瓣大小】花瓣大小范围，单位像素
  fallSpeed: { min: 2, max: 5 }, // 【下落速度】花瓣下落速度范围
  swayAmplitude: { min: 30, max: 80 }, // 【摆动幅度】花瓣左右摆动的幅度范围
  swaySpeed: { min: 0.02, max: 0.08 }, // 【摆动速度】花瓣摆动的速度范围
  rotationSpeed: { min: 1, max: 4 }, // 【旋转速度】花瓣旋转速度范围
  opacity: { min: 0.3, max: 0.8 }, // 【透明度】花瓣透明度范围
  fallAngle: 0, // 【飘落角度】0度=垂直下落，正值向右，负值向左 (建议范围: -30到+30)
  colors: ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ffb6c1', '#ffd1dc', '#ffffff'] // 【花瓣颜色】花瓣颜色数组，支持十六进制颜色
};

(function() {
    'use strict';

    // 获取用户配置
    const config = window.EffectSakuraConfig;

    // 如果禁用则不执行
    if (!config.enabled) {
        return;
    }

    // 樱花花瓣类
    class SakuraPetal {
        constructor() {
            this.reset();
            this.element = this.createElement();
            this.setupStyles();
        }

        reset() {
            // 根据飘落角度计算生成区域 (0度=垂直，正值向右，负值向左)
            const horizontalSpeedEstimate = (config.fallAngle / 30) * 2.5; // 30度对应最大水平速度
            const screenHeight = window.innerHeight;
            
            // 预计算花瓣在整个下落过程中的水平偏移量
            const maxHorizontalDrift = Math.abs(horizontalSpeedEstimate * screenHeight / 3);
            
            // 根据飘落方向调整生成区域
            let spawnX, spawnWidth;
            if (config.fallAngle < 0) {
                // 向左飘落，从右侧扩展生成
                spawnX = 0;
                spawnWidth = window.innerWidth + maxHorizontalDrift;
            } else if (config.fallAngle > 0) {
                // 向右飘落，从左侧扩展生成
                spawnX = -maxHorizontalDrift;
                spawnWidth = window.innerWidth + maxHorizontalDrift;
            } else {
                // 垂直下落
                spawnX = 0;
                spawnWidth = window.innerWidth;
            }
            
            this.x = spawnX + Math.random() * spawnWidth;
            this.y = -20 - Math.random() * 100;
            this.z = Math.random() * 1000;

            // 运动属性
            this.fallSpeed = this.randomBetween(config.fallSpeed.min, config.fallSpeed.max);
            this.swayAmplitude = this.randomBetween(config.swayAmplitude.min, config.swayAmplitude.max);
            this.swaySpeed = this.randomBetween(config.swaySpeed.min, config.swaySpeed.max);
            this.rotationSpeed = this.randomBetween(config.rotationSpeed.min, config.rotationSpeed.max);

            // 外观属性
            this.size = this.randomBetween(config.petalSize.min, config.petalSize.max);
            this.opacity = this.randomBetween(config.opacity.min, config.opacity.max);
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
            this.rotation = 0;

            // 动画属性
            this.swayOffset = Math.random() * Math.PI * 2;
            this.initialX = this.x;
            this.time = 0;
        }

        randomBetween(min, max) {
            return Math.random() * (max - min) + min;
        }

        createElement() {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';
            document.body.appendChild(petal);
            return petal;
        }

        setupStyles() {
            const styles = {
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: '1',
                userSelect: 'none',
                borderRadius: '50% 0 50% 0',
                transformOrigin: 'center',
                width: this.size + 'px',
                height: this.size + 'px',
                backgroundColor: this.color,
                opacity: this.opacity,
                left: this.x + 'px',
                top: this.y + 'px',
                transform: `rotate(${this.rotation}deg)`,
                boxShadow: `0 0 ${this.size/4}px rgba(255, 182, 193, 0.3)`,
                transition: 'none'
            };

            Object.assign(this.element.style, styles);
        }

        update() {
            this.time += 0.016;

            // 简化的角度计算 (0度=垂直，正值向右，负值向左)
            const verticalSpeed = this.fallSpeed; // 垂直速度保持不变
            const horizontalSpeed = (config.fallAngle / 30) * this.fallSpeed * 0.8; // 30度对应最大水平偏移

            // 按角度移动
            this.y += verticalSpeed;
            this.initialX += horizontalSpeed;

            // 水平摆动 (正弦波) - 在基础轨迹上叠加
            const swayOffset = Math.sin(this.time * this.swaySpeed + this.swayOffset) * this.swayAmplitude;
            this.x = this.initialX + swayOffset;

            // 旋转
            this.rotation += this.rotationSpeed;

            // 随时间变化的透明度 (轻微闪烁效果)
            const flickerOpacity = this.opacity + Math.sin(this.time * 2) * 0.1;

            // 更新DOM元素
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.rotation}deg)`;
            this.element.style.opacity = Math.max(0, Math.min(1, flickerOpacity));

            // 检查是否需要重置
            const margin = 200;
            
            if (this.y > window.innerHeight + margin || 
                this.x > window.innerWidth + margin || 
                this.x < -margin) {
                this.reset();
                this.setupStyles();
            }
        }

        destroy() {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }

    // 樱花动画管理器
    class SakuraManager {
        constructor() {
            this.petals = [];
            this.isActive = false;
            this.animationId = null;
            this.init();
        }

        init() {
            this.createPetals();
            this.start();
            this.setupEventListeners();
        }

        createPetals() {
            for (let i = 0; i < config.petalCount; i++) {
                const petal = new SakuraPetal();
                petal.y = Math.random() * window.innerHeight;
                petal.setupStyles();
                this.petals.push(petal);
            }
        }

        start() {
            if (this.isActive) return;
            this.isActive = true;
            this.animate();
        }

        stop() {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }

        animate() {
            if (!this.isActive) return;
            this.petals.forEach(petal => petal.update());
            this.animationId = requestAnimationFrame(() => this.animate());
        }

        setupEventListeners() {
            window.addEventListener('resize', () => {
                this.petals.forEach(petal => {
                    if (petal.x > window.innerWidth) {
                        petal.reset();
                        petal.setupStyles();
                    }
                });
            });

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        }

        destroy() {
            this.stop();
            this.petals.forEach(petal => petal.destroy());
            this.petals = [];
        }

        adjustPetalCount(newCount) {
            const currentCount = this.petals.length;
            
            if (newCount > currentCount) {
                for (let i = currentCount; i < newCount; i++) {
                    const petal = new SakuraPetal();
                    this.petals.push(petal);
                }
            } else if (newCount < currentCount) {
                const petalsToRemove = this.petals.splice(newCount);
                petalsToRemove.forEach(petal => petal.destroy());
            }
            
            config.petalCount = newCount;
        }

        adjustFallAngle(angle) {
            const oldAngle = config.fallAngle;
            config.fallAngle = angle;
            
            if (Math.abs(oldAngle - angle) > 5) {
                this.redistributePetals();
            }
        }

        redistributePetals() {
            const redistributeCount = Math.min(this.petals.length / 3, 15);
            
            for (let i = 0; i < redistributeCount; i++) {
                const petal = this.petals[Math.floor(Math.random() * this.petals.length)];
                petal.reset();
                petal.y = Math.random() * window.innerHeight;
                petal.setupStyles();
            }
        }

        regenerateAllPetals() {
            this.petals.forEach(petal => petal.destroy());
            this.petals = [];
            this.createPetals();
        }
    }

    // 初始化樱花效果
    let sakuraManager = null;

    function initSakura() {
        if (!sakuraManager) {
            sakuraManager = new SakuraManager();
            
            // 暴露全局控制方法
            window.NeZhaEffectSakura = {
                start: () => sakuraManager.start(),
                stop: () => sakuraManager.stop(),
                destroy: () => {
                    if (sakuraManager) {
                        sakuraManager.destroy();
                        sakuraManager = null;
                    }
                },
                adjustPetalCount: (count) => sakuraManager.adjustPetalCount(count),
                adjustFallAngle: (angle) => sakuraManager.adjustFallAngle(angle),
                regenerateAll: () => sakuraManager.regenerateAllPetals(),
                isActive: () => sakuraManager ? sakuraManager.isActive : false
            };

            // 为了向后兼容，也保留原有的 SakuraControl 名称
            window.SakuraControl = window.NeZhaEffectSakura;

            console.log('🌸 樱花花瓣动画已启动');
        }
    }

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSakura);
    } else {
        initSakura();
    }

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .sakura-petal {
            will-change: transform, opacity;
        }
        
        .sakura-petal * {
            pointer-events: none;
        }
        
        @media (max-width: 768px) {
            .sakura-petal {
                transform: translateZ(0);
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .sakura-petal {
                animation: none !important;
                transform: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);

})();
