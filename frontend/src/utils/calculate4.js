// 定义带有不同数量4的系数
const fourCoefficients = {
  0: 0,  // 不带4
  1: -0.1,  // 带1个4
  2: -0.4,  // 带2个4
  3: -0.6,  // 带3个4
  4: -0.8   // 带4个或以上4
};

// 计算号码的估价，仅考虑是否包含数字4
function calculate4(number) {
  // 计算数字4出现的次数
  let countFours = (number.match(/4/g) || []).length;

  // 根据出现的次数返回相应的系数
  if (countFours >= 4) {
    return fourCoefficients[4];
  } else {
    return fourCoefficients[countFours];
  }
}

export default calculate4
/*
// 示例：计算不同号码的估价
let basePrice = 100; // 假设基准价为100元
let number1 = "123456";   // 示例号码1（1个4）
let number2 = "567890";   // 示例号码2（无4）
let number3 = "4444";     // 示例号码3（4个4）
let number4 = "443322";   // 示例号码4（2个4）
let number5 = "4443";     // 示例号码5（3个4）

// 计算估价
let value1 = calculateFourValue(number1) * basePrice;
let value2 = calculateFourValue(number2) * basePrice;
let value3 = calculateFourValue(number3) * basePrice;
let value4 = calculateFourValue(number4) * basePrice;
let value5 = calculateFourValue(number5) * basePrice;

console.log(`号码 ${number1} 的价值为: ${value1} 元`);
console.log(`号码 ${number2} 的价值为: ${value2} 元`);
console.log(`号码 ${number3} 的价值为: ${value3} 元`);
console.log(`号码 ${number4} 的价值为: ${value4} 元`);
console.log(`号码 ${number5} 的价值为: ${value5} 元`);
*/