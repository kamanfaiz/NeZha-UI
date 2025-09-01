/**
 * =================================================================
 * 鼠标点击烟花特效模块 (Fireworks Effect Module)
 * 
 * @description 创建轻量级、高性能的点击烟花效果，代码更紧凑
 * @author Faiz
 * @version 1.0.0
 * =================================================================
 */

/**
 * 烟花特效模块配置
 * 在引入此模块前设置这些配置项
 */
window.EffectFireworksConfig = window.EffectFireworksConfig || {
  // 【点击烟花】是否启用鼠标点击烟花特效 (true/false)
  enabled: true
};

/**
 * 初始化烟花特效功能
 */
function initEffectFireworks() {
  const config = window.EffectFireworksConfig;
  if (!config.enabled) return;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    pointerEvents: "none",
    top: "0", // 顶部对齐
    left: "0", // 左侧对齐
    width: "100%", // 宽度占满
    height: "100%", // 高度占满
    zIndex: "9999", // 确保特效在最顶层
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let w, h;
  const MAX_PARTICLES = 500, // 粒子池大小 & 屏幕最大粒子数
    PARTICLE_COUNT_PER_CLICK = 30; // 每次点击生成的粒子数
  const colors = ["#ff1461", "#18ff92", "#5a87ff", "#fbf38c"]; // 粒子颜色池

  let particlePool = Array.from({ length: MAX_PARTICLES }, () => ({
    active: false,
  }));
  let activeParticleCount = 0;
  let animationFrameId = null;

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  function launchParticle(x, y, color) {
    const p = particlePool.find((p) => !p.active);
    if (!p) return;

    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 5 + 2;
    Object.assign(p, {
      active: true,
      x,
      y,
      color,
      angle,
      speed,
      radius: Math.random() * 2 + 1, // 粒子半径
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1, // 初始不透明度
      decay: Math.random() * 0.015 + 0.003, // 衰减速率
    });
    activeParticleCount++;
  }

  function updateAndDraw() {
    ctx.clearRect(0, 0, w, h);
    particlePool.forEach((p) => {
      if (!p.active) return;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        p.active = false;
        activeParticleCount--;
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha; // 设置粒子不透明度
        ctx.beginPath();
        ctx.fillStyle = p.color; // 设置粒子颜色
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }

  function animate() {
    updateAndDraw();
    if (activeParticleCount > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      ctx.clearRect(0, 0, w, h);
    }
  }

  window.addEventListener("click", (e) => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < PARTICLE_COUNT_PER_CLICK; i++) {
      if (activeParticleCount >= MAX_PARTICLES) break;
      launchParticle(e.clientX, e.clientY, color);
    }
    if (!animationFrameId) animate();
  });
}

// 自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEffectFireworks);
} else {
  initEffectFireworks();
}

// 将初始化函数暴露到全局作用域
window.NeZhaEffectFireworks = {
  init: initEffectFireworks
};
