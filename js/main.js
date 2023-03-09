const names = [
  'Артём',
  'Екатерина',
  'Алексей',
  'Ксения',
  'Сергей',
  'Даниил',
  'Виктор',
  'Иван',
  'Анастасия',
  'Дмитрий'
];

const descriptions = [
  'Жизнь - игра, играй красиво!',
  'Астролог-нумеролог-таролог. Знаю все секреты твоего парня лучше, чем он сам.',
  'Даже фотошоп не исправит ошибок природы.',
  'Моя жизнь - мои правила! Не нравятся правила? Не лезь в мою жизнь...',
  'Это не у меня нет девушки. Это ни у одной девушки нет меня!',
  'Если волк молчит, то лучше его не перебивай.',
  'Брат уйдёт от брата только если звонок на урок.',
  'Бегать за овцами — удел баранов. Я бегаю только за пивом.',
  'Мужчина царь, каблук его корона!',
  'Меня судить у вас не хватит аргументов, a рот закрыть не хватит интеллекта.',
  'Где вы видели такую кошку, которую бы волновало, что о ней говорят мыши?',
  'Принимайте меня такой, какая я есть! Хуже не стану, а лучше — уже некуда!',
  'Хочешь, чтобы я сняла корону? Прости, дорогой, не могу! Я с ней родилась…',
  'Волка давно не кормят ноги, волка кормит чайхана'
];

const comments = [
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.',
  'Как можно было поймать такой неудачный момент?!',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'В целом всё неплохо. Но не всё.'
];

const maxIdValue = 25;
const minIdValue = 1;
const maxUrlValue = 25;
const minUrlValue = 1;
const maxLikesValue = 200;
const minLikesValue = 15;
const maxAvatarLinkValue = 6;
const minAvatarLinkValue = 1;
const maxCommentsValue = comments.length;
const minCommentsValue = 1;

const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];
const generatePersonalDetails = function () {
  const usedIds = [];
  const usedUrls = [];
  const usedCommentIDs = [];
  return function () {
    let currentID = getRandomNumber(minIdValue,maxIdValue);
    let currentUrlNumber = getRandomNumber(minUrlValue,maxUrlValue);
    while (usedIds.includes(currentID)){
      currentID = getRandomNumber(minIdValue,maxIdValue);
    }
    usedIds.push(currentID);
    while (usedUrls.includes(currentUrlNumber)) {
      currentUrlNumber = getRandomNumber(minUrlValue,maxUrlValue);
    }
    usedUrls.push(currentUrlNumber);
    let currentComment = '';
    const commentsNumber = getRandomNumber(minCommentsValue,maxCommentsValue);
    const usedComments = [];
    let commentIndex;
    for (let i = 1;i <= commentsNumber;i++) {
      commentIndex = getRandomNumber(0, comments.length - 1);
      while(usedComments.includes(commentIndex)) {
        commentIndex = getRandomNumber(0, comments.length - 1);
      }
      currentComment += comments[commentIndex];
      if(i !== commentsNumber) {
        currentComment += ' ';
      }
      usedComments.push(commentIndex);
    }
    let currentCommentID = getRandomNumber(1, 999999);
    while (usedCommentIDs.includes(currentCommentID)) {
      currentCommentID = getRandomNumber(1, 999999);
    }
    usedCommentIDs.push(currentCommentID);
    return {
      name: getRandomArrayElement(names),
      description: getRandomArrayElement(descriptions),
      id: currentID,
      url: `photos/${ currentUrlNumber }.jpg`,
      likes: getRandomNumber(minLikesValue, maxLikesValue),
      message: currentComment,
      commentID: currentCommentID,
      avatar: `img/avatar-${ getRandomNumber(minAvatarLinkValue, maxAvatarLinkValue) }.svg`
    };
  };
};
const createPersonalDetails = generatePersonalDetails();
Array.from({length:25}, createPersonalDetails);

