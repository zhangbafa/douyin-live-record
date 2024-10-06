class MobileNumberEvaluator {
    constructor(number) {
      this.number = number; // 手机号码
    }
  
    // 评估手机号码的价值
    evaluate() {
      let value = 100; // 基础价值点数
  
      // 检查尾数规律，如AAA、AAAA等
      let endsWithPatterns = this.checkPatterns();
      value += endsWithPatterns.value;
  
      // 检查连号数量，如123、456等
      let consecutiveNumbers = this.countConsecutiveNumbers();
      value += consecutiveNumbers.value * 10; // 连号每个增加10点
  
      // 检查数字大小，如8、9等更受欢迎
      let digitValue = this.calculateDigitValue();
      value += digitValue;
  
      // 检查特殊号码，如生日号、顺子号等
      let specialNumberValue = this.checkSpecialNumbers();
      value += specialNumberValue;
  
      return value;
    }
  
    // 检查尾数规律，增加价值点数
    checkPatterns() {
      let value = 0;
      let patterns = {
        'AAA': 30, 'AAAA': 60, 'ABCD': 20
      };
      let endsWith = this.number.substr(-3) + this.number.substr(-2) + this.number.substr(-1);
      for (let pattern in patterns) {
        if (endsWith.includes(pattern)) {
          value += patterns[pattern];
        }
      }
      return { value };
    }
  
    // 计算连号数量增加的价值点数
    countConsecutiveNumbers() {
      let value = 0;
      let numberArray = this.number.split('');
      for (let i = 0; i < numberArray.length - 1; i++) {
        if (parseInt(numberArray[i], 10) + 1 === parseInt(numberArray[i + 1], 10)) {
          value++;
        }
      }
      return { value };
    }
  
    // 计算数字大小增加的价值点数
    calculateDigitValue() {
      return this.number.split('').reduce((sum, digit) => {
        return sum + parseInt(digit, 10);
      }, 0);
    }
  
    // 检查特殊号码增加的价值点数
    checkSpecialNumbers() {
      // 这里可以添加对生日号、顺子号等特殊号码的检查
      // 由于特殊号码的检查较为复杂，这里仅作示例
      let value = 0;
      if (/^(13|15|18)\d{9}$/.test(this.number)) { // 检查是否为有效手机号码
        let birthdayPattern = /(01|02)(0[1-9]|1[0-9]|2[0-9]|3[01])(19|20)\d{2}/;
        if (birthdayPattern.test(this.number)) {
          value += 50; // 生日号增加50点
        }
      }
      return value;
    }
  }

  export default MobileNumberEvaluator