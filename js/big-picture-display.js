import { photosDetails } from './api.js';
import { photosContainerNode } from './create-photos.js';
import { addClass, isEscapeKey } from './utils.js';

const COMMENT_DISPLAY_STEP = 5;

const bigPictureContainerNode = document.querySelector('.big-picture');
const socialCommentNode = bigPictureContainerNode.querySelector('.social__comment');
const bigPictureImgNode = bigPictureContainerNode.querySelector('.big-picture__img').querySelector('img');
const likesCountNode = bigPictureContainerNode.querySelector('.likes-count');
const commentsCountNode = bigPictureContainerNode.querySelector('.comments-count');
const showedCommentsCountNode = bigPictureContainerNode.querySelector('.showed-comments');
const socialCaptionNode = bigPictureContainerNode.querySelector('.social__caption');
const commentsLoaderNode = bigPictureContainerNode.querySelector('.comments-loader');
const buttonCloseNode = bigPictureContainerNode.querySelector('.big-picture__cancel');
const body = document.body;
const socialCommentsNode = bigPictureContainerNode.querySelector('.social__comments');
const commentsFragment = document.createDocumentFragment();
let pictureDetails;
let numberOfShowedComments = 0;

function onBigPictureEscape (evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    onBigPictureClose();
  }
}

function onBigPictureOpen () {
  body.classList.add('modal-open');
  bigPictureContainerNode.classList.remove('hidden');
  buttonCloseNode.addEventListener('click', onBigPictureClose);
  document.addEventListener('keydown', onBigPictureEscape);
  commentsLoaderNode.addEventListener('click', onCommentsLoaderNodeClick);
}

function onBigPictureClose () {
  bigPictureContainerNode.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonCloseNode.removeEventListener('click', onBigPictureClose);
  document.removeEventListener('keydown', onBigPictureEscape);
  numberOfShowedComments = 0;
  commentsLoaderNode.removeEventListener('click', onCommentsLoaderNodeClick);
}

function onCommentsLoaderNodeClick () {
  for (let i = 0;i < COMMENT_DISPLAY_STEP;i++) {
    numberOfShowedComments += 1;
    socialCommentsNode.querySelector('li.hidden').classList.remove('hidden');
    showedCommentsCountNode.textContent = numberOfShowedComments;
    if (numberOfShowedComments === pictureDetails.comments.length){
      commentsLoaderNode.classList.add('hidden');
      break;
    }
  }
}

function onPictureClick (evt) {
  const picture = evt.target.closest('.picture');

  if(!picture) {
    return;
  }

  const pickedPictureSrc = picture.querySelector('img').getAttribute('src');
  pictureDetails = photosDetails.find((element) => pickedPictureSrc === element.url);

  bigPictureImgNode.src = pictureDetails.url;
  likesCountNode.textContent = pictureDetails.likes;
  commentsCountNode.textContent = pictureDetails.comments.length;
  socialCaptionNode.textContent = String(pictureDetails.description);

  pictureDetails.comments.forEach((comment)=>{
    const currentComment = socialCommentNode.cloneNode(true);

    if (commentsFragment.childElementCount >= COMMENT_DISPLAY_STEP) {
      currentComment.classList.add('hidden');
    } else {
      numberOfShowedComments += 1;
    }

    const socialPictureNode = currentComment.querySelector('.social__picture');
    const socialTextNode = currentComment.querySelector('.social__text');

    socialTextNode.textContent = comment.message;
    socialPictureNode.src = comment.avatar;
    socialPictureNode.alt = comment.name;

    commentsFragment.append(currentComment);
  });

  showedCommentsCountNode.textContent = numberOfShowedComments;
  socialCommentsNode.innerHTML = '';
  socialCommentsNode.append(commentsFragment);

  if (pictureDetails.comments.length > COMMENT_DISPLAY_STEP){
    commentsLoaderNode.classList.remove('hidden');
  } else {
    addClass(commentsLoaderNode, 'hidden');
  }
  onBigPictureOpen();
}

photosContainerNode.addEventListener('click', onPictureClick);
