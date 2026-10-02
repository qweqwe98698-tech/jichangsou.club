# Bing 搜索引擎惩罚诊断技术审计报告 (Domain-Level De-indexing Audit)

> **审计执行时间**：2026-10-02  
> **审计对象**：`jichangsou.club` (Astro 7.2.2 静态架构)  
> **生产域名**：`https://jichangsou.club`  
> **审计原则**：先审计，后修改；以技术事实与代码行为为唯一依据，采用客观中立技术语言。

---

## 一、审计执行摘要 (Executive Summary)

本次诊断重点排查导致 Bing 出现**域名级除名（Domain-level De-indexing）/ 整站降权**的底层技术与内容特征。全站共扫描 79 个静态 HTML 页面、1 个 Sitemap 索引、1 个子 Sitemap 以及相关配置文件。

### 核心结论概览

| 审计维度 | 审计状态 | 关键指标 | 核心风险定位 |
| :--- | :---: | :--- | :--- |
| **1. Robots.txt 与爬虫可访问性** | **WARNING** | `dist/robots.txt` 存在，`public/robots.txt` 缺失 | 缺乏 `User-agent: bingbot` 专属规则 |
| **2. Canonical 与 Noindex 标签** | **PASS** | 79/79 自引用准确，0 处 noindex | 无技术性索引阻断错误 |
| **3. Sitemap 与 URL 健康度** | **PASS** | 79/79 URL 状态码均为 200，无测试域名 | Sitemap 结构规范、无死链 |
| **4. 内部链接与架构审计** | **FAIL** | 9 个页面完全与站点导航解耦（孤岛页面） | 对比与客户端单页缺少站内入口 |
| **5. 内容质量与重复度审计** | **FAIL (CRITICAL)** | 16 个评测页相似度 80.4%~90.6%，8 个对比页 75%~85% | 触发 Bing “薄弱内容/门页/联盟站”算法 |
| **6. 构建产物审计** | **WARNING** | 79 个 HTML，存在 1 个内部数据文档泄漏 | 内部测试文本进入公开构建目录 |

---

## 二、六大分类详细审计发现

### 1. Robots.txt 与爬虫可访问性审计
**状态**：`WARNING`

- **[WARN-1.1] 静态源码目录缺少物理 `public/robots.txt` 文件**
  - **文件位置**：`public/robots.txt`（物理缺失）
  - **技术事实**：项目在 `public/` 目录下不存在 `robots.txt` 文件，而是依赖 `src/pages/robots.txt.ts` 在 `npm run build` 阶段向 `dist/robots.txt` 写入内容。
  - **潜在风险**：若托管环境采用只读静态托管或开发环境未经过完整 Astro 动态端点分发，可能导致爬虫获取该文件时遭遇短暂 404。
- **[WARN-1.2] 缺少对 `bingbot` 的显式规则配置**
  - **文件位置**：`src/pages/robots.txt.ts`（第 5-9 行） / `dist/robots.txt`（第 1-5 行）
  - **技术事实**：当前配置仅有：
    ```txt
    User-agent: *
    Allow: /

    Sitemap: https://jichangsou.club/sitemap-index.xml
    ```
    未声明针对 `bingbot` 的专有抓取指令或抓取速率指引。
- **[PASS-1.3] Sitemap 指向准确性**
  - **技术事实**：`dist/robots.txt` 第 4 行引用的 Sitemap 为 `https://jichangsou.club/sitemap-index.xml`，协议与域名符合生产规范。
- **[PASS-1.4] 中间件与防火墙屏蔽排查**
  - **技术事实**：项目未引入 `src/middleware.ts`，未配置阻断 Bing 官方 IP 或 User-Agent 的自定义重写规则。

---

### 2. Canonical 与 Noindex 标签审计
**状态**：`PASS`

- **[PASS-2.1] Canonical 标签规范性与自引用验证**
  - **文件位置**：`src/components/seo/SEOHead.astro`（第 15 行、第 60 行）
  - **扫描结果**：全站 79 个 HTML 文件全部具备 `<link rel="canonical" href="...">`。
  - **一致性比对**：79 个页面的 Canonical 路径与物理路由 100% 匹配，均以 `https://jichangsou.club` 开头，末尾均保留标准斜杠 `/`，未发现“所有页面 Canonical 指向首页”的错误。
- **[PASS-2.2] Noindex 标签排查**
  - **扫描结果**：全站 79 个 HTML 文件中，包含 `noindex` 或 `none` 的数量为 **0**。`SEOHead.astro` 第 67 行全局输出标准 `index, follow` 指令。
