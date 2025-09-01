/**
 * =================================================================
 * 主初始化脚本 (Main Initialization Script)
 * 
 * @description 统一调用所有功能模块，启动脚本
 * @author Faiz
 * @version 1.0.0
 * =================================================================
 */

/**
 * 主函数 - 启动所有功能模块
 */
function main() {
  console.log('🎨 NeZha UI 美化模块开始加载...');

  // 检查并初始化各个模块
  const modules = [
    { name: 'NeZhaCustomLinks', displayName: '自定义链接模块' },
    { name: 'NeZhaIllustration', displayName: '插图模块' },
    { name: 'NeZhaEffectFireworks', displayName: '烟花特效模块' },
    { name: 'NeZhaVisitorInfo', displayName: '访客信息模块' },
    { name: 'NeZhaEffectRain', displayName: '下雨特效模块' },
    { name: 'NeZhaEffectSakura', displayName: '樱花花瓣特效模块' }
  ];

  let loadedCount = 0;
  const totalCount = modules.length;

  modules.forEach(module => {
    if (window[module.name]) {
      console.log(`✅ ${module.displayName} 已加载`);
      loadedCount++;
    } else {
      console.warn(`⚠️ ${module.displayName} 未找到，可能未正确加载`);
    }
  });

  console.log(`📊 模块加载完成: ${loadedCount}/${totalCount}`);
  
  if (loadedCount === totalCount) {
    console.log('🎉 所有 NeZha UI 美化模块已成功加载！');
  } else {
    console.log('⚠️ 部分模块未能加载，请检查相关脚本文件');
  }
}

// 确保在DOM加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

// 将主函数暴露到全局作用域
window.NeZhaMain = {
  init: main
};
