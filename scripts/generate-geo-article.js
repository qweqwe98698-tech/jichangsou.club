import fs from 'fs';
import path from 'path';

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================
const TOPIC_MATRIX_PATH = path.resolve('src/data/topicMatrix.json');
const ARTICLES_DIR = path.resolve('src/data/articles');
const ANSWERS_DATA_PATH = path.resolve('src/data/answersData.ts');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const MODEL_NAME = 'deepseek-chat';

// ==========================================
// ANTI-AI CLICHE PATTERNS & SANITIZATION
// ==========================================
const BANNED_AI_PATTERNS = [
  /随着[^，。]{2,20}的(?:飞速|迅速|蓬勃|快速)?发展/g,
  /总而言之/g,
  /综上所述/g,
  /不可否认的是/g,
  /值得注意的是/g,
  /需要指出的是/g,
  /毋庸置疑/g,
  /从某种意义上说/g,
  /如同一把双刃剑/g,
  /在这个数字化(?:时代|浪潮)/g,
  /显而易见的是/g,
  /说白了/g,
  /说穿了/g,
  /先说结论/g,
  /不是([^，。]+)而是/g,
  /并非([^，。]+)而是/g,
  /看似([^，。]+)实则/g,
  /表面上?([^，。]+)实际上?/g,
];

/**
 * Clean text to eliminate common LLM robotic artifacts & enforce clean prose
 */
function sanitizeProse(text) {
  let cleaned = text;

  // Replace em-dashes (—— or —) with comma or period
  cleaned = cleaned.replace(/——/g, '，').replace(/—/g, '，');

  // Strip banned AI cliche markers
  for (const pattern of BANNED_AI_PATTERNS) {
    cleaned = cleaned.replace(pattern, (match, p1) => {
      // If it captured a group (e.g. 不是...而是), reformulate naturally
      if (p1) return `${p1.trim()}。`;
      return '';
    });
  }

  // Remove consecutive commas or awkward punctuation caused by removal
  cleaned = cleaned.replace(/，，+/g, '，').replace(/，。/g, '。').replace(/、、+/g, '、');

  return cleaned;
}

/**
 * Validate and sanitize slug to ensure organic, human-style URL
 */
function validateAndSanitizeSlug(rawSlug) {
  let slug = (rawSlug || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  // Anti-batch pattern: reject mechanical sequential slugs like 'article-1', 'post-002', 'topic-12'
  if (/^(article|post|topic|item|page)-?\d+$/i.test(slug)) {
    throw new Error(`Insecure robotic slug pattern detected: "${slug}". Must use descriptive semantic words.`);
  }

  if (slug.length < 5) {
    slug = `network-engineering-${Date.now().toString(36)}`;
  }

  return slug;
}

/**
 * Count Chinese and English words
 */
function calculateWordCount(html) {
  const plainText = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/[a-zA-Z0-9_-]+/g) || []).length;
  return Math.round(chineseChars + englishWords * 0.7);
}

/**
 * Retrieve all currently existing answer slugs to avoid broken internal links
 */
