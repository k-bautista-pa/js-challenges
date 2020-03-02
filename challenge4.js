const calculateValidationNumber = input => {
  let value = parseInt(input);

  while(value >= 10) {
    let sum = 0;

    do {
      sum += Math.floor(value % 10);
      value = Math.floor(value / 10);
    } while(value > 0);
  
    value = sum;
  }

  return value;
}

module.exports = {
    calculateValidationNumber
}