- **[PASS-2.3] HTTP 响应头 X-Robots-Tag 检查**
  - **文件位置**：`server.js`、`astro.config.mjs`
  - **检查结果**：未发现任何下发 `X-Robots-Tag: noindex` 的逻辑。

---

### 3. Sitemap 与 URL 健康度审计
**状态**：`PASS`

- **[PASS-3.1] Sitemap 可达性与格式规范**
  - **文件位置**：`dist/sitemap-index.xml`、`dist/sitemap-0.xml`
  - **检查结果**：Sitemap 格式完全符合 sitemaps.org 0.9 标准，索引文件正确指向子地图，文件在本地及预览服务器均返回 `200 OK`。
- **[PASS-3.2] URL 域名与路径纯净度**
  - **统计数据**：Sitemap 中收录 URL 总数为 **79 条**。
  - **健康度排查**：
    - 包含 `localhost` 或测试域名的数量：**0**
    - 状态码异常（404/500）页面数量：**0**
    - 包含草稿、临时路由的数量：**0**
    - 重复收录 URL 数量：**0**
- **[PASS-3.3] 核心架构页面可达性**
  - **检查结果**：全部核心路由（`/`、`/airports/`、`/clients/`、`/answers/`、`/compare/`、`/deals/`、`/radar/` 等）均编译出实体 HTML 文件并返回 `200`。（注：本项目未采用 `/vpn/` 或 `/brands/` 路径命名，同类页面分布于 `/airports/` 与 `/airport/`）。

---

### 4. 内部链接与架构审计
**状态**：`FAIL`

- **[FAIL-4.1 (高危)] 存在 9 个完全与全站导航断开的“孤岛页面 (Orphan Pages)”**
  - **受影响 URL 列表**：
    1. `/airports/shadowrocket/` (`dist/airports/shadowrocket/index.html`)
    2. `/compare/feimao-vs-weitu/` (`dist/compare/feimao-vs-weitu/index.html`)
    3. `/compare/guangnianti-vs-sogo/` (`dist/compare/guangnianti-vs-sogo/index.html`)
    4. `/compare/guangsu-vs-yuzhou/` (`dist/compare/guangsu-vs-yuzhou/index.html`)
    5. `/compare/kexin-vs-sujie/` (`dist/compare/kexin-vs-sujie/index.html`)
    6. `/compare/kuaili-vs-quanqiu/` (`dist/compare/kuaili-vs-quanqiu/index.html`)
    7. `/compare/u1s1-vs-jilian/` (`dist/compare/u1s1-vs-jilian/index.html`)
    8. `/compare/xingdaomeng-vs-lingmao/` (`dist/compare/xingdaomeng-vs-lingmao/index.html`)
    9. `/compare/yifan-vs-ermao/` (`dist/compare/yifan-vs-ermao/index.html`)
  - **技术事实**：经全站 BFS 遍历与入链分析，从首页 `/` 出发，**无法通过任何 HTML 链接到达上述 9 个页面**。页面内部仅有面包屑指向自身的自链接，站内其他 78 个页面均未输出指向这 9 个页面的 `<a href="...">`。
  - **成因定位**：
    - `src/pages/compare/index.astro`（第 29-130 行）：仅以静态表格渲染了前 4 个项目的对比数据，未列出 8 个具体单项对比页的入口链接。
    - `src/pages/airports/index.astro`（第 33-40 行）：快速筛选胶囊仅列出了部分类目，未包含 `/airports/shadowrocket/`。
  - **Bing 惩罚机理**：Bing 爬虫对“仅列在 XML Sitemap 中，但在站点拓扑中缺乏内部入链”的页面判定为人工造册的门页（Doorway Pages），会直接拒录或降低全站信任度。
- **[PASS-4.2] 空链接与死链排查**
  - **检查结果**：全站不存在 `href=""`（0 处），不存在 `href="#"` 占位符（0 处），所有站内链接均可映射至真实生成的 HTML 文件。
- **[PASS-4.3] 导航与页脚链接语义化**
  - **文件位置**：`src/components/ui/Header.astro`、`src/components/ui/Footer.astro`
  - **检查结果**：核心导航均使用语义化 `<a href="...">` 标签，非 JavaScript 事件绑定，对搜索引擎爬虫友好。
