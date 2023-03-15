import {checkLength, checkPalindrome, getNumbers, getNewString} from './string-processing.js';
import {createPersonalDetails} from './create-personal-details.js';

Array.from({length:25}, createPersonalDetails());

checkLength('a1b2c3');
checkPalindrome('a1b2c3');
getNumbers('a1b2c3');
getNewString('a1b2c3', 10,'d4e5f6');
