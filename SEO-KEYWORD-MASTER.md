# jichangsou.club 统一 SEO/GEO 关键词与内容矩阵主文档

本文件基于桌面资料库《大流量母词》、《关键字优先级》、《机场长尾问题库》、《机场品牌清单》与《16个机场测速实测资料包》深度融合生成，为 **jichangsou.club（机场搜 Decision Hub）** 提供全量 SEO 拓扑与内容决策蓝图。

---

## 一、九大核心 Topic Clusters (主题集群)

| 优先级 | 主题集群 | 核心目标关键词 | 核心落地 URL | 商业角色 |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **机场推荐与选购** | 机场推荐、稳定机场、便宜机场、IEPL机场、不限时机场、性价比机场 | `/recommend/`<br>`/airports/`<br>`/airports/cheap/`<br>`/airports/stable/`<br>`/airports/unlimited/` | 核心决策与高价值商业转化 |
| **P2** | **Clash 客户端生态** | Clash、Clash教程、Clash Verge Rev下载、Clash订阅、Clash无法上网 | `/clients/clash/`<br>`/airports/clash/` | 桌面与主力流量入口 |
| **P3** | **Shadowrocket 小火箭** | Shadowrocket、小火箭教程、小火箭订阅、小火箭节点、小火箭无法连接 | `/clients/shadowrocket/`<br>`/airports/shadowrocket/` | iOS 高净值移动端用户 |
| **P4** | **v2rayN 客户端** | v2rayN下载、v2rayN教程、v2rayN配置VLESS、v2rayN无法上网 | `/clients/v2rayn/` | Windows 极客与大众用户 |
| **P5** | **AI 专用场景** | ChatGPT机场、Claude VPN、Gemini节点、OpenAI地区限制、纯净原生IP | `/scenarios/chatgpt/`<br>`/airports/chatgpt/` | 刚需生产力与高留存场景 |
| **P6** | **流媒体与娱乐** | Netflix机场、Disney+解锁、YouTube 4K追剧、原生家宽IP | `/scenarios/netflix/`<br>`/airports/netflix/` | 大流量追剧与日常娱乐 |
| **P7** | **跨境办公与网络知识** | 跨境办公网络、GitHub加速、IPLC与中转区别、节点测速方法 | `/scenarios/office/`<br>`/answers/iplc-vs-relay/`<br>`/answers/speed-test-method/` | 专业技术信任与知识背书 |
| **P8** | **故障排查与 GEO 答案** | 机场连不上、有节点无法上网、订阅失败、节点超时、跑路前兆 | `/answers/`<br>`/answers/[slug]/` | 生成式 AI (GEO) 引用与痛点解决 |
| **P9** | **16 家品牌深度资料库** | 光速云、星岛梦、灵猫网络、飞猫云、唯兔云、宇宙云、U1S1、极连云等 | `/airport/[slug]/`<br>`/compare/`<br>`/radar/` | 品牌词拦截与精准评测转化 |

---

## 二、16 家机场品牌资料与四层数据架构

所有品牌数据严格按照四层数据结构分离管理，拒绝虚假宣传：

1. **Vendor (厂商资料)**：官方标称价格、流量、协议、IEPL、AI/流媒体声明、自研客户端。
2. **Measured (本站实测)**：2026-08-11 统一批次测速记录、TLS 握手、延迟与连通性记录。
3. **Commercial (商业信息)**：优惠码、专属返利链接、支付方式。
4. **Editorial (编辑判断)**：适用人群、同价位对比、优缺点分析、风险提示。

### 品牌总览矩阵表

