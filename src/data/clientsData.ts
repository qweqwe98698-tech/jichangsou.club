export interface ClientStep {
  stepNumber: string;
  title: string;
  desc: string;
  uiMockup: {
    title: string;
    badge: string;
    details: { label: string; value: string; highlight?: boolean }[];
    hint?: string;
  };
}

export interface ClientGuide {
  slug: string;
  name: string;
  platform: string;
  version: string;
  icon: string;
  title: string;
  summary: string;
  readingTime: string;
  wordCount: number;
  lastUpdated: string;
  overviewHtml: string;
  steps: ClientStep[];
  advancedTipsHtml: string;
  faqs: { q: string; a: string }[];
  relatedAnswers: { title: string; slug: string }[];
  optimizedAirports: { name: string; slug: string; startingPrice: number; feature: string }[];
}

export const clientsData: ClientGuide[] = [
  {
    slug: 'clash',
    name: 'Clash Verge Rev',
    platform: 'Windows / macOS / Linux',
    version: 'v1.7.7+ 现代内核维护版',
    icon: '🐱',
    title: 'Clash Verge Rev 完整图文配置教程：从下载安装、订阅导入到 TUN 模式深度优化 (2026 全面版)',
    summary: '面向 Windows 与 macOS 电脑用户的 2026 最新 Clash Verge Rev 图文保姆级教程。手把手详解客户端下载、订阅导入解析、智能分流规则设置、TUN 虚拟网卡接管与晚高峰延迟优化。',
    readingTime: '6 分钟阅读 · 1680 字',
    wordCount: 1680,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位与为什么放弃老版 Clash for Windows？</h2>
      <p>自 2023 年底原作者宣布停更 Clash for Windows 之后，社区涌现出了新一代基于 <strong>Mihomo (Clash.Meta) 内核</strong> 的现代化桌面客户端——<strong>Clash Verge Rev</strong>。它不仅修复了旧版存在的诸多安全漏洞，原生支持 <strong>VLESS、Reality、Hysteria2、Shadowsocks 2022</strong> 等现代高速抗封锁协议，更带来了现代化的流畅 UI 与一键无缝开启的 <strong>TUN 虚拟网卡接管模式</strong>。无论您使用的是 Windows 10/11 还是搭载 Apple Silicon (M1/M2/M3/M4) 的 macOS 设备，Clash Verge Rev 都是目前桌面端综合体验最强大、最稳定的首选代理工具。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并安装 Clash Verge Rev 官方安装包',
        desc: '从官方开源 Release 页面根据操作系统架构下载对应安装包：Windows 64位系统选择 x64-setup.exe，苹果 Mac 电脑选择 aarch64.dmg (Apple Silicon) 或 x64.dmg (Intel)。下载后按向导完成安装，首次启动建议勾选“以管理员身份运行”。',
        uiMockup: {
          title: 'Clash Verge Rev 安装与初始化配置面板',
          badge: 'ENVIRONMENT READY',
          details: [
            { label: '客户端内核', value: 'Mihomo (Clash.Meta) v1.18+' },
            { label: '系统权限', value: 'Administrator / Root 已授权', highlight: true },
            { label: '默认端口', value: 'Mixed Port: 7897 / 7890' },
            { label: '运行状态', value: '🟢 内核就绪，等待订阅导入' },
          ],
          hint: '💡 提示：安装过程中若杀毒软件弹出网络组件拦截提示，请务必选择“允许本次操作”。',
        },
      },
      {
        stepNumber: '02',
        title: '获取机场订阅 URL 并一键导入配置',
        desc: '登录您所购买的机场官网后台，在“仪表盘”或“快速导入”区域找到【复制 Clash 订阅】或【一键导入 Clash】。打开 Clash Verge Rev 左侧菜单栏的【Profiles (订阅配置)】，将复制的 URL 粘贴至顶部输入框，并点击【Import (导入)】按钮。',
        uiMockup: {
          title: 'Profiles 订阅管理与远程下载',
          badge: 'REMOTE SYNC',
          details: [
            { label: '订阅源类型', value: 'Remote Subscription' },
            { label: '订阅链接状态', value: '200 OK · 解析成功', highlight: true },
            { label: '节点同步数量', value: '48 个专线节点已加载' },
            { label: '自动更新周期', value: '24 小时自动轮询同步' },
          ],
          hint: '💡 提示：导入成功后，右键点击该订阅卡片选择【Use (启用)】，卡片左侧出现绿色高亮标记即表示配置生效。',
        },
      },
      {
        stepNumber: '03',
        title: '选择代理运行模式与低延迟优质节点',
        desc: '切换至左侧【Proxies (代理)】界面，顶部模式推荐选择【Rule (规则分流模式)】。在节点分组中点击右上角“测速小闪电”图标执行批量延迟探测。优先选中延迟在 35ms - 50ms 之间的香港 (HK) 或日本 (JP) 专线节点。',
        uiMockup: {
          title: 'Proxies 节点选择与毫秒级延迟矩阵',
          badge: 'LOW LATENCY BGP',
          details: [
            { label: '🇭🇰 香港 01 [IEPL 专线]', value: '36 ms · 0% 丢包', highlight: true },
            { label: '🇯🇵 日本 02 [原生 BGP]', value: '58 ms · 4K 优化' },
            { label: '🇸🇬 新加坡 01 [流媒体解锁]', value: '62 ms · Disney+' },
            { label: '🇺🇸 美国 03 [OpenAI 原生]', value: '145 ms · 纯净住宅' },
          ],
          hint: '💡 提示：Rule 规则模式下，访问百度、淘宝等国内网站自动走本地网络直连，完全不消耗机场流量。',
        },
      },
      {
        stepNumber: '04',
        title: '开启系统代理与一键开启 TUN 模式 (终极优化)',
        desc: '进入左侧【Settings (设置)】面板，首先打开【System Proxy (系统代理)】开关。随后强烈建议找到【TUN Mode】开关并点击打开。TUN 模式会在驱动层创建虚拟网卡深度接管全部网络流量，彻底解决命令行终端、Git、特定浏览器插件代理失效的问题。',
        uiMockup: {
          title: 'System & TUN 核心服务运行状态',
          badge: 'TUN MODE ACTIVE',
          details: [
            { label: 'System Proxy', value: '🟢 ON (系统代理已接管)' },
            { label: 'TUN Mode (Wintun)', value: '🟢 ON (虚拟网卡驱动已绑定)', highlight: true },
            { label: 'IPv6 协议支持', value: '自动屏蔽防止 IP 泄露' },
            { label: '开机自启 (Silent)', value: '已开启静默后台托盘运行' },
          ],
          hint: '💡 提示：开启 TUN 模式后，即刻打开浏览器访问 google.com 即可畅享超高速外网体验！',
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、2026 高阶技巧：规则集分流与 AI 专用策略组配置</h2>
      <p>对于重度使用 OpenAI ChatGPT 4o、Claude 3.5 或 GitHub 协同开发的极客用户，可以通过 Clash Verge Rev 的扩展配置功能，将特定的域名群组定向绑定至专属节点：</p>
      <ul>
        <li><strong>OpenAI / Claude 流量定向：</strong>在策略组中将 <code>chatgpt.com</code>、<code>claude.ai</code> 规则分流绑定到美国（US）或日本（JP）原生住宅节点，彻底避开香港节点导致的 Access Denied 报错。</li>
        <li><strong>国内直连 DNS 优化：</strong>开启 <code>fake-ip</code> 模式，并在本地 DNS 中配置阿里公共 DNS (223.5.5.5) 与腾讯 DNSPod (119.29.29.29)，实现域名毫秒级极速解析。</li>
      </ul>
    `,
    faqs: [
      { q: 'Clash 开启后，本地微信和淘宝打不开了怎么办？', a: '请确认顶部运行模式选择的是【Rule (规则模式)】，而非【Global (全局模式)】。若依然异常，在设置中关闭“DNS IPv6”开关即可。' },
      { q: '导入订阅时提示 Network Error 怎么办？', a: '检查电脑本地时间是否精确到秒；若时间正确，可尝试在机场后台重新复制“Clash 订阅”或下载 .yaml 离线文件导入。' },
    ],
    relatedAnswers: [
      { title: 'Clash 有节点和延迟，但浏览器无法上网？', slug: 'clash-no-internet' },
      { title: '机场订阅链接导入后无法使用/节点全红怎么办？', slug: 'subscription-failed' },
      { title: 'ChatGPT 提示 Access Denied 怎么解决？', slug: 'chatgpt-access-denied' },
    ],
    optimizedAirports: [
      { name: '光速云', slug: 'guangsu', startingPrice: 7.5, feature: '老牌综合 IEPL 专线，完美适配 Clash Verge 一键导入' },
      { name: '宇宙云', slug: 'yuzhou', startingPrice: 15, feature: 'VLESS+Reality 现代协议，全系原生住宅 IP 支持' },
      { name: 'U1S1', slug: 'u1s1', startingPrice: 20, feature: '高冗余 BGP 专线，晚高峰 0 丢包' },
    ],
  },
  {
    slug: 'shadowrocket',
    name: 'Shadowrocket (小火箭)',
    platform: 'iOS (iPhone / iPad) / Apple Silicon Mac',
    version: 'v2.2.60+ 经典优化版',
    icon: '🚀',
    title: 'Shadowrocket (小火箭) iOS 完整配置使用教程：扫码导入、规则分流与去广告策略 (2026 图解)',
    summary: '专为苹果 iPhone 与 iPad 用户打造的 2026 最新 Shadowrocket (小火箭) 全流程图解指南。包含美区 App Store 下载、扫码/一键订阅导入、延迟测试、全局路由配置及常见问题排查。',
    readingTime: '6 分钟阅读 · 1620 字',
    wordCount: 1620,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、为什么 Shadowrocket 是 iOS 端不可替代的装机必备神器？</h2>
      <p>在苹果 iOS 与 iPadOS 封闭的沙盒生态中，<strong>Shadowrocket（小火箭）</strong>凭借其直观的操作界面、极低的后台待机功耗以及对几乎所有现代代理协议（Shadowsocks、VLESS、Trojan、Hysteria2）的全面支持，成为了国内 iPhone 用户普及度最高的网络加速工具。小火箭不仅支持通过摄像头直接扫描机场二维码极速导入几百个节点，更内置了强大的分流规则引擎，让您在刷国内抖音、微信的同时，无感流畅访问海外社交平台与 AI 生产力工具。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载与安装 Shadowrocket 正版应用',
        desc: '打开 iPhone 自带的 App Store，退出当前的国区 Apple ID，登录一个美区（或非国区）的 Apple ID。在搜索栏输入“Shadowrocket”，认准开发者为 Shadow Launch Technology Group 的正版小火箭应用（售价通常为 $2.99）完成购买下载。',
        uiMockup: {
          title: 'iOS App Store 正版安装识别',
          badge: 'GENUINE VERIFIED',
          details: [
            { label: 'App 名称', value: 'Shadowrocket (小火箭图标)' },
            { label: '开发者标识', value: 'Shadow Launch Technology' },
            { label: '系统版本需求', value: 'iOS 12.0 / iPadOS 12.0 或更高', highlight: true },
            { label: '安全声明', value: '坚决远离国内山寨套壳应用' },
          ],
          hint: '⚠️ 警告：千万不要在淘宝或不知名网页下载所谓的“企业签名版”，以防个人账号与支付凭证被恶意监听。',
        },
      },
      {
        stepNumber: '02',
        title: '扫描专属二维码或导入节点订阅',
        desc: '在手机浏览器中登录机场后台，找到【Shadowrocket 订阅】。方式 A：点击右上角“扫码”图标，直接扫描机场后台提供的节点二维码；方式 B：复制订阅 URL，打开小火箭点击右上角【+】号，类型（Type）选择【Subscribe】，将链接粘贴至【URL】栏，备注填入机场名称后点击保存。',
        uiMockup: {
          title: 'Add Configuration 添加节点与订阅',
          badge: 'QR SCAN ACTIVE',
          details: [
            { label: 'Type (类型)', value: 'Subscribe (订阅聚合)' },
            { label: 'URL (订阅地址)', value: 'https://jcs-sub.api/v1/token=***', highlight: true },
            { label: 'Remark (备注)', value: '我的主力专线机场' },
            { label: 'Auto Update', value: '打开“打开应用时自动更新”' },
          ],
          hint: '💡 提示：保存后小火箭会自动连接服务器拉取全部海外节点，并显示在首页节点列表中。',
        },
      },
      {
        stepNumber: '03',
        title: '一键连通性测速与优选节点切换',
        desc: '在小火箭主界面点击【连通性测试 (Connectivity Test)】。软件会自动对所有节点发起 HTTP 延迟握手探测。列表中会显示绿色的具体毫秒数（如 38ms、45ms）。点击选中延迟最低的香港或日本 IEPL 专线节点（节点左侧出现黄色圆点即表示选定）。',
        uiMockup: {
          title: 'Shadowrocket 节点连通性实测列表',
          badge: 'TEST PASSED',
          details: [
            { label: '🇭🇰 香港 01 IEPL 专线', value: '● 38 ms (已选定)', highlight: true },
            { label: '🇯🇵 日本 01 BGP 优化', value: '○ 56 ms (备用)' },
            { label: '🇸🇬 新加坡 01 4K 流媒体', value: '○ 61 ms (正常)' },
            { label: '🇺🇸 美国 01 原生住宅 IP', value: '○ 138 ms (ChatGPT)' },
          ],
          hint: '💡 提示：如果测速显示“Timeout”或“-1ms”，请参考常见问题排查本地时间与订阅状态。',
        },
      },
      {
        stepNumber: '04',
        title: '设置全局路由为“配置”并启动主开关',
        desc: '在主界面下方找到【全局路由 (Global Routing)】，必须确保勾选为【配置 (Config)】模式。随后打开顶部的主连接开关。首次开启时，iOS 系统会弹出“Shadowrocket 想添加 VPN 配置”的系统提示框，点击【允许】并输入 iPhone 锁屏密码即可。',
        uiMockup: {
          title: 'Main Dashboard 实时连接状态',
          badge: 'VPN CONNECTED',
          details: [
            { label: '连接主开关', value: '🟢 状态：已连接 (00:15:28)' },
            { label: '全局路由', value: '配置 (Config - 智能分流)', highlight: true },
            { label: '当前生效节点', value: '香港 01 IEPL 专线' },
            { label: '本地 IP 保护', value: '中国大陆流量 100% 直连' },
          ],
          hint: '🎉 成功！此时状态栏出现 VPN 小图标，打开 Safari 即可畅游全球互联网。',
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、iOS 高阶玩法：按需连接 (On Demand) 与去广告规则集</h2>
      <p>通过进入小火箭底部的【配置】页面，您可以进一步享受智能化体验：</p>
      <ul>
        <li><strong>按需连接 (On Demand)：</strong>开启后无需每次手动点击连接开关。当检测到您连接蜂窝移动网络或特定 WiFi 时，小火箭会在后台自动唤醒连接；在锁屏睡眠时自动降低心跳功耗，实现“全天候 24 小时开着也不耗电”。</li>
        <li><strong>第三方分流与去广告规则：</strong>导入社区知名的 <code>ACL4SSR</code> 或 <code>lhie1</code> 规则集，可自动屏蔽常见流媒体片头广告并精准阻断恶意隐私跟踪器。</li>
      </ul>
    `,
    faqs: [
      { q: '为什么扫码后没有节点出现？', a: '请确认您扫描的是机场提供的专属订阅二维码，而非单节点文本；同时检查 iPhone 的系统日期与时间是否准确。' },
      { q: '开启小火箭后，微信收发消息很慢？', a: '请检查【全局路由】是否误点成了【代理 (Proxy)】模式。务必切换回【配置 (Config)】模式，微信即走本地直连。' },
    ],
    relatedAnswers: [
      { title: 'Clash 与 Shadowrocket (小火箭) 应该怎么选？', slug: 'clash-vs-shadowrocket' },
      { title: '机场订阅链接导入后无法使用/节点全红怎么办？', slug: 'subscription-failed' },
      { title: 'ChatGPT 提示 Access Denied 怎么解决？', slug: 'chatgpt-access-denied' },
    ],
    optimizedAirports: [
      { name: '星岛梦', slug: 'xingdaomeng', startingPrice: 12, feature: '提供专属小火箭一键二维码扫码与不限时按量套餐' },
      { name: '灵猫网络', slug: 'lingmao', startingPrice: 15, feature: '企业级内网专线，iOS 低功耗稳定协议适配' },
      { name: '飞猫云', slug: 'feimao', startingPrice: 18, feature: '极速 Shadowsocks 专线节点，超低握手延迟' },
    ],
  },
  {
    slug: 'surge',
    name: 'Surge',
    platform: 'iOS / macOS (Apple 生态旗舰)',
    version: 'Surge 5.0+ 顶奢网络调试器',
    icon: '⚡',
    title: 'Surge 完整配置指南：Apple 生态顶奢网络调试与企业级智能分流 (2026 深度版)',
    summary: '面向 Apple 生态高端用户与开发者的 Surge 图文指南。详解模块化配置（Modules）、MITM 解密、企业级多出口策略组与跨设备网关接管。',
    readingTime: '6 分钟阅读 · 1650 字',
    wordCount: 1650,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：为什么 Surge 被誉为 Apple 生态的顶奢神器？</h2>
      <p>在所有网络工具中，<strong>Surge</strong>（iOS / Mac 双端）被公认为性能天花板。它不仅仅是一款代理分流工具，更是专业级的<strong>高级网络调试分析平台</strong>。Surge 拥有无与伦比的异步网络架构、毫秒级 DNS 解析流水线、强大的 JavaScript 脚本引擎与企业级仪表盘监控，能够对每一条 TCP/UDP 流执行深度数据包追踪。虽然其授权费用相对高昂（Mac 版单授权约 $49.99 起），但对于追求极致优雅与严苛稳定性的苹果生态高净值用户，Surge 是无可争议的终极方案。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并激活 Surge 官方正版',
        desc: '在非国区 App Store 购买 Surge iOS，或在官网下载 Surge for Mac。首次打开按提示安装并信任系统网络扩展驱动。',
        uiMockup: {
          title: 'Surge Network Daemon 初始化',
          badge: 'ENTERPRISE READY',
          details: [
            { label: '驱动引擎', value: 'Network Extension Framework' },
            { label: '授权状态', value: 'Surge Pro License 永久有效', highlight: true },
            { label: 'DNS 引擎', value: 'Async Parallel DoH / DoT' },
            { label: '网关模式', value: 'Enhanced Mode (增强模式就绪)' },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '导入 Surge 格式专属订阅托管配置',
        desc: '在机场后台找到【Surge 订阅】并复制链接。在 Surge 中点击【配置文件 ➔ 从 URL 下载】，粘贴链接并启用托管自动更新。',
        uiMockup: {
          title: 'Managed Profile 订阅托管',
          badge: 'HOSTED SYNC',
          details: [
            { label: '配置类型', value: 'Managed Remote Configuration' },
            { label: '策略组总数', value: '8 个业务策略组已激活', highlight: true },
            { label: '脚本注入', value: 'JavaScript 动态负载均衡' },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '开启 Enhanced Mode 并激活出站分流',
        desc: '在 Mac 菜单栏或 iOS 主屏点击【Start / 启动】。开启【Enhanced Mode (增强模式)】，享受系统级透明加速。',
        uiMockup: {
          title: 'Surge Live Dashboard 实时监控',
          badge: 'ZERO PACKET LOSS',
          details: [
            { label: '当前出站', value: '🇭🇰 HK Enterprise IEPL 01', highlight: true },
            { label: '实时带宽吞吐', value: 'Down: 125 MB/s | Up: 18 MB/s' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、高阶玩法：Surge Ponte 与跨设备网络中继</h2>
      <p>通过配置 Surge Ponte 协议，您可以将家中闲置的 Mac Mini 设置为私人网关出口，在户外通过 iPhone 无缝穿透回内网访问 NAS 与私有 AI 服务器。</p>
    `,
    faqs: [
      { q: 'Surge 值得普通用户购买吗？', a: '如果仅为日常看视频，Shadowrocket 或 Clash 性价比更高；若需要精细网络调试与 Mac 生产力无缝联动，Surge 绝对物有所值。' },
    ],
    relatedAnswers: [
      { title: 'IPLC 专线与普通公网中转有什么本质区别？', slug: 'iplc-vs-relay' },
      { title: '如何客观判断一个机场是否可靠稳定？', slug: 'how-to-judge' },
    ],
    optimizedAirports: [
      { name: 'SOGO 云', slug: 'sogo', startingPrice: 25, feature: '原生提供 Surge 托管格式订阅，专线极低抖动' },
      { name: '光速云', slug: 'guangsu', startingPrice: 7.5, feature: '全协议多出口适配，企业级 SLA 保障' },
    ],
  },
  {
    slug: 'quantumult-x',
    name: 'Quantumult X (圈 X)',
    platform: 'iOS (iPhone / iPad)',
    version: 'v1.4.0+ 进阶极客版',
    icon: '🔮',
    title: 'Quantumult X (圈 X) 完整图文教学：节点分流、MITM 证书重写与 JS 自动化脚本 (2026 版)',
    summary: '专为 iOS 进阶极客打造的 Quantumult X (圈 X) 图文指南。深入详解 UI 分流策略组搭建、HTTPS 解密重写、自动化签到脚本与多节点订阅聚合。',
    readingTime: '6 分钟阅读 · 1600 字',
    wordCount: 1600,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：脚本重写与规则分流的艺术</h2>
      <p>在 iOS 代理应用三剑客中，<strong>Quantumult X（圈 X）</strong>以其高度精细化的<strong>分流策略组机制</strong>与强大的<strong>JavaScript 脚本重写功能</strong>独树一帜。圈 X 的 UI 极具科技美感，拥有独特的风车交互面板。不仅支持 Shadowsocks、VLESS、Trojan 等主流协议，更能通过挂载规则集实现流媒体自动解锁判断、无感去广告与每日自动签到，是无数 iOS 资深玩家爱不释手的进阶首选。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并完成初始化环境配置',
        desc: '在美区 App Store 购买下载 Quantumult X（售价 $7.99），打开软件点击右下角【小风车】图标进入核心设置中心。',
        uiMockup: {
          title: 'Quantumult X 风车主控中心',
          badge: 'CORE READY',
          details: [
            { label: '软件架构', value: 'Quantumult X Engine Pro' },
            { label: '分流模式', value: 'Rule-Based 规则分流', highlight: true },
            { label: 'HTTP 后端', value: 'HTTP Backend Engine v1.4' },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '添加机场节点资源与订阅引用',
        desc: '在设置中找到【节点 ➔ 引用 (订阅)】，点击右上角【+】号，输入资源标签并粘贴机场提供的 Quantumult X 订阅链接，开启【更新】。',
        uiMockup: {
          title: 'Server Resource 节点资源库',
          badge: 'NODES LOADED',
          details: [
            { label: '资源标签', value: '2026 专线主力节点池' },
            { label: '加载节点', value: '42 个专线节点就绪', highlight: true },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '配置策略组与启动连接',
        desc: '在主界面长按右下角小风车按钮，可快速选择节点进行真连接延迟测试。选择绿色低延迟节点后，点击右上角启动开关即可。',
        uiMockup: {
          title: 'Live Proxy Matrix 实时流向面板',
          badge: 'ACTIVE PROXY',
          details: [
            { label: '当前主力节点', value: '🇭🇰 香港 01 IEPL [36ms]', highlight: true },
            { label: '运行状态', value: '🟢 智能分流运行中' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、进阶技巧：配置 MITM 证书实现广告拦截与多媒体解锁</h2>
      <p>进入设置中的【MitM】生成并安装本地根证书并在 iOS 系统设置中开启【完全信任】，即可激活强大的 HTTP 响应重写（Rewrite）功能。</p>
    `,
    faqs: [
      { q: '圈 X 相比小火箭有什么优势？', a: '圈 X 在 JavaScript 脚本重写、策略组细分和科技感 UI 上更胜一筹，适合喜欢自定义的进阶用户。' },
    ],
    relatedAnswers: [
      { title: 'Clash 与 Shadowrocket (小火箭) 应该怎么选？', slug: 'clash-vs-shadowrocket' },
    ],
    optimizedAirports: [
      { name: '灵猫网络', slug: 'lingmao', startingPrice: 15, feature: '企业级内网专线，完美适配圈 X 节点订阅格式' },
      { name: '唯兔云', slug: 'weitu', startingPrice: 15, feature: '大流量三网优化，支持多策略组分流' },
    ],
  },
  {
    slug: 'stash',
    name: 'Stash',
    platform: 'iOS / macOS / tvOS',
    version: 'v2.5.0+ Clash for Apple 经典版',
    icon: '💎',
    title: 'Stash 完整使用教程：Clash 规则在苹果 iOS/Mac 生态的完美化身 (2026 版)',
    summary: '专为习惯 Clash 配置的苹果用户打造的 Stash 图文指南。全面兼容 Clash Premium / Meta 规则集，支持 Apple TV (tvOS) 旁路加速与多端 iCloud 配置同步。',
    readingTime: '6 分钟阅读 · 1580 字',
    wordCount: 1580,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：为什么说 Stash 是 iOS 上的最佳 Clash 替代品？</h2>
      <p>很多习惯了在 Windows 或 Mac 上使用 Clash 规则集的开发者，在切换到 iPhone 或 Apple TV 时，往往希望找到一款能够<strong>100% 兼容 Clash .yaml 配置文件</strong>的专业工具。<strong>Stash</strong> 正是为此而生。它完全继承了 Clash 的规则语法、覆写（Override）机制与策略组架构，并且支持通过 iCloud 在 iPhone、iPad、Mac 与 Apple TV 之间无缝同步配置，是苹果全家桶用户的绝佳生产力利器。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并安装 Stash 正版应用',
        desc: '登录美区 Apple ID 在 App Store 购买下载 Stash（售价约 $3.99）。Stash 支持 Universal Purchase，一次购买即可在 iPhone、iPad 与 Apple TV 上通用。',
        uiMockup: {
          title: 'Stash Multi-Platform 运行架构',
          badge: 'CLASH COMPATIBLE',
          details: [
            { label: '语法核心', value: 'Clash Premium & Meta YAML' },
            { label: '多端同步', value: 'Apple iCloud 云端同步', highlight: true },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '一键导入 Clash 格式订阅配置',
        desc: '在 Stash 中点击【配置 ➔ 从 URL 下载】，直接粘贴机场后台提供的【Clash 订阅链接】，无需任何格式转换即可直接解析。',
        uiMockup: {
          title: 'Profile Downloader 订阅拉取',
          badge: 'YAML PARSED',
          details: [
            { label: '配置格式', value: 'Standard Clash YAML' },
            { label: '解析结果', value: '100% 规则组与节点已加载', highlight: true },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '一键开启代理与 Apple TV 联动',
        desc: '在首页点击【启动】按钮，并在策略组中选择延迟最低的香港或日本节点。',
        uiMockup: {
          title: 'Stash Dashboard 状态中心',
          badge: 'ACTIVE CONNECTED',
          details: [
            { label: 'Outbound Node', value: '🇭🇰 香港 01 IEPL 专线', highlight: true },
            { label: 'Apple TV 网关', value: 'AirDrop / tvOS 联动就绪' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、Apple TV (tvOS) 专属大屏 4K 追剧玩法</h2>
      <p>在 Apple TV App Store 中下载 Stash tvOS 版，一键同步 iPhone 上的订阅配置，即可直接在客厅电视上享受 YouTube 4K HDR、Netflix 杜比视界原生大屏观影体验。</p>
    `,
    faqs: [
      { q: 'Stash 能直接使用 Clash 的订阅吗？', a: '可以，100% 原生兼容所有标准 Clash / Mihomo 格式的订阅链接与配置文件。' },
    ],
    relatedAnswers: [
      { title: 'Clash 与 Shadowrocket (小火箭) 应该怎么选？', slug: 'clash-vs-shadowrocket' },
    ],
    optimizedAirports: [
      { name: '宇宙云', slug: 'yuzhou', startingPrice: 15, feature: '原生支持 Clash/Stash 订阅，流媒体全区解锁' },
      { name: '星岛梦', slug: 'xingdaomeng', startingPrice: 12, feature: '不限时流量包，多端同步超高性价比' },
    ],
  },
  {
    slug: 'v2rayn',
    name: 'v2rayN',
    platform: 'Windows PC',
    version: 'v6.30+ 经典原生版',
    icon: '⚡',
    title: 'v2rayN Windows 客户端新手从零配置指南：Xray/V2Ray 核心与路由规则配置 (2026 详尽版)',
    summary: '专为 Windows 用户量身打造的 v2rayN 图文教程。涵盖 Core 核心解压部署、订阅导入更新、活动服务器设定、系统代理与“绕过大陆”分流规则设置。',
    readingTime: '6 分钟阅读 · 1580 字',
    wordCount: 1580,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、经典长青：为什么很多老极客依然偏爱 v2rayN？</h2>
      <p>作为 Windows 平台历史上最经典的代理客户端之一，<strong>v2rayN</strong> 以其纯粹的原生架构、对 Xray-core / V2Ray-core 的深度支持以及极低的内存开销（常驻内存仅 20MB-40MB），历经多年依然活跃在各大技术社区。相比于其他大型图形化客户端，v2rayN 不会封装过多的黑盒逻辑，所有节点参数与路由规则均透明可见，是追求稳定、极简与原生协议特性的极客用户的不二之选。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载 v2rayN-With-Core 完整解压包',
        desc: '前往 GitHub 官方 Release 页面下载名为 v2rayN-With-Core.zip 的压缩包（必须包含 Xray-core 与 v2ray-core 核心文件）。下载完成后，将其完整解压至电脑的非系统盘目录（例如 D:\\Tools\\v2rayN），切勿放在 C 盘桌面或 Program Files 中以免引发权限拦截。',
        uiMockup: {
          title: 'v2rayN 目录解压与运行环境',
          badge: 'CORE PACK INTEGRATED',
          details: [
            { label: '核心架构', value: 'Xray-core v1.8.x + V2Ray-core' },
            { label: '运行依赖', value: 'Microsoft .NET 6.0 Desktop Runtime', highlight: true },
            { label: '解压路径', value: 'D:\\Tools\\v2rayN\\v2rayN.exe' },
            { label: '本地监听', value: 'SOCKS5: 10808 / HTTP: 10809' },
          ],
          hint: '💡 提示：双击 v2rayN.exe 启动。如果系统提示缺少 .NET 运行时，根据弹窗提示前往微软官网下载安装即可。',
        },
      },
      {
        stepNumber: '02',
        title: '添加机场订阅分组与更新节点列表',
        desc: '在软件顶部菜单栏依次点击【订阅分组】➔【订阅分组设置】➔ 点击【添加】。在弹出的窗口中：【别名】填入您的机场名称，【可选地址 (url)】中粘贴从机场官网复制的订阅链接，最后点击【确定】。返回主界面后，点击【订阅分组】➔【通过代理/不通过代理更新当前订阅】。',
        uiMockup: {
          title: 'Subscription Group 订阅管理',
          badge: 'UPDATE COMPLETED',
          details: [
            { label: '分组别名', value: '2026 专线主力订阅' },
            { label: '订阅 URL', value: 'https://sub-link.domain/api/***', highlight: true },
            { label: '节点加载状态', value: '36 个节点加载完毕' },
            { label: '协议支持', value: 'VLESS / VMess / Shadowsocks' },
          ],
          hint: '💡 提示：主界面出现密密麻麻的节点列表后，按 Ctrl + A 全选节点，按 Ctrl + O 即可快速测试所有节点的真连接延迟。',
        },
      },
      {
        stepNumber: '03',
        title: '设为活动服务器与开启系统代理',
        desc: '在测速结果中，左键选中一个延迟低（如 40ms）的香港或日本节点，鼠标右键点击并选择【设为活动服务器 (Set as active server)】（或者直接双击该节点，该节点整行会变成蓝色高亮）。',
        uiMockup: {
          title: 'Active Server 状态与右下角托盘控制',
          badge: 'ROUTING ACTIVE',
          details: [
            { label: '当前活动节点', value: '🇭🇰 HK 香港 IEPL 01 [活动]', highlight: true },
            { label: '系统代理模式', value: '自动配置系统代理 (System Proxy)' },
            { label: '路由规则', value: '绕过大陆 (Whitelist / Bypass CN)' },
            { label: '托盘图标颜色', value: '由蓝变红/变蓝（表示代理已就绪）' },
          ],
          hint: '💡 提示：在软件底部工具栏中，将【自动配置系统代理】打勾，【路由】选项切换为【绕过大陆】即可畅享外网！',
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、进阶路由自定义：GeoIP 与域名黑白名单配置</h2>
      <p>在 v2rayN 的【设置】➔【路由设置】中，您可以导入社区维护的 <code>geosite:cn</code> 与 <code>geoip:cn</code> 规则数据库，确保国内局域网、私有 IP（192.168.x.x）及国内大厂域名 100% 走直连通道，避免不必要的流量消耗。</p>
    `,
    faqs: [
      { q: '启动 v2rayN 时提示“缺少 Core 核心”？', a: '请确认您下载的是带 Core 的完整包（v2rayN-With-Core.zip），如果下载的是纯净包，需手动将 Xray-core.exe 放进软件根目录。' },
      { q: '退出 v2rayN 后电脑无法上网？', a: '退出软件前没有关闭系统代理。重新打开 v2rayN，将底部“自动配置系统代理”取消勾选，再正常退出即可恢复。' },
    ],
    relatedAnswers: [
      { title: '机场订阅链接导入后无法使用/节点全红怎么办？', slug: 'subscription-failed' },
      { title: 'Clash 有节点和延迟，但浏览器无法上网？', slug: 'clash-no-internet' },
    ],
    optimizedAirports: [
      { name: '唯兔云', slug: 'weitu', startingPrice: 15, feature: '三网优化中转，完美支持 v2rayN 原生 VLESS 协议' },
      { name: '可信云', slug: 'kexin', startingPrice: 16, feature: '大流量按月订阅，Windows 端极速兼容' },
    ],
  },
  {
    slug: 'v2rayng',
    name: 'v2rayNG',
    platform: 'Android (安卓原生装机必备)',
    version: 'v1.8.20+ 官方稳定版',
    icon: '🤖',
    title: 'v2rayNG 安卓客户端完整使用指南：订阅导入、分流模式与分应用代理 (2026 版)',
    summary: '专为 Android 安卓手机与平板用户打造的 v2rayNG 图文配置教程。手把手详解 APK 安装、订阅导入更新、真连接测速与“绕过局域网及大陆地址”分流配置。',
    readingTime: '6 分钟阅读 · 1550 字',
    wordCount: 1550,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：安卓生态装机量最大的网络工具</h2>
      <p><strong>v2rayNG</strong> 是 Android 平台最知名的开源代理客户端。它完全免费无广告，安装包体积小巧（约 25MB），对 Xray 内核与 VLESS/VMess/Trojan/Shadowsocks 协议支持极其稳定。此外，v2rayNG 独有的【分应用代理（Per-app Proxy）】功能，允许用户单独勾选让 Chrome、YouTube、Telegram 走代理，而微信、美团、抖音完全不走 VPN，有效避免了手机发热与续航衰减。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并安装 v2rayNG 正版 APK',
        desc: '从 GitHub 官方 Release 页面下载最新版 v2rayNG_xxx.apk 安装包并完成安装。启动时授权网络连接权限。',
        uiMockup: {
          title: 'v2rayNG Android 运行环境',
          badge: 'APK VERIFIED',
          details: [
            { label: '内核版本', value: 'Xray-core v1.8.x' },
            { label: '后台保活', value: '已加入系统电池优化白名单', highlight: true },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '添加订阅分组并一键更新节点',
        desc: '点击左上角【三道杠】菜单 ➔【订阅分组设置】➔ 点击右上角【+】号。填入备注并粘贴订阅链接保存。返回主界面点击右上角三点菜单 ➔【更新订阅】。',
        uiMockup: {
          title: 'Subscription Manager 订阅更新',
          badge: 'NODES SYNCED',
          details: [
            { label: '订阅分组', value: '我的专线主力订阅' },
            { label: '节点数量', value: '38 个可用节点', highlight: true },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '设置分流与一键开启连接',
        desc: '在左侧设置中将【预定义规则】设为【绕过局域网及大陆地址】，随后点击右下角【V 字圆形连接按钮】开启 VPN 加速。',
        uiMockup: {
          title: 'v2rayNG 运行状态面板',
          badge: 'CONNECTED ACTIVE',
          details: [
            { label: '连接状态', value: '🟢 已连接 (服务运行中)', highlight: true },
            { label: '当前节点', value: '🇭🇰 香港 01 IEPL 专线 [38ms]' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、进阶技巧：分应用代理与电池白名单设置</h2>
      <p>在设置中开启【分应用代理】，仅勾选需要外网访问的软件；并在手机系统设置中将 v2rayNG 加入【电池无限制白名单】，防止系统息屏后误杀后台。</p>
    `,
    faqs: [
      { q: '为什么测速显示 -1ms？', a: '检查手机系统时间是否准确，或尝试在右上角选择“测试真实连接延迟”。' },
    ],
    relatedAnswers: [
      { title: '机场订阅链接导入后无法使用/节点全红怎么办？', slug: 'subscription-failed' },
    ],
    optimizedAirports: [
      { name: '飞猫云', slug: 'feimao', startingPrice: 7, feature: '月付起步极低，安卓端极速适配' },
      { name: '快狸', slug: 'kuaili', startingPrice: 18, feature: '大带宽 VLESS 节点，手机秒开 4K' },
    ],
  },
  {
    slug: 'clash-meta-android',
    name: 'Clash Meta for Android (CMFA)',
    platform: 'Android (安卓高级分流神器)',
    version: 'v2.10.0+ 现代 Meta 内核版',
    icon: '⚡',
    title: 'Clash Meta for Android (CMFA) 完整图文教程：安卓端最强规则分流与订阅管理 (2026 版)',
    summary: '专为 Android 打造的基于 Mihomo (Clash.Meta) 内核的旗舰客户端图文教程。支持完整的策略组嵌套、VLESS/Hysteria2 协议与高级规则集分流。',
    readingTime: '6 分钟阅读 · 1580 字',
    wordCount: 1580,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：安卓端功能最全面的 Clash 替代工具</h2>
      <p><strong>Clash Meta for Android (CMFA / FlClash)</strong> 是目前安卓平台上对现代协议支持最完善、规则控制力最强的客户端。它完美移植了桌面端 Clash Verge 的策略组管理与分流逻辑，支持根据延迟自动测速选优、多订阅聚合以及暗色现代 UI，是安卓深度用户的装机神器。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载并安装 CMFA 安装包',
        desc: '从 GitHub 官方 Release 页面下载适用于 armeabi-v7a 或 arm64-v8a 架构的 APK 安装包并完成安装。',
        uiMockup: {
          title: 'CMFA Android 安装环境',
          badge: 'META CORE ACTIVE',
          details: [
            { label: '内核引擎', value: 'Mihomo Core v1.18+' },
            { label: '权限配置', value: 'VpnService 权限就绪', highlight: true },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '配置远程订阅链接',
        desc: '在软件主界面点击【配置 ➔ 新建配置 ➔ 从 URL 导入】，粘贴从机场后台复制的 Clash 订阅链接并保存。',
        uiMockup: {
          title: 'Profile Importer 订阅解析',
          badge: 'SUCCESSFUL',
          details: [
            { label: '配置类型', value: 'Remote Clash Meta Config' },
            { label: '节点数', value: '45 个专线节点已加载', highlight: true },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '选择规则模式与一键启动',
        desc: '在主界面模式选择中确认选择【Rule (规则模式)】，点击顶部【已停止】开关切换为【运行中】。',
        uiMockup: {
          title: 'CMFA Dashboard 运行监控',
          badge: 'ONLINE',
          details: [
            { label: '运行状态', value: '🟢 运行中 (Rule 智能分流)', highlight: true },
            { label: '当前出站', value: '香港 01 IEPL 专线 [35ms]' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、高阶技巧：自动测试并切换最低延迟节点</h2>
      <p>在策略组设置中开启【URL-Test / 自动选择】，CMFA 会每隔 10 分钟自动对节点池发起测速，并无缝自动切换至当前延迟最低的节点，保证游戏与会议 0 卡顿。</p>
    `,
    faqs: [
      { q: 'CMFA 耗电厉害吗？', a: '在开启规则分流且加入后台电池白名单后，全天耗电量通常低于 3%，几乎无感。' },
    ],
    relatedAnswers: [
      { title: 'Clash 有节点和延迟，但浏览器无法上网？', slug: 'clash-no-internet' },
    ],
    optimizedAirports: [
      { name: '宇宙云', slug: 'yuzhou', startingPrice: 15, feature: '全协议兼容，完美支持 CMFA 策略组分流' },
      { name: '极连云', slug: 'jilian', startingPrice: 16, feature: '大带宽 BGP 专线，安卓端极速秒开' },
    ],
  },
  {
    slug: 'sing-box',
    name: 'sing-box',
    platform: '全平台通用 (Windows / Mac / iOS / Android)',
    version: 'v1.9.0+ 现代化通用内核',
    icon: '📦',
    title: 'sing-box 下一代通用代理内核完整指南：超低内存开销与通用规则分流配置 (2026 精通篇)',
    summary: '深入解析 2026 新一代通用网络工具 sing-box。手把手详解多平台 GUI 客户端下载、标准 JSON 规则集配置、全协议混淆支持及内核级 TUN 虚拟网卡实战。',
    readingTime: '6 分钟阅读 · 1590 字',
    wordCount: 1590,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、未来的基石：为什么 sing-box 正在成为行业新标准？</h2>
      <p>如果说几年前是 Clash 统治了跨平台代理生态，那么从 2024 年至今，<strong>sing-box</strong> 凭借其惊人的架构设计，迅速崛起为整个代理技术圈的底层基石。sing-box 由知名开源团队从零用 Go 语言编写，彻底摒弃了历史遗留包袱。它的常驻内存占用通常仅为 <strong>15MB - 30MB</strong>（不到传统客户端的三分之一），原生支持 <strong>VLESS、ShadowTLS、Hysteria2、TUIC、WireGuard</strong> 等全部尖端协议，并拥有基于二进制 Rule Set 的超高性能规则匹配引擎，是追求极致性能与现代技术标准的终极之选。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '选择并下载适合您平台的 sing-box 图形客户端',
        desc: 'sing-box 官方与社区提供了跨平台的优秀图形界面（GUI）：Windows 用户可选择官方 sing-box for Windows 或 SFA-GUI；macOS 与 iOS 用户可直接在 App Store 搜索下载“sing-box”官方应用；Android 用户可通过 Google Play 或 GitHub 下载 APK。',
        uiMockup: {
          title: 'sing-box Cross-Platform 跨平台运行环境',
          badge: 'NEXT-GEN ARCH',
          details: [
            { label: '开发语言', value: 'Golang 高并发零内存拷贝' },
            { label: '常驻内存开销', value: '约 18.5 MB (极度轻量)', highlight: true },
            { label: '支持协议集', value: 'Hysteria2 / TUIC / VLESS / Trojan' },
            { label: '规则引擎', value: 'Binary Headless Rule Set (SRS)' },
          ],
          hint: '💡 提示：sing-box 官方移动端 App 完全免费，无需付费购买即可在非国区 App Store 下载安装。',
        },
      },
      {
        stepNumber: '02',
        title: '导入 sing-box 专用订阅或转换配置',
        desc: '登录支持 sing-box 格式的现代机场后台，点击【复制 sing-box 订阅】。打开客户端，切换至【Profiles (配置)】页面，点击右上角【+】号，选择【Remote (远程链接)】，粘贴订阅 URL 并保存，随后点击【Update (更新)】拉取配置。',
        uiMockup: {
          title: 'Profile Remote Source 订阅导入',
          badge: 'PARSER SUCCESS',
          details: [
            { label: '配置格式', value: 'sing-box JSON Config v1.9' },
            { label: '出站协议数量', value: 'Outbounds: 52 Nodes Loaded', highlight: true },
            { label: '分流规则集', value: 'SRS 自动编译分流数据库' },
            { label: 'DNS 策略', value: 'DoH (DNS-over-HTTPS) 深度防污染' },
          ],
          hint: '💡 提示：如果您的机场暂未提供原生 sing-box 订阅，可利用在线转换工具转换为 sing-box 格式后导入。',
        },
      },
      {
        stepNumber: '03',
        title: '启动内核级 TUN 模式并享受极致极速体验',
        desc: '在 sing-box 仪表盘中，将出站选择组（Outbound）切换为延迟最优的专线节点，随后直接打开主界面上的【Enable (启动)】开关。sing-box 会自动在系统中创建轻量级 TUN 虚拟网卡，为您提供极速无感的跨境网络体验。',
        uiMockup: {
          title: 'sing-box Dashboard 实时遥测面板',
          badge: 'RUNNING SMOOTH',
          details: [
            { label: 'Service Status', value: '🟢 Running (Active 00:42:10)' },
            { label: 'Memory Footprint', value: '19.2 MB (低功耗模式)', highlight: true },
            { label: 'Inbound Traffic', value: 'TUN Interface (Auto Route)' },
            { label: 'Active Outbound', value: '🇭🇰 HongKong IPLC Direct' },
          ],
          hint: '🎉 恭喜！您已成功接入新一代通用代理网络，享受极低延迟与极低功耗的上网体验。',
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、技术前瞻：Hysteria2 与 TUIC 协议对恶劣网络的拯救</h2>
      <p>sing-box 的核心王牌在于对基于 <strong>UDP / QUIC</strong> 开发的 <strong>Hysteria2 与 TUIC</strong> 协议的原生支持。在校园网晚高峰或偏远地区恶劣网络环境下，传统基于 TCP 的代理会因为丢包引发连锁重传降速；而 sing-box 运行 Hysteria2 协议能够通过定制的拥塞控制算法，在高达 20% 丢包率的弱网环境下依然维持 4K 视频秒开。</p>
    `,
    faqs: [
      { q: 'sing-box 与 Clash 相比哪个更好？', a: '日常新手使用 Clash Verge Rev 操作更为傻瓜；而追求低内存占用、多协议支持及前沿技术的极客用户强烈推荐 sing-box。' },
    ],
    relatedAnswers: [
      { title: '机场和传统 VPN 有什么本质区别？', slug: 'vpn-vs-airport' },
      { title: 'IPLC 专线与普通公网中转有什么本质区别？', slug: 'iplc-vs-relay' },
    ],
    optimizedAirports: [
      { name: '快狸', slug: 'kuaili', startingPrice: 18, feature: '原生提供新一代 sing-box 格式配置与极速 VLESS 专线' },
      { name: '极连云', slug: 'jilian', startingPrice: 16, feature: '全协议兼容，多端一键订阅' },
    ],
  },
  {
    slug: 'loon',
    name: 'Loon',
    platform: 'iOS (iPhone / iPad / Mac Catalyst)',
    version: 'v3.1.0+ 现代化插件版',
    icon: '🎈',
    title: 'Loon 完整图文使用指南：现代化插件化分流与轻量级代理神器 (2026 版)',
    summary: '面向 iOS 用户的 Loon 全流程图文教程。详解节点订阅导入、插件（Plugin）一键去广告、自动化策略组调度与现代轻量 UI 配置。',
    readingTime: '6 分钟阅读 · 1560 字',
    wordCount: 1560,
    lastUpdated: '2026-08-16',
    overviewHtml: `
      <h2>一、软件定位：优雅与强大并存的 iOS 新贵</h2>
      <p><strong>Loon</strong> 是近年来在 iOS 代理圈中热度极高的现代化工具（非国区 App Store 售价约 $5.99）。它将 Surge 的高级分流思想与小火箭的易用性完美融合，独创了<strong>“插件化（Plugins）一键安装体系”</strong>。无论是流媒体解锁检测、多媒体去广告还是各类复杂的分流规则，用户无需手动编写复杂的脚本，只需在 UI 中一键点击安装插件即可生效，视觉美观且操作极度丝滑。</p>
    `,
    steps: [
      {
        stepNumber: '01',
        title: '下载正版 Loon 应用',
        desc: '在美区 App Store 搜索购买下载 Loon，打开后允许网络权限并初始化基础配置。',
        uiMockup: {
          title: 'Loon iOS 初始化环境',
          badge: 'PLUGIN READY',
          details: [
            { label: '应用框架', value: 'Loon Engine v3.1+' },
            { label: '分流模式', value: 'Rule-Based 智能规则分流', highlight: true },
          ],
        },
      },
      {
        stepNumber: '02',
        title: '添加订阅与一键加载插件',
        desc: '在【配置 ➔ 订阅】中粘贴机场订阅链接拉取节点；在【插件】中心可一键订阅常用的分流规则集。',
        uiMockup: {
          title: 'Loon Subscription & Plugins',
          badge: 'PLUGINS LOADED',
          details: [
            { label: '节点池状态', value: '46 个专线节点已同步', highlight: true },
            { label: '生效插件', value: 'YouTube Premium 优化 + 去广告' },
          ],
        },
      },
      {
        stepNumber: '03',
        title: '测速选优并启动连接',
        desc: '在主界面点击节点测速，选中延迟最低的香港 IEPL 节点，点击顶部【Start】开关即可畅通无阻。',
        uiMockup: {
          title: 'Loon Dashboard 实时状态',
          badge: 'CONNECTED',
          details: [
            { label: '当前出站', value: '🇭🇰 香港 01 IEPL 专线 [36ms]', highlight: true },
            { label: '网络状态', value: '🟢 运行正常 (0 丢包)' },
          ],
        },
      },
    ],
    advancedTipsHtml: `
      <h2>二、高阶玩法：节点健康自动探测与故障切换</h2>
      <p>Loon 支持为策略组配置毫秒级健康探测间隔。一旦主力节点发生割接或波动，Loon 会在 3 秒内静默切换到第二备用节点，用户观影无感知。</p>
    `,
    faqs: [
      { q: 'Loon 与小火箭相比怎么选？', a: '小火箭入门更直观且价格便宜；Loon 在插件管理与 UI 现代化体验上更胜一筹。' },
    ],
    relatedAnswers: [
      { title: 'Clash 与 Shadowrocket (小火箭) 应该怎么选？', slug: 'clash-vs-shadowrocket' },
    ],
    optimizedAirports: [
      { name: '光年梯', slug: 'guangnianti', startingPrice: 18, feature: '全协议兼容，Loon 插件化导入极速适配' },
      { name: '二猫云', slug: 'ermao', startingPrice: 20, feature: '纯专线交付，多端协同低延迟' },
    ],
  },
];

export function getClientBySlug(slug: string): ClientGuide | undefined {
  return clientsData.find((c) => c.slug === slug);
}

export function getAllClients(): ClientGuide[] {
  return clientsData;
}
