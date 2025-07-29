/**
 * Enhanced Test Mode for Newsletter Demo
 * Comprehensive testing without N8N server dependency
 */

class EnhancedTestMode {
  constructor() {
    this.testScenarios = {
      SUCCESS: 'success',
      NETWORK_ERROR: 'network_error',
      CORS_ERROR: 'cors_error',
      TIMEOUT: 'timeout',
      SERVER_ERROR: 'server_error'
    };
    
    this.currentScenario = this.testScenarios.SUCCESS;
    this.requestCount = 0;
  }

  /**
   * 테스트 시나리오 설정
   */
  setTestScenario(scenario) {
    this.currentScenario = scenario;
    console.log(`[Test Mode] Scenario changed to: ${scenario}`);
  }

  /**
   * Mock API 요청 처리
   */
  async mockSubscribe(data) {
    this.requestCount++;
    const requestId = Date.now() + this.requestCount;
    
    console.log(`[Test Mode] Mock API Request #${this.requestCount}:`, data);
    console.log(`[Test Mode] Current scenario: ${this.currentScenario}`);
    
    // 시나리오별 지연 시뮬레이션
    const delays = {
      [this.testScenarios.SUCCESS]: 1500,
      [this.testScenarios.NETWORK_ERROR]: 500,
      [this.testScenarios.CORS_ERROR]: 300,
      [this.testScenarios.TIMEOUT]: 5000,
      [this.testScenarios.SERVER_ERROR]: 2000
    };
    
    const delay = delays[this.currentScenario] || 1500;
    console.log(`[Test Mode] Simulating ${delay}ms delay...`);
    await this.sleep(delay);
    
    // 시나리오별 응답 생성
    switch (this.currentScenario) {
      case this.testScenarios.SUCCESS:
        return this.generateSuccessResponse(data, requestId);
        
      case this.testScenarios.NETWORK_ERROR:
        throw new Error('Failed to fetch');
        
      case this.testScenarios.CORS_ERROR:
        throw new Error('CORS_ERROR');
        
      case this.testScenarios.TIMEOUT:
        throw new Error('Request timeout (30000ms)');
        
      case this.testScenarios.SERVER_ERROR:
        throw new Error('HTTP 500: Internal Server Error');
        
      default:
        return this.generateSuccessResponse(data, requestId);
    }
  }

  /**
   * 성공 응답 생성
   */
  generateSuccessResponse(data, requestId) {
    const mockArticles = this.generateMockArticles(data.keyword);
    
    return {
      success: true,
      message: '🧪 테스트 모드: 뉴스레터가 성공적으로 생성되었습니다! (실제 발송되지 않음)',
      data: {
        testMode: true,
        requestId: requestId,
        query: data.keyword,
        email: data.email,
        language: data.language,
        articles: mockArticles,
        timestamp: new Date().toISOString(),
        processingTime: '2.3초',
        articlesFound: mockArticles.length
      },
      requestId: requestId
    };
  }

  /**
   * Mock 기사 데이터 생성
   */
  generateMockArticles(keyword) {
    const templates = [
      {
        title: `${keyword} 관련 최신 동향 및 시장 전망`,
        reason: `'${keyword}' 키워드와 직접적으로 관련된 최신 동향을 다루고 있어 가장 관련도가 높습니다.`
      },
      {
        title: `전문가 분석: ${keyword}이 가져올 혁신`,
        reason: `업계 전문가들의 심층 분석을 통해 ${keyword}의 미래 전망을 제시합니다.`
      },
      {
        title: `${keyword} 스타트업들의 급성장, 투자 열기 후끈`,
        reason: `${keyword} 분야의 시장 동향과 투자 트렌드를 다뤄 실무적 가치가 높습니다.`
      },
      {
        title: `${keyword} 기술, 일상생활 속 변화 가속화`,
        reason: `${keyword} 기술의 실생활 적용 사례를 구체적으로 제시하여 이해도를 높입니다.`
      }
    ];
    
    return templates.map((template, index) => ({
      rank: index + 1,
      title: template.title,
      reason: template.reason,
      link: `https://example.com/news/${encodeURIComponent(keyword)}-${index + 1}`,
      pubDate: new Date(Date.now() - (index * 3600000)).toISOString(),
      description: `${keyword}에 대한 상세한 분석과 향후 전망을 제시하는 전문 기사입니다. ${template.reason.substring(0, 100)}...`
    }));
  }

