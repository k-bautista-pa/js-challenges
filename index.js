const c1 = require('./challenge1');
const c4 = require('./challenge4');

console.log('Male: ', c1.listByGender('M'));
console.log('Female: ', c1.listByGender('F'));
console.log('Departments: ', c1.groupByDepartment());

console.log('Validation Number for 444444: ', c4.calculateValidationNumber(444444));
console.log('Validation Number for 1234: ', c4.calculateValidationNumber(1234));
console.log('Validation Number for 23478998: ', c4.calculateValidationNumber(23478998));
console.log('Validation Number for 7: ', c4.calculateValidationNumber(7));
