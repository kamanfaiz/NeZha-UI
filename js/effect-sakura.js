/**
 * =================================================================
 * 樱花花瓣飘散动画效果 (Sakura Petal Animation Effect)
 * 
 * @description 创建美丽的樱花花瓣随风飘散的动画效果
 * @author Faiz
 * @version 1.0.0
 * =================================================================
 */

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        enabled: true,              // 是否启用樱花特效
        petalCount: 50,            // 花瓣数量
        petalSize: { min: 8, max: 16 },  // 花瓣大小范围 (像素)
        fallSpeed: { min: 1, max: 3 },   // 下落速度范围
        swayAmplitude: { min: 30, max: 80 }, // 摆动幅度范围
        swaySpeed: { min: 0.02, max: 0.08 }, // 摆动速度范围
        rotationSpeed: { min: 1, max: 4 },   // 旋转速度范围
        opacity: { min: 0.3, max: 0.8 },    // 透明度范围
        windStrength: 2,           // 风力强度
        colors: [                  // 花瓣颜色数组
            '#ffb7c5',  // 粉色
            '#ffc0cb',  // 浅粉色
            '#ff69b4',  // 热粉色
            '#ffb6c1',  // 淡粉色
            '#ffd1dc',  // 粉白色
            '#ffffff'   // 白色
        ]
    };

    // 获取用户配置
    const config = Object.assign({}, defaultConfig, window.EffectSakuraConfig || {});

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
            // 位置属性
            this.x = Math.random() * window.innerWidth;
            this.y = -20;
            this.z = Math.random() * 1000; // 深度层次

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
            this.time += 0.016; // 约60fps

            // 垂直下落
            this.y += this.fallSpeed;

            // 水平风力影响 - 持续的水平移动
            this.initialX += config.windStrength * 0.3;

            // 水平摆动 (正弦波)
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
            if (this.y > window.innerHeight + 20 || this.x > window.innerWidth + 100 || this.x < -100) {
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
                // 随机初始化花瓣的垂直位置，创造更自然的效果
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
            // 窗口大小改变时重新调整花瓣位置
            window.addEventListener('resize', () => {
                this.petals.forEach(petal => {
                    if (petal.x > window.innerWidth) {
                        petal.reset();
                        petal.setupStyles();
                    }
                });
            });

            // 页面可见性变化时暂停/恢复动画
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

        // 动态调整花瓣数量
        adjustPetalCount(newCount) {
            const currentCount = this.petals.length;
            
            if (newCount > currentCount) {
                // 增加花瓣
                for (let i = currentCount; i < newCount; i++) {
                    const petal = new SakuraPetal();
                    this.petals.push(petal);
                }
            } else if (newCount < currentCount) {
                // 减少花瓣
                const petalsToRemove = this.petals.splice(newCount);
                petalsToRemove.forEach(petal => petal.destroy());
            }
        }

        // 动态调整风力
        adjustWindStrength(strength) {
            config.windStrength = strength;
        }
    }

    // 初始化樱花效果
    let sakuraManager = null;

    // 等待DOM加载完成
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
                adjustWindStrength: (strength) => sakuraManager.adjustWindStrength(strength),
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
        
        /* 优化性能的CSS */
        .sakura-petal * {
            pointer-events: none;
        }
        
        /* 为不同设备优化 */
        @media (max-width: 768px) {
            .sakura-petal {
                transform: translateZ(0); /* 启用硬件加速 */
            }
        }
        
        /* 减少动画对性能的影响 */
        @media (prefers-reduced-motion: reduce) {
            .sakura-petal {
                animation: none !important;
                transform: none !important;
            }
        }
    `;
    
    document.head.appendChild(style);

})();