  /**
   * 연결 테스트 Mock
   */
  async mockTestConnection() {
    console.log('[Test Mode] Mock connection test');
    await this.sleep(500);
    return this.currentScenario !== this.testScenarios.NETWORK_ERROR;
  }

  /**
   * 유틸리티: sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 테스트 UI 컨트롤 생성
   */
  createTestControls() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'test-controls';
    controlPanel.style.cssText = `
      position: fixed;
      top: 50px;
      right: 20px;
      background: white;
      border: 2px solid #ff6b6b;
      border-radius: 8px;
      padding: 15px;
      z-index: 9998;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: Arial, sans-serif;
      font-size: 12px;
      max-width: 280px;
    `;
    
    controlPanel.innerHTML = `
      <h4 style="margin: 0 0 10px; color: #ff6b6b; font-size: 14px;">🧪 테스트 컨트롤</h4>
      <p style="margin: 0 0 10px; color: #666;">시나리오를 선택하여 다양한 상황을 테스트하세요:</p>
      
      <select id="scenario-select" style="width: 100%; margin-bottom: 10px; padding: 4px;">
        <option value="success">✅ 성공 (정상 처리)</option>
        <option value="network_error">🌐 네트워크 오류</option>
        <option value="cors_error">🚫 CORS 오류</option>
        <option value="timeout">⏱️ 타임아웃</option>
        <option value="server_error">🔥 서버 오류</option>
      </select>
      
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
        <div style="font-size: 11px; color: #888;">
          요청 수: <span id="request-counter">0</span><br>
          현재 시나리오: <span id="current-scenario">success</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // 이벤트 리스너 추가
    const select = document.getElementById('scenario-select');
    select.addEventListener('change', (e) => {
      this.setTestScenario(e.target.value);
      document.getElementById('current-scenario').textContent = e.target.value;
    });
    
    // 요청 카운터 업데이트
    const updateCounter = () => {
      document.getElementById('request-counter').textContent = this.requestCount;
    };
    
    setInterval(updateCounter, 1000);
  }
}

// Test Mode 초기화
console.log('🧪 ENHANCED TEST MODE ACTIVATED');
console.log('📧 Real emails will NOT be sent');
console.log('🎮 Test controls available on the right side');

const testMode = new EnhancedTestMode();

// API Override
if (typeof NewsletterAPI !== 'undefined') {
  const originalSubscribe = NewsletterAPI.subscribe.bind(NewsletterAPI);
  const originalTestConnection = NewsletterAPI.testConnection.bind(NewsletterAPI);
  
  NewsletterAPI.subscribe = testMode.mockSubscribe.bind(testMode);
  NewsletterAPI.testConnection = testMode.mockTestConnection.bind(testMode);
  
  console.log('[Test Mode] NewsletterAPI methods overridden');
}

// DOM 준비 시 UI 생성
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      testMode.createTestControls();
      
      // 테스트 모드 배너
      const banner = document.createElement('div');
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
        color: white;
        text-align: center;
        padding: 10px;
        font-weight: bold;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      banner.textContent = '🧪 테스트 모드 활성화 - 실제 이메일 발송되지 않음';
      document.body.insertBefore(banner, document.body.firstChild);
      
      // 페이지 여백 조정
      document.body.style.paddingTop = '45px';
    });
  } else {
    testMode.createTestControls();
  }
}

// Export for testing
if (typeof window !== 'undefined') {
  window.TestMode = testMode;
}