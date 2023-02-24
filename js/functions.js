//1.
let checkLength = function (string, limitLength) {
  if (String(string).length <= limitLength) {
    return true;
  } else {
    return false;
  }
}

//2.

let checkPalindrome = function (string) {
  let noSpaceString = String(string).replaceAll(' ', '');
  let reversedString = noSpaceString.split('').reverse().join('');
  if (reversedString === noSpaceString) {
    return true;
  } else {
    return false;
  }
}

//3.

let getNumbers = function (data) {
  let numbers = '';
  let currentNumber = '';
  let string = String(data);
  for (let i = 0; i < string.length; i++) {
    if (parseInt (string[i]) === parseInt(string[i])) {
      currentNumber = numbers + string[i];
    }
    numbers = parseInt(currentNumber);
  }
  return numbers;
}

//4.

let getNewString = function (data, length, extraData) {
  let string = String(data);
  let extraString = String(extraData);
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
  } else {newString = string}
  return newString;
}
