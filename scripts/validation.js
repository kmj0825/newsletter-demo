/**
 * Form Validation Module
 * Handles client-side validation and user experience enhancements
 */

class FormValidator {
  constructor() {
    this.rules = {
      keyword: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9가-힣\s,.-]+$/,
        customValidator: this.validateKeyword
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 254,
        customValidator: this.validateEmail
      },
      sorting: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z0-9가-힣\s,.-]+$/,
        customValidator: this.validateSorting
      }
    };
    
    this.messages = {
      ko: {
        required: '이 필드는 필수입니다.',
        minLength: '{min}자 이상 입력해주세요.',
        maxLength: '{max}자 이하로 입력해주세요.',
        pattern: '올바른 형식으로 입력해주세요.',
        email: '유효한 이메일 주소를 입력해주세요.',
        keyword: '키워드는 한글, 영문, 숫자, 쉼표만 사용 가능합니다.',
        sorting: '정렬 기준은 한글, 영문, 숫자만 사용 가능합니다.',
        options: '올바른 옵션을 선택해주세요.'
      },
      en: {
        required: 'This field is required.',
        minLength: 'Please enter at least {min} characters.',
        maxLength: 'Please enter no more than {max} characters.',
        pattern: 'Please enter a valid format.',
        email: 'Please enter a valid email address.',
        keyword: 'Keyword can only contain letters, numbers, and commas.',
        sorting: 'Sorting criteria can only contain letters, numbers, and spaces.',
        options: 'Please select a valid option.'
      }
    };
  }

  /**
   * Validate a single field
   * @param {string} fieldName - Name of the field
   * @param {string} value - Field value
   * @param {string} language - Language for error messages
   * @returns {Object} Validation result
   */
  validateField(fieldName, value, language = 'ko') {
    const rule = this.rules[fieldName];
    const messages = this.messages[language];
    
    if (!rule) {
      return { isValid: true, message: '' };
    }

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return {
        isValid: false,
        message: messages.required,
        type: 'required'
      };
    }

    // Skip other validations if field is empty and not required
    if (!rule.required && (!value || value.trim() === '')) {
      return { isValid: true, message: '' };
    }

    const trimmedValue = value.trim();

    // Length validations
    if (rule.minLength && trimmedValue.length < rule.minLength) {
      return {
        isValid: false,
        message: messages.minLength.replace('{min}', rule.minLength),
        type: 'minLength'
      };
    }

    if (rule.maxLength && trimmedValue.length > rule.maxLength) {
      return {
        isValid: false,
        message: messages.maxLength.replace('{max}', rule.maxLength),
        type: 'maxLength'
      };
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(trimmedValue)) {
      const messageKey = fieldName === 'email' ? 'email' : 
                        fieldName === 'keyword' ? 'keyword' : 
                        fieldName === 'sorting' ? 'sorting' : 'pattern';
      return {
        isValid: false,
        message: messages[messageKey],
        type: 'pattern'
      };
    }

    // Options validation
    if (rule.options && !rule.options.includes(trimmedValue)) {
      return {
        isValid: false,
        message: messages.options,
        type: 'options'
      };
    }

    // Custom validation
    if (rule.customValidator) {
      const customResult = rule.customValidator.call(this, trimmedValue, language);
      if (!customResult.isValid) {
        return customResult;
      }
    }

    return { isValid: true, message: '' };
  }

  /**
   * Validate entire form
   * @param {Object} formData - Form data object
   * @param {string} language - Language for error messages
   * @returns {Object} Validation result with all field errors
   */
  validateForm(formData, language = 'ko') {
    const errors = {};
    let isValid = true;

    // Validate each field
    for (const [fieldName, value] of Object.entries(formData)) {
      const result = this.validateField(fieldName, value, language);
      if (!result.isValid) {
        errors[fieldName] = result;
        isValid = false;
      }
    }

    return {
      isValid,
      errors,
      fieldCount: Object.keys(formData).length,
      errorCount: Object.keys(errors).length
    };
  }

  /**
   * Custom keyword validation
   * @param {string} value - Keyword value
   * @param {string} language - Language for error messages
   * @returns {Object} Validation result
   */
  validateKeyword(value, language = 'ko') {
    const messages = this.messages[language];
    
    // Check for multiple keywords separated by commas
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    
    if (keywords.length === 0) {
      return {
        isValid: false,
        message: messages.required,
        type: 'required'
      };
    }

    // Validate each keyword
    for (const keyword of keywords) {
      if (keyword.length < 2) {
        return {
          isValid: false,
          message: '각 키워드는 2자 이상이어야 합니다.',
          type: 'keywordLength'
        };
      }
      
      if (keyword.length > 20) {
        return {
          isValid: false,
          message: '각 키워드는 20자 이하이어야 합니다.',
          type: 'keywordLength'
        };
      }
    }

    // Check total number of keywords
    if (keywords.length > 5) {
      return {
        isValid: false,
        message: '키워드는 최대 5개까지 입력 가능합니다.',
        type: 'keywordCount'
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Custom email validation with additional checks
   * @param {string} value - Email value
   * @param {string} language - Language for error messages
   * @returns {Object} Validation result
   */
  validateEmail(value, language = 'ko') {
    const messages = this.messages[language];
    
    // Basic format check (already done by pattern)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return {
        isValid: false,
        message: messages.email,
        type: 'emailFormat'
      };
    }

    // Additional checks
    const [localPart, domain] = value.split('@');
    
    // Check local part length
    if (localPart.length > 64) {
      return {
        isValid: false,
        message: '이메일 주소가 너무 깁니다.',
        type: 'emailLength'
      };
    }

    // Check for consecutive dots
    if (value.includes('..')) {
      return {
        isValid: false,
        message: messages.email,
        type: 'emailFormat'
      };
    }

    // Check domain has at least one dot
    if (!domain.includes('.')) {
      return {
        isValid: false,
        message: messages.email,
        type: 'emailFormat'
      };
    }

    // Check for common typos in popular domains
    const commonDomains = ['gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'yahoo.com'];
    const suspiciousDomains = ['gmail.co', 'naver.co', 'gmail.om', 'gmial.com'];
    
    if (suspiciousDomains.includes(domain)) {
      return {
        isValid: false,
        message: '이메일 도메인을 다시 확인해주세요. (오타가 있을 수 있습니다)',
        type: 'emailTypo'
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Real-time validation setup for form elements
   * @param {HTMLFormElement} form - Form element
   * @param {Function} callback - Callback function for validation results
   */
  setupRealTimeValidation(form, callback) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      const fieldName = input.name;
      if (!this.rules[fieldName]) return;

      // Validation on blur (when user leaves the field)
      input.addEventListener('blur', () => {
        const result = this.validateField(fieldName, input.value);
        this.updateFieldUI(input, result);
        if (callback) callback(fieldName, result);
      });

      // Real-time validation on input (with debounce)
      let timeoutId;
      input.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          const result = this.validateField(fieldName, input.value);
          this.updateFieldUI(input, result);
          if (callback) callback(fieldName, result);
        }, 300); // 300ms debounce
      });

      // Clear validation on focus
      input.addEventListener('focus', () => {
        this.clearFieldUI(input);
      });
    });
  }

  /**
   * Update field UI based on validation result
   * @param {HTMLElement} input - Input element
   * @param {Object} result - Validation result
   */
  updateFieldUI(input, result) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    // Remove existing validation classes and messages
    this.clearFieldUI(input);

    if (result.isValid) {
      formGroup.classList.add('has-success');
      input.setAttribute('aria-invalid', 'false');
    } else {
      formGroup.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      
      // Add error message
      const errorElement = document.createElement('span');
      errorElement.className = 'form-error';
      errorElement.textContent = result.message;
      errorElement.setAttribute('role', 'alert');
      
      const hint = formGroup.querySelector('.form-hint');
      if (hint) {
        hint.parentNode.insertBefore(errorElement, hint.nextSibling);
      } else {
        input.parentNode.appendChild(errorElement);
      }
    }
  }

  /**
   * Clear field UI validation state
   * @param {HTMLElement} input - Input element
   */
  clearFieldUI(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('has-error', 'has-success');
    input.removeAttribute('aria-invalid');
    
    const errorElement = formGroup.querySelector('.form-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Custom sorting validation
   * @param {string} value - Sorting value
   * @param {string} language - Language for error messages
   * @returns {Object} Validation result
   */
  validateSorting(value, language = 'ko') {
    const messages = this.messages[language];
    
    // Check for meaningful content
    if (value.length < 2) {
      return {
        isValid: false,
        message: '정렬 기준을 2자 이상 입력해주세요.',
        type: 'minLength'
      };
    }

    // Check for reasonable length
    if (value.length > 50) {
      return {
        isValid: false,
        message: '정렬 기준을 50자 이하로 입력해주세요.',
        type: 'maxLength'
      };
    }

    // Check for common sorting criteria patterns
    const commonPatterns = [
      '신모델', '개발', '투자', '동향', '기술', '시장', '분석', '업계', 
      '트렌드', '전망', '예측', '성장', '변화', '혁신', '출시', '발표'
    ];
    
    const hasRelevantKeyword = commonPatterns.some(pattern => 
      value.toLowerCase().includes(pattern)
    );

    if (!hasRelevantKeyword && value.length > 10) {
      return {
        isValid: true,
        message: '',
        suggestion: '예시: 신모델 개발, 투자 동향, 기술 트렌드, 시장 분석 등'
      };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Get suggestions for common input improvements
   * @param {string} fieldName - Field name
   * @param {string} value - Field value
   * @returns {Array} Array of suggestions
   */
  getSuggestions(fieldName, value) {
    const suggestions = [];

    if (fieldName === 'keyword') {
      const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
      if (keywords.length === 1) {
        suggestions.push('여러 키워드를 입력하려면 쉼표(,)로 구분해주세요');
      }
    }

    if (fieldName === 'email') {
      const commonSuggestions = {
        'gmail.co': 'gmail.com',
        'naver.co': 'naver.com',
        'gmial.com': 'gmail.com',
        'gmai.com': 'gmail.com'
      };

      const domain = value.split('@')[1];
      if (domain && commonSuggestions[domain]) {
        suggestions.push(`${commonSuggestions[domain]}을(를) 의도하신 건 아닌가요?`);
      }
    }

    if (fieldName === 'sorting') {
      const exampleSortings = ['신모델 개발', '투자 동향', '기술 트렌드', '시장 분석', '업계 동향'];
      if (value.length < 5) {
        suggestions.push(`예시: ${exampleSortings.join(', ')}`);
      }
    }

    return suggestions;
  }
}

// Create global validator instance
window.FormValidator = new FormValidator();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormValidator;
}