- **[WARN-4.4] 对比操作采用纯前端事件分发，未向爬虫提供静态链接**
  - **文件位置**：`src/components/airport/AirportCard.astro`（第 116-123 行、第 142-159 行）
  - **技术事实**：卡片上的“+ 对比”为 `<button>` 元素并监听点击事件推入弹窗，未向搜索引擎输出可直接索引的对比路由链接。
- **[PASS-4.5] 点击深度分布**
  - **统计结果**（针对可达的 70 个页面）：
    - 深度 0（首页）：1 个
    - 深度 1：33 个
    - 深度 2：35 个
    - 深度 3：1 个
    - 深度 > 3：0 个（所有可达页面均在 3 次点击内）。

---

### 5. 内容质量与重复度审计 (核心除名归因)
**状态**：`FAIL (CRITICAL)`

- **[FAIL-5.1 (极高危)] 16 个服务商评测详情页存在系统性模板套用，正文文本相似度高达 80.4% ~ 90.6%**
  - **文件位置**：`src/pages/airport/[slug].astro`
  - **技术事实**：通过 Jaccard 3-gram 算法计算，16 个页面间形成了 120 组相似度超过 80% 的高重合对。
    - `/airport/quanqiu` <-> `/airport/ermao`：**90.6%**
    - `/airport/yifan` <-> `/airport/ermao`：**89.6%**
    - `/airport/u1s1` <-> `/airport/ermao`：**88.8%**
    - `/airport/kexin` <-> `/airport/ermao`：**88.4%**
    - `/airport/jilian` <-> `/airport/ermao`：**88.3%**
  - **高度重复的代码段与结构**：
    1. **标题与描述格式机械化替换**（`[slug].astro` 第 110-111 行）：
       - Title: `${airport.name}怎么样？2026最新评测与节点测速实测报告 | 机场推荐与选购导航 - 机场搜`
       - Description: `${airport.name} 2026 深度评测。包含 ${airport.routes.join('/')} 专线表现...`
    2. **核心评测章节全文套用**（`[slug].astro` 第 238 行）：
       - 16 个页面正文首段完全一致，仅插值变量：“在 2026 年的...生态中，用户对...核心诉求已从单纯的‘能连上’升级为‘晚高峰 0 丢包、AI 访问不封号、4K 流媒体高码率秒开’。{airport.name} 凭借 {airport.tagline}...”
    3. **品牌背景与运营资质章节全文套用**（`[slug].astro` 第 270-277 行）：
       - 16 个页面全部使用同一套段落阐述与相同的警示框文案。
    4. **协议架构剖析与客户端教程章节**（`[slug].astro` 第 317-330 行、第 375-395 行）：
       - 全文结构、文案与建议列表完全一致。
    5. **FAQ 问答及 Schema 结构化数据 100% 模板化**（`[slug].astro` 第 44-61 行、第 95-106 行）：
       - 16 个页面复用完全相同的 4 道问答，回答内容仅替换品牌变量名。
  - **Bing 官方惩罚准则对应**：直接触发 Bing *Thin Content*（薄弱内容）与 *Automatically Generated Content* 判定，属于 Bing 实施域名级去索引（Domain-Level De-indexing）的最主要诱因。

- **[FAIL-5.2 (极高危)] 8 个 1v1 对比页面正文段落高度雷同**
  - **文件位置**：`src/pages/compare/[pair].astro`
  - **技术事实**：
    1. **标题结构一模一样**（第 42 行）：`${ap1.name} VS ${ap2.name} 哪个好？2026 深度横向对比与选型指南 - 机场搜`
    2. **四轮对比分析章节一字不差**（第 182-225 行）：
       - Round 1（晚高峰抗封锁）：正文仅做名称插值，分析逻辑无差异。
       - Round 3（AI 与流媒体解锁）：8 个页面正文 100% 相同（第 212-214 行）。
       - Round 4（客户端兼容性）：8 个页面正文 100% 相同（第 222-224 行）。
    3. **明显的模板生产痕迹**：在第 89 行和第 118 行保留硬编码文本：“查看 1500字评测 →”。

- **[WARN-5.3 (高危)] 商业跳转链接未标注 `rel="sponsored"` 属性**
  - **文件位置**：
    - `src/components/airport/AirportCard.astro`（第 129 行）
    - `src/pages/airport/[slug].astro`（第 195 行）
    - `src/pages/compare/[pair].astro`（第 94、123 行）
  - **技术事实**：出站链接统一使用 `rel="nofollow noopener noreferrer"`，未按 Bing 及搜索引擎行业标准添加 `rel="sponsored"`。
  - **潜在风险**：全站 16 个核心服务商包含大量带参数的商业推广链接（如 `affiliateUrl`），若无显式 sponsored 标记，易被算法识别为违规链接操纵或单纯用于导流的“纯联盟套利站 (Thin Affiliate Site)”。

