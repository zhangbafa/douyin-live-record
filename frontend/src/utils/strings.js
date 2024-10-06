function maskString(str) {
  if(str.length>0)
  {
    const prefix = str.substring(0, 4);
    const suffix = str.substring(str.length - 4);
    const middleLength = str.length - 8;
    const middle = "*".repeat(middleLength);
    const result = `${prefix}${middle}${suffix}`;
    return result
  }
  return ''
  
}

export {
    maskString
}