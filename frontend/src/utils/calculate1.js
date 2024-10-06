// 定义每个数字的价值系数
const valueCoefficients = {
    '8': 3.0,
    '6': 2.5,
    '9': 2.0,
    '0': 1.5,
    '1': 1.0,
    '7': 1.0,
    '5': 0.9,
    '2': 0.6,
    '3': 0.5,
    '4': 0.3
  };
  
  // 计算号码的估价
  function calculate1(number) {
    let totalValue = 0;
  
    // 遍历号码中的每个数字
    for (let digit of number) {
      // 获取该数字的系数
      let coefficient = valueCoefficients[digit];
  
      // 如果找到系数，累加到总价值
      if (coefficient) {
        totalValue += coefficient;
      }
    }
  
    // 返回计算得到的总价值
    return totalValue;
  }

  export default calculate1
  
  /*
  // 示例：计算不同号码的估价
  let basePrice = 100; // 假设基准价为100元
  let number1 = "1111"; // 示例号码1
  let number2 = "6767"; // 示例号码2
  let number3 = "8888"; // 示例号码3
  
  // 计算估价
  let value1 = calculateNumberValue(number1) * basePrice;
  let value2 = calculateNumberValue(number2) * basePrice;
  let value3 = calculateNumberValue(number3) * basePrice;
  
  console.log(`号码 ${number1} 的价值为: ${value1} 元`);
  console.log(`号码 ${number2} 的价值为: ${value2} 元`);
  console.log(`号码 ${number3} 的价值为: ${value3} 元`);
  */