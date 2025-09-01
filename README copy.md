# NeZha UI 美化模块 - 模块化版本

> **作者**: Faiz  
> **版本**: 1.0.0  
> **仓库**: https://github.com/kamanfaiz/NeZha-UI

## 📁 文件结构

```
js/
├── custom-links.js      # 自定义链接模块
├── illustration.js      # 插图模块
├── effect-fireworks.js  # 烟花特效模块
├── visitor-info.js      # 访客信息模块 (包含内置工具函数)
└── effect-rain.js       # 下雨特效模块

main.js                   # 主初始化脚本 (最后加载)
ui.html                   # 完整配置示例 (推荐使用)
```

## 🚀 使用方法

### 1. 快速使用 (推荐)

直接使用 `ui.html` 中的代码，所有模块都通过 CDN 加载，无需手动上传文件。

### 2. CDN 链接说明

所有模块文件都已上传到 GitHub，可以直接通过 jsDelivr CDN 使用：

```html
<!-- 基础 CDN 地址格式: -->
https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/[模块名].js
```

**完整的 CDN 链接列表：**
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/custom-links.js`
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/illustration.js`
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/effect-fireworks.js`
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/visitor-info.js`
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/effect-rain.js`
- `https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/main.js`

### 3. 在哪吒面板中使用

将修改后的HTML代码复制到哪吒面板的自定义代码区域。

## 🔧 配置说明

每个模块都有独立的配置对象，您可以根据需要修改：

### 自定义链接模块配置
```javascript
// NeZha面板标准配置
window.CustomLinks = JSON.stringify([...]); // 链接数组 (JSON格式)

// 链接图标配置
window.CustomLinkIconSize = "16px";     // 图标大小
window.CustomLinkIconColor = "";        // 图标颜色 (留空则继承文本颜色)
window.CustomLinkIconMarginRight = "1px"; // 图标间距
```

### 插图模块配置
```javascript
// 全局配置 (必须设置)
window.DisableAnimatedMan = true;  // 禁用看板娘动画，插图才会生效

// 插图配置
window.CustomIllustration = "https://example.com/image.png"; // 插图URL

// 插图样式配置
window.IllustrationStyleConfig = {
  width: "120px",              // 插图宽度
  right: "-10px",              // 右边距
  top: "-120px",               // 上边距
  zIndex: "10",                // 显示层级
  transitionDuration: "0.4s",  // 过渡时间
  initialOffset: "20px"        // 初始偏移
};
```

### 烟花特效配置
```javascript
window.EffectFireworksConfig = {
  enabled: true // 是否启用
};
```

### 访客信息配置
```javascript
window.VisitorInfoConfig = {
  enabled: true,         // 是否启用访客信息显示
  position: "right",     // 面板显示位置 ("left" 或 "right")
  autoHideDelay: 2600    // 自动隐藏延迟 (毫秒)
};
```

### 下雨特效配置
```javascript
window.EffectRainConfig = {
  enabled: true,           // 是否启用
  densityFactor: 0.0004,   // 雨滴密度
  maxDrops: 4000,          // 最大雨滴数
  minDrops: 200            // 最小雨滴数
};
```



## 📦 模块依赖关系

```
所有模块都是独立的，没有相互依赖关系

main.js ← 所有模块 (用于统计加载状态)
```

## 🎯 加载顺序

现在所有模块都是独立的，加载顺序更加灵活：

1. **配置脚本** - 所有 `window.*Config` 配置
2. **功能模块** - 所有 `.js` 文件 (可并行加载)
3. **main.js** - 主初始化脚本 (最后，可选)

## 🔧 自定义模块

如果您只需要部分功能，可以选择性加载模块：

```html
<!-- 只加载烟花特效和下雨特效 -->
<script>
  window.EffectFireworksConfig = { enabled: true };
  window.EffectRainConfig = { enabled: true };
</script>

<script src="https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/effect-fireworks.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/effect-rain.js"></script>
```

## 🐛 调试

打开浏览器开发者工具的控制台，您将看到模块加载状态：

```
🎨 NeZha UI 美化模块开始加载...
✅ 自定义链接模块 已加载
✅ 插图模块 已加载
✅ 烟花特效模块 已加载
✅ 访客信息模块 已加载
✅ 下雨特效模块 已加载
📊 模块加载完成: 5/5
🎉 所有 NeZha UI 美化模块已成功加载！
```

## 📝 注意事项

1. **配置对象必须在模块加载前定义**
2. **插图模块**: `window.DisableAnimatedMan` 必须设为 `true`，自定义插图才会生效
3. **访客信息模块**: 支持 `enabled` 开关和 `position` 位置选择
4. **CDN缓存问题**: 如果修改了文件但没有生效，在URL后添加版本号：
   ```html
   <script src="https://cdn.jsdelivr.net/gh/kamanfaiz/NeZha-UI@main/js/visitor-info.js?v=1.0.1"></script>
   ```
5. **兼容性**: 所有模块都支持自动初始化，无需手动调用
6. **模块独立性**: 现在所有模块都是完全独立的，可以任意组合使用