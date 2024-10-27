import http from 'k6/http';
import { check, group } from 'k6';

const footprintsData = [
  {
    title: '教授高中數學課程',
    tags: ['教育', '數學'],
    content:
      '我負責教授高中數學課程，並設計了多個解題策略來幫助學生理解數學概念。',
    category: '教育',
  },
  {
    title: '創作個人藝術作品',
    tags: ['藝術', '創作'],
    content: '我創作了多幅個人藝術作品，並參加了多場展覽展示。',
    category: '藝術',
  },
  {
    title: '開始學習數位繪畫',
    tags: ['數位繪畫', '插畫'],
    content:
      '數位繪畫是一種流行的藝術形式，我正在學習如何使用數位工具進行創作。',
    category: '藝術',
  },
  {
    title: '進行財務分析報告',
    tags: ['財務分析', '報告'],
    content: '我負責撰寫公司的財務分析報告，分析公司財務狀況，並提出改進建議。',
    category: '財務',
  },
  {
    title: '設計數據驅動的營銷方案',
    tags: ['營銷', '數據驅動'],
    content: '我為一家初創企業設計了數據驅動的營銷方案，效果顯著提升。',
    category: '營銷',
  },
  {
    title: '學習商業攝影基礎',
    tags: ['攝影', '商業'],
    content:
      '商業攝影與普通攝影不同，需要考慮到市場和品牌的需求，我正在學習這方面的知識。',
    category: '攝影',
  },
  {
    title: '學習組織心理學',
    tags: ['心理學', '組織發展'],
    content:
      '組織心理學可以幫助企業提升員工的滿意度和生產力，我開始學習這方面的知識。',
    category: '心理學',
  },
  {
    title: '開發自由職業專案',
    tags: ['自由職業', '軟體開發'],
    content: '我在自由職業期間，開發了多個客戶專案，積累了豐富的實戰經驗。',
    category: '項目',
  },
  {
    title: '參與環境保護志工',
    tags: ['環境保護', '志工'],
    content:
      '在學期間，我積極參與環境保護志工活動，實際了解了環境保護的重要性。',
    category: '志工',
  },
  {
    title: '開發嵌入式系統專案',
    tags: ['嵌入式系統', '專案'],
    content: '我在公司負責嵌入式系統的開發，這讓我對無人駕駛技術產生了興趣。',
    category: '專案',
  },
  {
    title: '教授高中物理課程',
    tags: ['教育', '物理'],
    content: '我負責教授高中物理課程，並設計了多個實驗來幫助學生理解物理概念。',
    category: '教育',
  },
];

export default function postFootprint(token) {
  group('postFootprint', () => {
    const vuId = __VU;

    const initFootprintPayload = JSON.stringify({
      status: 'draft',
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    let initFootprintRes = http.post(
      `http://localhost:${__ENV.EXPRESS_PORT}/api/1.0/footprint/init`,
      initFootprintPayload,
      params,
    );

    check(initFootprintRes, {
      'init footprint status was 200': (r) => r.status === 200,
    });

    const footprintId = JSON.parse(initFootprintRes.body).data.footprint.id;

    const fakeFootprint = footprintsData[vuId % footprintsData.length];

    const publishFootprintPayload = JSON.stringify({
      footprintId: footprintId,
      title: fakeFootprint.title,
      content: fakeFootprint.content,
      category: 'career',
      milestone: true,
      occurAt: '2003-03-04',
      status: 'published',
      hashtags: fakeFootprint.tags,
    });

    let publishFootprintRes = http.post(
      `http://localhost:${__ENV.EXPRESS_PORT}/api/1.0/footprint/publish`,
      publishFootprintPayload,
      params,
    );

    check(publishFootprintRes, {
      'publish footprint status was 200': (r) => r.status === 200,
    });
  });
}
