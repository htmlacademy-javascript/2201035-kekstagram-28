import { shuffle, debounce } from './utils.js';
import { photosDetails } from './api.js';

const MAX_RANDOM_PHOTOS_NUMBER = 10;

const photoTemplate = document.querySelector('#picture').content;
const photosFragmentNode = document.createDocumentFragment();
const photosContainerNode = document.querySelector('.pictures');
const photosFiltersNode = document.querySelector('.img-filters');
const photoFilterButtonsNode = photosFiltersNode.querySelector('.img-filters__form');

function createPhotos (photoDetails) {
  photoDetails.forEach((currentDetails) => {
    const currentPhoto = photoTemplate.cloneNode(true);
    const currentImgNode = currentPhoto.querySelector('.picture__img');
    const currentLikesNode = currentPhoto.querySelector('.picture__likes');
    const currentCommentNumberNode = currentPhoto.querySelector('.picture__comments');

    currentImgNode.src = currentDetails.url;
    currentLikesNode.textContent = currentDetails.likes;
    currentCommentNumberNode.textContent = currentDetails.comments.length;

    photosFragmentNode.append(currentPhoto);
  }
  );
  photosContainerNode.append(photosFragmentNode);
}

function compareCommentsCount (detailsA, detailsB) {
  return detailsB.comments.length - detailsA.comments.length;
}

function onFilterClick (evt) {
  const pickedFilter = evt.target;
  if (pickedFilter.className !== 'img-filters__button') {
    return;
  }
  photosContainerNode.querySelectorAll('.picture').forEach((item) => item.remove());
  photosFiltersNode.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  pickedFilter.classList.add('img-filters__button--active');
  if(pickedFilter.id === 'filter-default') {
    createPhotos(photosDetails);
    return;
  }
  if(pickedFilter.id === 'filter-random') {
    const shuffledDetails = shuffle(photosDetails.slice());
    createPhotos(shuffledDetails.slice(0,MAX_RANDOM_PHOTOS_NUMBER));
    return;
  }
  if(pickedFilter.id === 'filter-discussed') {
    const discussedPhotos = photosDetails.slice().sort(compareCommentsCount);
    createPhotos(discussedPhotos);
  }

}

function addPhotosFilters() {
  photosFiltersNode.classList.remove('img-filters--inactive');
  photoFilterButtonsNode.addEventListener('click', debounce(onFilterClick));
}

export{createPhotos, photosContainerNode, addPhotosFilters};