function getExistingAnswerSlugs() {
  const slugs = new Map();
  // 1. Read answersData.ts built-in slugs
  if (fs.existsSync(ANSWERS_DATA_PATH)) {
    const content = fs.readFileSync(ANSWERS_DATA_PATH, 'utf-8');
    const slugMatches = content.matchAll(/slug:\s*['"]([a-z0-9-]+)['"]/g);
    for (const m of slugMatches) {
      slugs.set(m[1], true);
    }
  }
  // 2. Read existing src/data/articles/*.json
  if (fs.existsSync(ARTICLES_DIR)) {
    const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.json'));
    for (const f of files) {
      try {
        const item = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8'));
        if (item.slug) slugs.set(item.slug, true);
      } catch (e) {}
    }
  }
  return slugs;
}

/**
 * Filter and ensure related questions only link to real, existing pages
 */
function filterValidRelatedQuestions(rawQuestions, currentSlug, validSlugsMap) {
  const verified = [];
  const defaultFallbacks = [
    { title: '机场和传统 VPN 有什么本质区别？2026 深度原理解析与选型指南', slug: 'vpn-vs-airport' },
    { title: 'IPLC 专线与普通公网中转有什么本质区别？', slug: 'iplc-vs-relay' },
    { title: 'Claude 官方封号防范实战：原生住宅 IP 判定与网络分流', slug: 'claude-ai-ban-prevention' },
    { title: 'Clash DNS 泄露与 Fake-IP 模式调优实战', slug: 'clash-dns-leak-tuning' },
    { title: 'ChatGPT Access Denied 报错排查与真实 IP 泄露防护', slug: 'chatgpt-access-denied' },
    { title: 'VLESS Reality 与 Hysteria2 协议底层原理对比与场景选型', slug: 'vless-reality-vs-hysteria2' },
  ];

  if (Array.isArray(rawQuestions)) {
    for (const q of rawQuestions) {
      if (q && q.slug && q.slug !== currentSlug && validSlugsMap.has(q.slug)) {
        verified.push({ title: q.title || '相关问答', slug: q.slug });
      }
    }
  }

  // Ensure 3 valid related questions
  for (const fb of defaultFallbacks) {
    if (verified.length >= 3) break;
    if (fb.slug !== currentSlug && !verified.some((v) => v.slug === fb.slug)) {
      verified.push(fb);
    }
  }

  return verified;
}

/**
 * Remove invalid internal answer links from contentHtml to prevent dead link warnings
 */
function sanitizeInternalLinksInHtml(html, validSlugsMap) {
  return html.replace(/<a\s+href=["']\/answers\/([a-z0-9-]+)\/?["']>(.*?)<\/a>/gi, (match, slug, text) => {
    if (validSlugsMap.has(slug)) {
      return match;
    }
    return `<strong>${text}</strong>`;
  });
}

// ==========================================
// CORE PUBLISHING LOGIC
// ==========================================
async function main() {
  console.log('\n🚀 ========================================================');
  console.log('   GEO & SEO 万字级专题主线矩阵文章 自动化发布系统');
  console.log('   Execution Time:', new Date().toISOString());
  console.log('========================================================\n');

  if (!fs.existsSync(TOPIC_MATRIX_PATH)) {
    console.error(`❌ Matrix file not found at: ${TOPIC_MATRIX_PATH}`);
    process.exit(1);
  }

  const matrixData = JSON.parse(fs.readFileSync(TOPIC_MATRIX_PATH, 'utf-8'));
  const topics = matrixData.topics || [];
  const validSlugsMap = getExistingAnswerSlugs();

  // Find next unpublished topic
  let selectedTopic = topics.find((t) => !t.published);

  if (!selectedTopic) {
    console.log('⚠️ All pre-configured topics have been published! Extending topic matrix automatically...');
    selectedTopic = await extendTopicMatrixWithDeepSeek(matrixData);
  }

  console.log(`📌 Selected Topic for Publication:`);
  console.log(`   ID:          ${selectedTopic.id}`);
  console.log(`   Title:       ${selectedTopic.title}`);
  console.log(`   Category:    ${selectedTopic.category}`);
  console.log(`   Target Slug: ${selectedTopic.slug}`);
  console.log(`   Focus Angle: ${selectedTopic.focusAngle}\n`);

  if (!DEEPSEEK_API_KEY) {
    console.warn('⚠️ DEEPSEEK_API_KEY environment variable is not set!');
    console.warn('   Running in local Dry-Run / Test mode with mock generation.');
    await generateMockArticle(selectedTopic, matrixData, validSlugsMap);
    return;
  }

  // Generate article using DeepSeek API
  console.log('📡 Calling DeepSeek API to generate high-authority GEO/SEO article...');
  const articleData = await generateArticleWithDeepSeek(selectedTopic);

  // Validate and post-process
  const finalSlug = validateAndSanitizeSlug(articleData.slug || selectedTopic.slug);
  const sanitizedQuickAnswer = sanitizeProse(articleData.quickAnswer);
  const sanitizedContentHtml = sanitizeInternalLinksInHtml(sanitizeProse(articleData.contentHtml), validSlugsMap);
  const finalWordCount = calculateWordCount(sanitizedContentHtml);
  const readingMinutes = Math.max(5, Math.ceil(finalWordCount / 350));
  const readingTimeString = `${readingMinutes} 分钟阅读 · ${finalWordCount} 字`;
  const todayDate = new Date().toISOString().split('T')[0];
  const safeRelatedQuestions = filterValidRelatedQuestions(articleData.relatedQuestions, finalSlug, validSlugsMap);

  const finalizedArticle = {
    slug: finalSlug,
    title: articleData.title || selectedTopic.title,
    category: articleData.category || selectedTopic.category || '技术科普',
    readingTime: readingTimeString,
    lastUpdated: todayDate,
    wordCount: finalWordCount,
    quickAnswer: sanitizedQuickAnswer,
    contentHtml: sanitizedContentHtml,
    traps: (articleData.traps || []).map((t) => sanitizeProse(t)),
    relatedQuestions: safeRelatedQuestions,
    nextHub: articleData.nextHub || {
      title: '客户端配置与新手教程专区',
      desc: '图文详解 Clash、小火箭、v2rayN 与 sing-box 下载与智能分流配置。',
      url: '/clients/',
      cta: '前往客户端教程中心 →',
    },
    nextSelection: articleData.nextSelection || {
      title: '下一步决策：挑选适合自己的稳定专线机场',
      desc: '已为您核验 16 家主力机场的专线延迟、价格阶梯与实测测速数据。',
      url: '/airports/stable/',
      cta: '查看稳定专线机场推荐 →',
    },
  };

  // Ensure articles directory exists
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  // Save atomic JSON article
  const articleFilePath = path.join(ARTICLES_DIR, `${finalSlug}.json`);
  fs.writeFileSync(articleFilePath, JSON.stringify(finalizedArticle, null, 2), 'utf-8');
  console.log(`\n✅ Saved article JSON to: ${articleFilePath}`);
  console.log(`   Word Count: ${finalWordCount} words`);
  console.log(`   Canonical URL: https://jichangsou.club/answers/${finalSlug}/`);

  // Update Topic Matrix
  selectedTopic.published = true;
  selectedTopic.publishedAt = new Date().toISOString();
  selectedTopic.publishedSlug = finalSlug;
  matrixData.lastUpdated = new Date().toISOString();

  fs.writeFileSync(TOPIC_MATRIX_PATH, JSON.stringify(matrixData, null, 2), 'utf-8');
  console.log(`✅ Updated topicMatrix.json (Marked ${selectedTopic.id} as published).`);

  console.log('\n🎉 Article publication generation complete!');
}

// ==========================================
// DEEPSEEK GENERATION IMPLEMENTATION
// ==========================================
async function generateArticleWithDeepSeek(topic) {
  const systemPrompt = `你是一名拥有10年以上骨干网运维、跨境企业专线工程与代理协议深度研发经验的资深网络基础设施架构师，同时也是一位注重客观技术事实的专栏作者。

【写作原则与人设规范（严禁违背）】
1. 语言必须具备扎实的“活人感”与工程一线质感。像一位在终端机前排障、看过真实 Wireshark 抓包报文的工程师在说话。
2. 严禁一切 AI 假大空套话与空洞说教！成稿正文绝对禁止出现以下词汇与句式：
   - 严禁“随着...的飞速发展”、“总而言之”、“综上所述”、“不可否认的是”、“值得注意的是”、“需要指出的是”、“毋庸置疑”、“在这个数字化时代”、“如同一把双刃剑”。
   - 严禁翻案腔句式：“不是……而是……”、“看似……实则……”、“并非……而是……”、“表面……实际……”。请直接正面阐述技术事实与因果关系。
   - 严禁破折号（“——”或“—”）。
   - 严禁提示性冒号（如“核心原因：”、“总结：”，冒号仅允许在代码、URL或键值对字段中出现）。
   - 严禁“说白了”、“说穿了”、“先说结论”。
3. 必须包含扎实的现实工程材料：
   - 具体的网络协议规范（如 RFC 9000 QUIC, TLS 1.3, Shadowsocks 2022, VLESS）。
   - 具体的排障与诊断指令（如 curl, ping, mtr, traceroute, tcpdump 等）。
   - 真实的配置文件代码块（如 Clash YAML 规则组, sing-box JSON 路由分流, Linux Systemd 等）。
   - 真实的量化对比表格（HTML <table> 包含延迟 RTT、抖动 Jitter、丢包率、TLS 握手开销等）。
4. GEO（生成式引擎优化）架构：
   - quickAnswer（权威直答块）：150-250字，针对 Perplexity、Bing Copilot、ChatGPT 检索精准提取设计。直接给出定义、故障根因与3步排障结论。
   - traps（实测踩坑预警）：给出3条高发踩坑现象。
   - contentHtml（深度技术正文）：4000~6000字技术长文，由多层实际工程段落自然展开，包含 h2、h3、p、pre code、table、ul、ol，结构严密，杜绝为了字数而重复车轱辘话。

输出格式：必须且仅输出一个合法的 JSON 对象，不带有任何 markdown 代码块包裹（如果带了必须能被 JSON.parse 解析），字段结构如下：
{
  "slug": "${topic.slug}",
  "title": "${topic.title}",
  "category": "${topic.category}",
  "quickAnswer": "150-250字的高信息密度直接答案",
  "contentHtml": "<h2>...</h2><p>...</p>",
  "traps": [
    "排障踩坑点一",
    "排障踩坑点二",
    "排障踩坑点三"
  ],
  "relatedQuestions": [
    { "title": "相关技术问题一", "slug": "vpn-vs-airport" },
    { "title": "相关技术问题二", "slug": "iplc-vs-relay" }
  ],
  "nextHub": {
    "title": "客户端配置与新手教程专区",
    "desc": "图文详解各客户端智能分流与防风控配置。",
    "url": "/clients/",
    "cta": "前往客户端教程中心 →"
  },
  "nextSelection": {
    "title": "挑选适合开发者的稳定专线服务",
    "desc": "核验专线延迟、双 ISP 纯净原生 IP 节点与流媒体实测数据。",
    "url": "/airports/stable/",
    "cta": "查看稳定专线推荐 →"
  }
}`;

  const userPrompt = `请为以下主题撰写一篇万字级（4500-6000+字）的 GEO/SEO 专题深度矩阵文章：
主题 ID: ${topic.id}
主题标题: ${topic.title}
分类: ${topic.category}
推荐 URL Slug: ${topic.slug}
核心关键词: ${topic.coreKeywords.join(', ')}
深度技术切入点: ${topic.focusAngle}

请严格按照系统要求，输出包含完整实操终端命令、配置示例、量化对比表格与权威直答块的完整 JSON。`;

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 8192,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API returned error ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const rawContent = result.choices?.[0]?.message?.content || '';

  // Extract JSON
  let cleanedJsonStr = rawContent.trim();
  if (cleanedJsonStr.startsWith('```json')) {
    cleanedJsonStr = cleanedJsonStr.slice(7);
  } else if (cleanedJsonStr.startsWith('```')) {
    cleanedJsonStr = cleanedJsonStr.slice(3);
  }
  if (cleanedJsonStr.endsWith('```')) {
    cleanedJsonStr = cleanedJsonStr.slice(0, -3);
  }
  cleanedJsonStr = cleanedJsonStr.trim();

  try {
    return JSON.parse(cleanedJsonStr);
  } catch (err) {
    console.error('Failed to parse DeepSeek response as JSON. Raw length:', rawContent.length);
    // Attempt relaxed parsing or salvage
    const firstBrace = cleanedJsonStr.indexOf('{');
    const lastBrace = cleanedJsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(cleanedJsonStr.substring(firstBrace, lastBrace + 1));
    }
    throw err;
  }
}

// ==========================================
// AUTOMATIC TOPIC MATRIX EXTENSION
// ==========================================
async function extendTopicMatrixWithDeepSeek(matrixData) {
  console.log('🤖 Generating 12 new high-authority topics to extend matrix...');
  const prompt = `我们正在运营一个专注跨境网络协议、企业专线与开发者网络架构的技术站点。现有主题矩阵已全部完成发布。
请根据当前 2026 年最新技术趋势（例如 ECH 加密 SNI、Subagent 终端代理风控、双 ISP 判定、QUIC/Hysteria2 弱网调优、sing-box 规则引擎等），生成 6 个新的高权威深度技术选题。

每个选题必须具有清晰的人类自然英语 kebab-case slug（禁止出现任何数字序列或 robotic 模式如 post-1）。
返回格式为 JSON 数组：
[
  {
    "id": "geo-ext-${Date.now().toString(36)}-01",
    "slug": "natural-english-slug",
    "title": "中文深度技术标题",
    "category": "协议原理",
    "coreKeywords": ["关键词1", "关键词2"],
    "focusAngle": "具体技术切入点",
    "published": false,
    "publishedAt": null,
    "publishedSlug": null
  }
]`;

  const response = await fetch(DEEPSEEK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  const resJson = await response.json();
  let content = resJson.choices?.[0]?.message?.content?.trim() || '[]';
  if (content.startsWith('```json')) content = content.slice(7);
  if (content.startsWith('```')) content = content.slice(3);
  if (content.endsWith('```')) content = content.slice(0, -3);

  const newTopics = JSON.parse(content.trim());
  matrixData.topics.push(...newTopics);
  fs.writeFileSync(TOPIC_MATRIX_PATH, JSON.stringify(matrixData, null, 2), 'utf-8');
  console.log(`✅ Appended ${newTopics.length} new topics to topicMatrix.json.`);
  return newTopics[0];
}

// ==========================================
// DRY RUN MOCK GENERATOR FOR TESTING
// ==========================================
async function generateMockArticle(topic, matrixData) {
  const finalSlug = validateAndSanitizeSlug(topic.slug);
  const mockArticle = {
    slug: finalSlug,
    title: topic.title,
    category: topic.category,
    readingTime: '12 分钟阅读 · 4820 字',
    lastUpdated: new Date().toISOString().split('T')[0],
    wordCount: 4820,
    quickAnswer: `${topic.title}的核心根因在于网络协议握手特征暴露或中间节点被风控系统标记。针对此问题，工程排查的核心流程是首先使用抓包工具定位 RST 复位阶段，随后开启客户端 TUN 虚拟网卡模式规避本地端口劫持，最后切换具备双 ISP 属性的原生内网专线节点即可彻底解决。`,
    contentHtml: `
      <h2>一、问题背景与现场复现</h2>
      <p>在进行跨国 API 联调或大模型高频推理时，终端经常遭遇网络中断。通过 tcpdump 抓包可以观察到 TCP 连接在完成三次握手后直接收到了服务端下发的 RST 标志位。</p>
      <pre><code class="language-bash"># 现场抓包诊断命令
tcpdump -nn -i eth0 host api.anthropic.com and port 443 -v</code></pre>
      
      <h2>二、底层网络协议与传输机制</h2>
      <p>协议传输层的关键在于 TLS 1.3 Client Hello 阶段的指纹特征。普通数据中心机房 IP 往往由于同段大量滥用导致被 Cloudflare 等 WAF 规则集拉入灰名单。</p>
      
      <h2>三、实测数据量化对比</h2>
      <table class="w-full text-xs border-collapse my-6">
        <thead>
          <tr class="border-b bg-[var(--bg-surface)]">
            <th class="p-2 text-left">网络链路类型</th>
            <th class="p-2 text-left">平均延迟 (RTT)</th>
            <th class="p-2 text-left">丢包率</th>
            <th class="p-2 text-left">API 成功率</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="p-2">公网普通中转</td><td class="p-2">185ms</td><td class="p-2">14.2%</td><td class="p-2">78.5%</td></tr>
          <tr class="border-b"><td class="p-2">IEPL 物理专线</td><td class="p-2">42ms</td><td class="p-2">0.0%</td><td class="p-2">99.9%</td></tr>
        </tbody>
      </table>

      <h2>四、生产级客户端分流配置实操</h2>
      <p>建议在 sing-box 或 Clash 中配置独立的 Rule Set，将核心流量精准路由至双 ISP 原生节点。</p>
    `,
    traps: [
      '在终端环境中仅配置了 http_proxy 环境变量而忽视了底层 WebSocket 连接走的是原始网络栈。',
      '盲目使用廉价机房 IP 进行大模型高频调用导致 API Key 与账号被关联封禁。',
      '未配置客户端 UDP 端口跳跃导致在晚高峰遭遇运营商严格的 QoS 限制。',
    ],
    relatedQuestions: [
      { title: '机场和传统 VPN 有什么本质区别？', slug: 'vpn-vs-airport' },
      { title: 'IPLC 专线与普通公网中转有什么本质区别？', slug: 'iplc-vs-relay' },
    ],
    nextHub: {
      title: '客户端配置与新手教程专区',
      desc: '图文详解 Clash、小火箭、v2rayN 与 sing-box 下载与智能分流配置。',
      url: '/clients/',
      cta: '前往客户端教程中心 →',
    },
    nextSelection: {
      title: '下一步决策：挑选适合自己的稳定专线机场',
      desc: '已为您核验 16 家主力机场的专线延迟、价格阶梯与实测测速数据。',
      url: '/airports/stable/',
      cta: '查看稳定专线机场推荐 →',
    },
  };

  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  }

  const articleFilePath = path.join(ARTICLES_DIR, `${finalSlug}.json`);
  fs.writeFileSync(articleFilePath, JSON.stringify(mockArticle, null, 2), 'utf-8');
  console.log(`[DRY-RUN] Wrote test article to: ${articleFilePath}`);
}

main().catch((err) => {
  console.error('\n❌ Execution failed:', err);
  process.exit(1);
});
