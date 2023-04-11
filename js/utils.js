function addClass (element, className){
  if(!element.classList.contains(className)) {
    element.classList.add(className);
  }
}

function getValueFromBrackets (string) {
  let value;
  for (let i = 0; i < string.length; i++) {
    if (string[i - 1] === '(') {
      value = string[i];
    }
    if (value) {
      if (Number.isInteger(Number(string[i + 1])) || string[i + 1] === '.'){
        value += string[i + 1];
      }
    }
    if (string[i + 1] === ')') {
      return value;
    }
  }
}

function shuffle (array) {
  let m = array.length, t, i;

  while (m) {

    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function debounce (callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}

export {addClass, getValueFromBrackets, shuffle, debounce};
