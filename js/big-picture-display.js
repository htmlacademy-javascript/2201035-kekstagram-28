import { personalDetails } from './create-personal-details.js';
import { photosContainer } from './create-photos.js';

const bigPictureContainer = document.querySelector('.big-picture');
const socialComment = document.querySelector('.social__comment');
const bigPictureImg = bigPictureContainer.querySelector('.big-picture__img').querySelector('img');
const likesCount = bigPictureContainer.querySelector('.likes-count');
const commentsCount = bigPictureContainer.querySelector('.comments-count');
const socialCaption = bigPictureContainer.querySelector('.social__caption');
const socialCommentsCount = bigPictureContainer.querySelector('.social__comment-count');
const commentsLoader = bigPictureContainer.querySelector('.comments-loader');
const buttonClose = bigPictureContainer.querySelector('.big-picture__cancel');
const body = document.querySelector('body');
const socialComments = bigPictureContainer.querySelector('.social__comments');
const initialsocialComments = socialComments.innerHTML;
const commentsFragment = document.createDocumentFragment();

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeBigPicture();
  }
};

function closeBigPicture () {
  bigPictureContainer.classList.add('hidden');
  socialComments.innerHTML = initialsocialComments;
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

const openBigPicture = function (evt) {
  if(evt.target.closest('.picture')) {
    const pickedPicture = evt.target;
    const pictureDetails = personalDetails.find((element)=>{
      if(element.url === pickedPicture.getAttribute('src')){
        return true;
      } else {
        if(element.url === pickedPicture.parentNode.previousElementSibling.getAttribute('src')){
          return true;
        }
      }
    });

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

    socialComments.append(commentsFragment);

    socialCommentsCount.classList.add('hidden');
    commentsLoader.classList.add('hidden');
    body.classList.add('modal-open');
    bigPictureContainer.classList.remove('hidden');

    buttonClose.addEventListener('click', closeBigPicture);
    document.addEventListener('keydown', onDocumentKeydown);
  }
};

const displayBigPicture = function() {
  return photosContainer.addEventListener('click', openBigPicture);
};

export {displayBigPicture};
