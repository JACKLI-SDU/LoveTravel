# 中国足迹地图

这是一个纯前端本地版中国足迹地图网站。直接打开 `index.html` 或用本地静态服务访问即可使用；账号、城市记录、备注和图片都保存在当前浏览器的 IndexedDB 中。

## 本次地图结构

- 中国总图只展示省级区域和省名。
- 点击省份进入省内市级地图，展示市级轮廓和城市名称。
- 点亮城市后，省内地图会填充该市；返回中国总图后会用绿色圆点标记已点亮城市。
- 搜索支持城市和省份；选择城市会自动进入对应省份地图。

## 地图数据

页面会优先读取本地完整数据：

- `data/china-provinces.json`：中国省级 GeoJSON。
- `data/provinces/{省级adcode}.json`：单省市级 GeoJSON，例如 `data/provinces/440000.json`。

如果本地没有这些文件，页面会尝试按 DataV GeoAtlas 格式加载在线数据；在离线或被浏览器跨域限制时，会回退到当前内置的精简示例数据。当前仓库中的 `data/china-cities.json` 仍是示例数据，用于验证账号、点亮、相册、导入导出和省市下钻交互。

如果当前网络允许访问 DataV，可以运行下面的脚本缓存完整数据：

```bash
node tools/download-map-data.mjs
```

市级 feature 至少需要包含：

- `properties.name`
- `properties.adcode`
- `properties.province` 或 `properties.parent.adcode`
- `geometry`

## 备份

账号菜单中的“导出账号”会生成单账号 JSON 备份，包含城市记录和图片数据。导入时默认创建一个新账号副本。