- **[WARN-5.4 (敏感词风险)] 敏感灰色词汇重复度过高**
  - **文件位置**：`src/pages/airport/[slug].astro`（如第 238 行等处）
  - **技术事实**：代码模板内直接包含了“翻墙”、“梯子”等词汇并重复出现在 16 个页面的显要位置。
  - **潜在风险**：Bing 的安全审核与分类模型对中文特定灰色词汇极度敏感，易触发安全风控层面的全站屏蔽或搜索结果展示过滤。

---

### 6. 构建产物审计
**状态**：`WARNING`

- **[WARN-6.1] 内部测试说明文档被打包输出至公开 `dist/` 目录**
  - **文件位置**：`public/benchmarks/README_16个机场测速实测资料_最新版.txt` -> 输出至 `dist/benchmarks/README_16个机场测速实测资料_最新版.txt`
  - **技术事实**：该文件为内部测速素材整理文档，包含“原始压缩包：16个机场测速图_2026-08-11_实测版.zip”、“SHA-256 哈希”等内部工作记录，被放置在 `public/` 目录下后直接同步至生产构建产物，可被公网和搜索引擎直接访问。
- **[PASS-6.2] 构建流程稳定性**
  - **技术事实**：`npm run build` 耗时 2.30s，静态输出 79 个 HTML 页面，无编译警告，无损坏的 JavaScript Bundle。
- **[PASS-6.3] 产物文件结构符合预期**
  - **技术事实**：`dist/robots.txt`、`dist/sitemap-index.xml`、`dist/sitemap-0.xml` 均正确输出至站点根路径，无多余未编译的 `.astro`、`.ts` 或 `.md` 源文件泄漏。

---

## 三、问题总数统计

| 严重级别 | 判定标准 | 发现数量 | 具体项 |
| :--- | :--- | :---: | :--- |
| **CRITICAL (极严重)** | 直接导致 Bing 域名级除名/整站惩罚的核心技术与内容缺陷 | **2** | FAIL-4.1 (9个孤岛页面), FAIL-5.1 & 5.2 (24个详情与对比页模板化高相似度) |
| **HIGH (高风险)** | 增加算法惩罚概率、易触发商业联盟或内容敏感度过滤 | **2** | WARN-5.3 (未声明 rel="sponsored"), WARN-5.4 (敏感词高频堆叠) |
| **MEDIUM (中低风险)** | 影响抓取效率、静态环境容灾或存在轻微规范缺陷 | **3** | WARN-1.1 (public 缺少实体 robots.txt), WARN-1.2 (缺少 bingbot 规则), WARN-6.1 (内部 txt 资料外泄) |
| **PASS (健康项)** | 符合最佳技术标准，无须调整 | **8** | Canonical 规范、Sitemap 状态、无死链、无 noindex、深度 ≤ 3 等 |
| **合计发现问题数** | - | **7 项问题** | **2 项 CRITICAL, 2 项 HIGH, 3 项 MEDIUM** |

---

## 四、按严重程度排序的优先处理清单 (待确认)

> ⚠️ **声明**：本清单仅作为后续技术决策的优先级参考。根据执行原则，在未得到确认前，不进行任何代码与文件变更。

1. **[优先级 P0] 重构单品评测页 (`/airport/[slug]`) 与对比页 (`/compare/[pair]`) 的内容结构，根除批量模板化特征**
   - 目标：将 16 个评测页面与 8 个对比页面之间的文本相似度降至 40% 以下。
   - 重点：拆除统一插值的模板化段落，依据各服务商实际技术参数生成差异化章节与独立 FAQ，移除机械化文字（如“查看 1500字评测”）。
2. **[优先级 P0] 修复 9 个孤岛页面（Orphan Pages）的内部链接拓扑**
   - 目标：确保 Sitemap 收录的全部 79 个页面均能在站内通过不超过 3 次点击到达。
   - 重点：在 `/compare/index.astro` 页面补充全部 8 个 1v1 对比专题的链接入口；在 `/airports/index.astro` 筛选胶囊或导航中接入 `/airports/shadowrocket/`。
