// 定义组合模式的系数
const patternCoefficients = {
  'aabb': 0.8,
  'abab': 0.6,
  'abba': 0.3,
  'abc': 0.2,
  'abcd': 0.5
};

// 检测是否符合特定组合模式
function matchPattern(number) {
  // 正则表达式匹配不同的模式
  if (/(\d)\1(\d)\2/.test(number)) return 'aabb'; // 匹配 aabb 模式
  if (/(\d)(\d)\1\2/.test(number)) return 'abab'; // 匹配 abab 模式
  if (/(\d)(\d)\2\1/.test(number)) return 'abba'; // 匹配 abba 模式
  if (/(\d)(?!\1)(\d)(?!\1|\2)(\d)/.test(number)) return 'abc'; // 匹配 abc 模式
  if (/(\d)(?!\1)(\d)(?!\1|\2)(\d)(?!\1|\2|\3)(\d)/.test(number)) return 'abcd'; // 匹配 ABCD 模式
  return null; // 如果没有匹配任何模式，则返回 null
}

// 计算号码的估价
function calculate3(number) {
  // 检查是否符合特定的组合模式
  let matchedPattern = matchPattern(number);
  if (matchedPattern && patternCoefficients[matchedPattern]) {
    // 如果有匹配的模式，使用模式系数计算
    return patternCoefficients[matchedPattern];
  } else {
    // 如果没有匹配任何模式，返回默认值0（表示无价值）
    return 0;
  }
}

export default calculate3
/*
// 示例：计算不同号码的估价
let basePrice = 100; // 假设基准价为100元
let number1 = "1122";    // 示例号码1（aabb）
let number2 = "1212";    // 示例号码2（abab）
let number3 = "1221";    // 示例号码3（abba）
let number4 = "123";     // 示例号码4（abc）
let number5 = "1234";    // 示例号码5（ABCD）
let number6 = "97864453";   // 示例号码6（无特定模式）

// 计算估价
let value1 = calculateNumberValue(number1) * basePrice;
let value2 = calculateNumberValue(number2) * basePrice;
let value3 = calculateNumberValue(number3) * basePrice;
let value4 = calculateNumberValue(number4) * basePrice;
let value5 = calculateNumberValue(number5) * basePrice;
let value6 = calculateNumberValue(number6) * basePrice;

console.log(`号码 ${number1} 的价值为: ${value1} 元`);
console.log(`号码 ${number2} 的价值为: ${value2} 元`);
console.log(`号码 ${number3} 的价值为: ${value3} 元`);
console.log(`号码 ${number4} 的价值为: ${value4} 元`);
console.log(`号码 ${number5} 的价值为: ${value5} 元`);
console.log(`号码 ${number6} 的价值为: ${value6} 元`);
*/