| 序号 | 品牌名称 | Slug | 起步价格 | 月流量 | 协议与线路 | 核心定位 | 优惠码 | 专属入口代码 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **光速云** | `guangsu` | 17 元/月 | 110GB | VLESS / IEPL 专线 | 老牌综合型 / 2020年 | `AMM` (8折) | `keqgvT5Y` |
| 2 | **星岛梦** | `xingdaomeng` | 折合 8 元/月 | 60GB | VLESS / 企业内网 | 年付低价 / 不限时包 | `nmw888` (9折) | `1TynBYnR` |
| 3 | **灵猫网络** | `lingmao` | 19 元/月 | 150GB | VLESS / 内网专线 | 月付大流量 / 150GB | `lmao888` (9折) | `8MIAyxak` |
| 4 | **飞猫云** | `feimao` | 折合 7 元/月 | 50GB | VLESS / IEPL 专线 | 低价小流量 / 年付轻量 | `flycat888` (8折) | `6uq0Xe9y` |
| 5 | **唯兔云** | `weitu` | 14.9 元/月 | 100GB | VLESS / 60+节点 | 多节点 / 三网优化调度 | `rabbit` (9折) | `xIutqOBA` |
| 6 | **宇宙云** | `yuzhou` | 14.9 元/月 | 100GB | VLESS / IEPL 专线 | 15 元档高性价比专线 | `YUZHOU553` | `yrThwMP1` |
| 7 | **U1S1** | `u1s1` | 20 元/月 | 120GB | VLESS / IEPL 专线 | 20 元档标准专线 | `akaka` | `xhX5X22f` |
| 8 | **极连云** | `jilian` | 18 元/月 | 100GB | Shadowsocks / IEPL | 18 元档综合均衡 | `ji8888` | `VM1rKGUu` |
| 9 | **光年梯** | `guangnianti` | 18 元/月 | 110GB | VLESS / IEPL 专线 | 18 元档多给 10GB | `gnt6666` | `X1FoxjGE` |
| 10 | **一翻云** | `yifan` | 20 元/月 | 150GB | VLESS / IEPL 专线 | 20 元档 150GB 大流量 | `yfy6666` | `Yr7FhB7r` |
| 11 | **二猫云** | `ermao` | 20 元/月 | 130GB | VLESS / IEPL 专线 | 20 元档中等流量 | `ermao5555` | `7mjvgGbW` |
| 12 | **SOGO 云** | `sogo` | 25 元/月 | 150GB | VLESS / IEPL 专线 | 25 元综合型旗舰 | `sss777` | `327Vs0w7` |
| 13 | **可信云** | `kexin` | 25 元/月 | 150GB | VLESS / IEPL 专线 | 25 元专线大流量 | `kkk333` | `UYDtNlCY` |
| 14 | **速界** | `sujie` | 25 元/月 | 150GB | VLESS / IEPL 专线 | AI 场景专线优化 | `sss1111` | `xgXzEfZB` |
| 15 | **快狸** | `kuaili` | 25 元/月 | 150GB | VLESS / IEPL 专线 | AI / 视频全能综合 | `kkk2222` | `AiqyM8oG` |
| 16 | **全球云** | `quanqiu` | 20 元/月 | 120GB | VLESS / IEPL 专线 | 20 元新架构专线 | `qqy7777` | `Ov2nvU9C` |

---

## 三、内链拓扑网络 (Internal Linking Mesh)

```
[首页 (Decision Hub)] 
  │
  ├───► [机场推荐 /recommend/] ────► [品牌详情 /airport/guangsu/] ──► [官网注册]
  │         │                               ▲
  │         ▼                               │
  ├───► [快速对比 /compare/] ───────────────┤
  │         │                               │
  ├───► [客户端教程 /clients/clash/] ───────┤
  │         │                               │
  └───► [问题中心 /answers/vpn-vs-airport/] ┘
```

- **Pillar → Cluster**：每个一级专题包含 2~4 个下游具体页面与 1 个明确下一步。
- **GEO Answer → Decision Hub**：每个快答末尾提供直接行动方案（如：前往专线推荐或查看对比）。
- **品牌互联**：品牌页底部自动提供相似价位竞品对比（如：`光速云 vs 宇宙云`）。

---

## 四、关键词内耗审计 (Cannibalization Prevention)

1. **年份词合并**：`2026机场推荐`、`机场推荐`、`机场排行榜` 统一归属于 `/recommend/` 与 `/`，正文通过年度更新维护，禁止生成 `/2026-airport-recommendation/` 等多重薄页面。
2. **同义意图合并**：
   - `Shadowrocket教程` / `小火箭配置` → 统一归属于 `/clients/shadowrocket/`
   - `便宜机场` / `性价比机场` / `低价梯子` → 统一归属于 `/airports/cheap/`
   - `稳定机场` / `IEPL专线推荐` → 统一归属于 `/airports/stable/`
   - `节点全部超时` / `测速超时` → 统一归属于 `/answers/node-timeout-troubleshoot/`