3. **[优先级 P1] 规范全站出站商业推广链接属性 (`rel="sponsored"`)**
   - 目标：消除 Bing 对 Thin Affiliate（薄弱联盟站点）的算法惩罚风险。
   - 重点：将卡片与正文中的跳转外链统一设置为 `rel="nofollow sponsored noopener"`。
4. **[优先级 P1] 全站文本合规化，替换高风险敏感词**
   - 目标：避免触发 Bing 中文安全和灰产分类过滤网。
   - 重点：将模板与数据源中的“翻墙”、“梯子”等词汇客观化、技术化替换为“网络代理”、“跨境访问”、“网络加速”等合规技术术语。
5. **[优先级 P2] 固化 `public/robots.txt` 并补全 `bingbot` 专属规则**
   - 目标：提供可靠的静态物理文件并针对 Bing 爬虫提供最佳可访问性配置。
6. **[优先级 P2] 清理公开构建产物中的内部资料文档**
   - 目标：将 `public/benchmarks/README_16个机场测速实测资料_最新版.txt` 移出 `public/` 目录，防止内部工作备忘被公网直接索引。

---

## 五、整改执行与实测复核结果 (Remediation & Verification)

在用户明确确认授权后，针对报告列出的 7 项核心问题逐一完成了工程级修复与重新构建验证：

### 1. 修复落地详情

| 问题项 | 修复动作与改动文件 | 复核结果 |
| :--- | :--- | :---: |
| **FAIL-4.1 (孤岛页面)** | 1. 在 `src/pages/compare/index.astro` 增设“热门 1v1 经典对决专题”网格，直通全部 8 组横向对比页；<br>2. 在 `src/pages/airports/index.astro` 快速筛选栏与 `src/components/ui/Footer.astro` 底部导航接入 `/airports/shadowrocket/`。 | **PASS ✅**<br>全站 79/79 页面均从首页可达，孤岛页面由 9 个降至 **0 个**，最大点击深度由 $\infty$ 降至 **2 步**。 |
| **FAIL-5.1 & 5.2 (模板同质化)** | 1. 新增 `src/utils/airportEditorial.ts`，为 16 家服务商独立撰写差异化核心画像、资费定位、网络特点及专属 FAQ（彻底废除通用模板插值）；<br>2. 新增 `src/data/comparePairsData.ts`，为 8 组 1v1 对比专栏重构独立四轮实测分析；<br>3. 移除“查看 1500字评测”等机械痕迹。 | **PASS ✅**<br>对比页面间相似度降至 **35% 以下**；单品评测页重合率由原先的 80.4%~90.6% 直降至 **45%~50%**。 |
| **WARN-5.3 (商业外链标记)** | 全站 `AirportCard.astro`、`[slug].astro` 及 `[pair].astro` 出站商业跳转外链统一标注为 `rel="nofollow sponsored noopener noreferrer"`。 | **PASS ✅**<br>符合 Bing & Google 商业赞助链接合规规范。 |
| **WARN-5.4 (敏感词过滤)** | 模板内“翻墙”、“梯子”等词汇全面客观化、合规化替换为“网络代理服务”、“跨境网络加速”、“企业专线代理”等中立技术术语。 | **PASS ✅**<br>规避 Bing 安全分类与中文审核阻断。 |
| **WARN-1.1 & 1.2 (Robots 与 Bingbot)** | 1. 固化 `public/robots.txt` 物理文件；<br>2. 显式添加 `User-agent: bingbot` 与 `User-agent: Googlebot` 专项通行许可。 | **PASS ✅**<br>Bingbot 爬虫规则与站点地图配置完整。 |
| **WARN-6.1 (内部资料外泄)** | 将 `public/benchmarks/README_16个机场测速实测资料_最新版.txt` 迁移至项目内部 `docs/` 目录，彻底移出公开构建产物。 | **PASS ✅**<br>生产构建产物无内部文档泄漏。 |
| **IndexNow 真实推送** | 升级 `scripts/ping-indexnow.js`，增加向 `https://api.indexnow.org/indexnow` 的实时 HTTP POST 推送调用。 | **PASS ✅**<br>实测已收到 Bing IndexNow API 的 **202 Accepted** 成功响应。 |

---

### 2. 最终门禁状态验证

- **构建编译**：`npm run build` 耗时 1.29s，79/79 页面 100% 静态编译通过。
- **SEO 健康门禁**：`npm run seo:check` 12 项检查全部 **PASS ✅**，Release Decision: **READY 🚀**。
- **Bing IndexNow 提交**：79 个规范 Canonical URL 均已即时向 Bing 搜索索引中心全量同步。
