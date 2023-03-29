import { personalDetails } from './create-personal-details.js';
import { photosContainer } from './create-photos.js';

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

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onBigPictureClose();
  }
};

function onBigPictureOpen () {
  body.classList.add('modal-open');
  bigPictureContainer.classList.remove('hidden');
  buttonClose.addEventListener('click', onBigPictureClose);
  document.addEventListener('keydown', onDocumentKeydown);
}

function onBigPictureClose () {
  bigPictureContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonClose.removeEventListener('click', onBigPictureClose);
  document.removeEventListener('keydown', onDocumentKeydown);
}

const onPictureClick = function (evt) {
  const picture = evt.target.closest('.picture');

  if(!picture) {
    return;
  }

  const pickedPictureSrc = picture.querySelector('img').getAttribute('src');
  const pictureDetails = personalDetails.find((element) => pickedPictureSrc === element.url);

  bigPictureImg.src = pictureDetails.url;
  likesCount.textContent = pictureDetails.likes;
  commentsCount.textContent = pictureDetails.comments.length;
  socialCaption.textContent = String(pictureDetails.description);

  pictureDetails.comments.forEach((comment)=>{
    const currentComment = socialComment.cloneNode(true);
    const socialPicture = currentComment.querySelector('.social__picture');
    const socialText = currentComment.querySelector('.social__text');

    socialText.textContent = comment.message;
    socialPicture.src = comment.avatar;
    socialPicture.alt = comment.name;

    commentsFragment.append(currentComment);
  });

  socialComments.innerHTML = '';
  socialComments.append(commentsFragment);
  socialCommentsCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');

  onBigPictureOpen();
};

photosContainer.addEventListener('click', onPictureClick);
