// 定义连号的系数
const consecutiveCoefficients = {
  2: 0.5,  // 两个相同数字连号的系数
  3: 1.0,  // 三个相同数字连号的系数
  4: 1.5   // 四个相同数字连号的系数
};

// 计算号码的估价，仅考虑连号
function calculate2(number) {
  let totalValue = 0;

  // 遍历每个数字（0-9）
  for (let digit = 0; digit <= 9; digit++) {
    // 使用正则表达式查找当前数字的所有连续序列
    let regex = new RegExp(`${digit}+`, 'g');
    let matches = number.match(regex);
    
    if (matches) {
      matches.forEach(match => {
        let length = match.length;
        if (consecutiveCoefficients[length]) {
          // 如果有对应的连号系数，累加到总价值
          totalValue += consecutiveCoefficients[length];
        }
      });
    }
  }

  return totalValue;
}
export default calculate2

/*
// 示例：计算不同号码的估价
let basePrice = 100; // 假设基准价为100元
let number1 = "11";  // 示例号码1（三个1，两个2连号）
let number2 = "222";  // 示例号码2（无连号）
let number3 = "3333";    // 示例号码3（四个1连号）
let number4 = "123411";  // 示例号码4（两个1连号）

// 计算估价
let value1 = calculateConsecutiveValue(number1) * basePrice;
let value2 = calculateConsecutiveValue(number2) * basePrice;
let value3 = calculateConsecutiveValue(number3) * basePrice;
let value4 = calculateConsecutiveValue(number4) * basePrice;

console.log(`号码 ${number1} 的价值为: ${value1} 元`);
console.log(`号码 ${number2} 的价值为: ${value2} 元`);
console.log(`号码 ${number3} 的价值为: ${value3} 元`);
console.log(`号码 ${number4} 的价值为: ${value4} 元`);
*/