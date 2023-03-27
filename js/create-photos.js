import { personalDetails } from './create-personal-details.js';
const photoTemplate = document.querySelector('#picture').content;
const photosFragment = document.createDocumentFragment();
const photosContainer = document.querySelector('.pictures');
personalDetails.forEach((currentDetails) => {
  const currentPhoto = photoTemplate.cloneNode(true);
  const currentImg = currentPhoto.querySelector('.picture__img');
  currentImg.src = currentDetails.url;
  const currentLikes = currentPhoto.querySelector('.picture__likes');
  currentLikes.textContent = currentDetails.likes;
  const currentCommentNumber = currentPhoto.querySelector('.picture__comments');
  currentCommentNumber.textContent = currentDetails.comments.length;
  photosFragment.append(currentPhoto);
}
);
const createPhotos = function () {
  photosContainer.append(photosFragment);
};
export{createPhotos, photosContainer};