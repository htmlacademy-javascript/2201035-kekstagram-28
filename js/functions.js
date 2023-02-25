//1.
const checkLength = function (string, limitLength) {
  if (String(string).length <= limitLength) {
    return true;
  } else {
    return false;
  }
};

//2.

const checkPalindrome = function (string) {
  const noSpaceString = String(string).replaceAll(' ', '');
  const reversedString = noSpaceString.split('').reverse().join('');
  if (reversedString === noSpaceString) {
    return true;
  } else {
    return false;
  }
};

//3.

const getNumbers = function (data) {
  let numbers = '';
  let currentNumber = '';
  const string = String(data);
  for (let i = 0; i < string.length; i++) {
    if (parseInt (string[i], 10) === parseInt(string[i], 10)) {
      currentNumber = numbers + string[i];
    }
    numbers = currentNumber;
  }
  const result = parseInt(numbers,10);
  return result;
};

//4.

const getNewString = function (data, length, extraData) {
  const string = String(data);
  const extraString = String(extraData);
  let newString = '';
  if (length >= string.length) {
    newString = string;
    let processingString;
    for (let i = 0; newString.length <= length; i++) {
      if (newString.length === length) {
        break;
      } else {
        if (newString.length + extraString.length <= length) {
          processingString = extraString + newString;
          newString = processingString;
        } else {
          processingString = extraString.slice(0, length - newString.length) + newString;
          newString = processingString;
        }
      }
    }
  } else {
    newString = string;
  }
  return newString;
};

checkLength('fsdfs', 10);
checkPalindrome('abcddcba');
getNumbers('a1b2c3');
getNewString('abc',10, '12345');
