import { shuffle, debounce } from './utils.js';
import { personalDetails } from './data-exchange.js';

const photoTemplate = document.querySelector('#picture').content;
const photosFragment = document.createDocumentFragment();
const photosContainer = document.querySelector('.pictures');
const photosFilters = document.querySelector('.img-filters');
const randomFilter = photosFilters.querySelector('#filter-random');
const defaultFilter = photosFilters.querySelector('#filter-default');
const discussedFilter = photosFilters.querySelector('#filter-discussed');

function createPhotos (photoDetails) {
  photoDetails.forEach((currentDetails) => {
    const currentPhoto = photoTemplate.cloneNode(true);
    const currentImg = currentPhoto.querySelector('.picture__img');
    const currentLikes = currentPhoto.querySelector('.picture__likes');
    const currentCommentNumber = currentPhoto.querySelector('.picture__comments');

    currentImg.src = currentDetails.url;
    currentLikes.textContent = currentDetails.likes;
    currentCommentNumber.textContent = currentDetails.comments.length;

    photosFragment.append(currentPhoto);
  }
  );
  photosContainer.append(photosFragment);
}

function onDefaultFilterClick () {
  if (defaultFilter.classList.contains('img-filters__button--active')) {
    return;
  }

  while (photosContainer.querySelector('.picture')) {
    photosContainer.querySelector('.picture').remove();
  }

  photosFilters.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  defaultFilter.classList.add('img-filters__button--active');
  createPhotos(personalDetails);
}

function compareCommetnsCount (detailsA, detailsB) {
  return detailsB.comments.length - detailsA.comments.length;
}

function onDiscussedFilterClick () {
  if (discussedFilter.classList.contains('img-filters__button--active')) {
    return;
  }
  while (photosContainer.querySelector('.picture')) {
    photosContainer.querySelector('.picture').remove();
  }

  photosFilters.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  discussedFilter.classList.add('img-filters__button--active');

  const discussedPhotos = personalDetails.slice().sort(compareCommetnsCount).slice(0,10);
  createPhotos(discussedPhotos);
}

function onRandomFilterClick () {
  while (photosContainer.querySelector('.picture')) {
    photosContainer.querySelector('.picture').remove();
  }

  if(!randomFilter.classList.contains('img-filters__button--active')) {
    photosFilters.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    randomFilter.classList.add('img-filters__button--active');
  }
  const detailsForShuffle = personalDetails.slice();
  createPhotos(shuffle(detailsForShuffle));
}

function addPhotosFilters () {
  photosFilters.classList.remove('img-filters--inactive');
  randomFilter.addEventListener('click', debounce(onRandomFilterClick));
  defaultFilter.addEventListener('click', debounce(onDefaultFilterClick));
  discussedFilter.addEventListener('click', debounce(onDiscussedFilterClick));
}

export{createPhotos, photosContainer, addPhotosFilters};
