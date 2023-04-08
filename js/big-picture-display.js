import { personalDetails } from './data-exchange.js';
import { photosContainer } from './create-photos.js';
import { addClass } from './utils.js';

const bigPictureContainer = document.querySelector('.big-picture');
const socialComment = bigPictureContainer.querySelector('.social__comment');
const bigPictureImg = bigPictureContainer.querySelector('.big-picture__img').querySelector('img');
const likesCount = bigPictureContainer.querySelector('.likes-count');
const commentsCount = bigPictureContainer.querySelector('.comments-count');
const socialCaption = bigPictureContainer.querySelector('.social__caption');
const socialCommentsCount = bigPictureContainer.querySelector('.social__comment-count');
const commentsLoader = bigPictureContainer.querySelector('.comments-loader');
const buttonClose = bigPictureContainer.querySelector('.big-picture__cancel');
const body = document.body;
const socialComments = bigPictureContainer.querySelector('.social__comments');
const commentsFragment = document.createDocumentFragment();
let pictureDetails;
let numberOfShowedComments = 0;
const commentDisplayStep = 5;

const onBigPictureEscape = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onBigPictureClose();
  }
};

function onBigPictureOpen () {
  body.classList.add('modal-open');
  bigPictureContainer.classList.remove('hidden');
  buttonClose.addEventListener('click', onBigPictureClose);
  document.addEventListener('keydown', onBigPictureEscape);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
}

function onBigPictureClose () {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonClose.removeEventListener('click', onBigPictureClose);
  document.removeEventListener('keydown', onBigPictureEscape);
  numberOfShowedComments = 0;
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
}

function onCommentsLoaderClick () {
  for (let i = 0;i < commentDisplayStep;i++) {
    numberOfShowedComments += 1;
    socialComments.querySelector('li.hidden').classList.remove('hidden');
    socialCommentsCount.innerHTML = `${numberOfShowedComments} из <span class="comments-count">${pictureDetails.comments.length}</span> комментариев`;
    if (numberOfShowedComments === pictureDetails.comments.length){
      commentsLoader.classList.add('hidden');
      break;
    }
  }
}

const onPictureClick = function (evt) {
  const picture = evt.target.closest('.picture');

  if(!picture) {
    return;
  }

  const pickedPictureSrc = picture.querySelector('img').getAttribute('src');
  pictureDetails = personalDetails.find((element) => pickedPictureSrc === element.url);

  bigPictureImg.src = pictureDetails.url;
  likesCount.textContent = pictureDetails.likes;
  commentsCount.textContent = pictureDetails.comments.length;
  socialCaption.textContent = String(pictureDetails.description);

  pictureDetails.comments.forEach((comment)=>{
    const currentComment = socialComment.cloneNode(true);

    if (commentsFragment.childElementCount >= commentDisplayStep) {
      currentComment.classList.add('hidden');
    } else {
      numberOfShowedComments += 1;
    }

    const socialPicture = currentComment.querySelector('.social__picture');
    const socialText = currentComment.querySelector('.social__text');

    socialText.textContent = comment.message;
    socialPicture.src = comment.avatar;
    socialPicture.alt = comment.name;

    commentsFragment.append(currentComment);
  });

  socialCommentsCount.innerHTML = `${numberOfShowedComments} из <span class="comments-count">${pictureDetails.comments.length}</span> комментариев`;
  socialComments.innerHTML = '';
  socialComments.append(commentsFragment);

  if (pictureDetails.comments.length > commentDisplayStep){
    commentsLoader.classList.remove('hidden');
  } else {
    addClass(commentsLoader, 'hidden');
  }
  onBigPictureOpen();
};

photosContainer.addEventListener('click', onPictureClick);
