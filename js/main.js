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

const commentSentences = [
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
const maxSentencesValue = commentSentences.length;
const minSentencesValue = 1;
const maxCommentIdValue = 500;
const minCommentIdValue = 1;
const maxCommentsNumberValue = 10;
const minCommentsNumberValue = 1;

const getRandomNumber = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const generateComments = () => {
  const usedCommentIds = [];
  return () => {
    let currentCommentId = getRandomNumber(minCommentIdValue,maxCommentIdValue);
    while (usedCommentIds.includes(currentCommentId)) {
      currentCommentId = getRandomNumber(minCommentIdValue,maxCommentIdValue);
    }
    usedCommentIds.push(currentCommentId);
    let currentMessage = '';
    const sentencesNumber = getRandomNumber(minSentencesValue,maxSentencesValue);
    const usedComments = [];
    let commentIndex;
    for (let i = 1;i <= sentencesNumber;i++) {
      commentIndex = getRandomNumber(0, commentSentences.length - 1);
      while(usedComments.includes(commentIndex)) {
        commentIndex = getRandomNumber(0, commentSentences.length - 1);
      }
      currentMessage += commentSentences[commentIndex];
      if(i !== sentencesNumber) {
        currentMessage += ' ';
      }
      usedComments.push(commentIndex);
    }
    return {
      id: currentCommentId,
      avatar: `img/avatar-${ getRandomNumber(minAvatarLinkValue, maxAvatarLinkValue) }.svg`,
      message: currentMessage,
      name: getRandomArrayElement(names),
    };
  };
};

const createComment = generateComments();

const generatePersonalDetails = function () {
  const usedIds = [];
  const usedUrls = [];
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
    const commentsNumber = getRandomNumber(minCommentsNumberValue, maxCommentsNumberValue);
    const comments = Array.from({length:commentsNumber}, createComment);
    return {
      description: getRandomArrayElement(descriptions),
      id: currentID,
      url: `photos/${ currentUrlNumber }.jpg`,
      likes: getRandomNumber(minLikesValue, maxLikesValue),
      comments:comments
    };
  };
};

const createPersonalDetails = generatePersonalDetails();
Array.from({length:25}, createPersonalDetails);
