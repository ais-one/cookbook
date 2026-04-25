const execute = num => {
  let result = 0;
  for (let i = num ** 7; i >= 0; i--) {
    result += Math.atan(i) * Math.tan(i);
  }
  return result;
};

module.exports = {
  execute,
};
