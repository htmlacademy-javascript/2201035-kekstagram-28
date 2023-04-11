import { shuffle, debounce } from './utils.js';
import { photosDetails } from './api.js';

const photoTemplate = document.querySelector('#picture').content;
const photosFragmentNode = document.createDocumentFragment();
const photosContainerNode = document.querySelector('.pictures');
const photosFiltersNode = document.querySelector('.img-filters');
const randomFilterNode = photosFiltersNode.querySelector('#filter-random');
const defaultFilterNode = photosFiltersNode.querySelector('#filter-default');
const discussedFilterNode = photosFiltersNode.querySelector('#filter-discussed');

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
  const currentFilter = evt.target;
  if (currentFilter.classList.contains('img-filters__button--active')) {
    return;
  }

  photosContainerNode.querySelectorAll('.picture').forEach((item) => item.remove());
  photosFiltersNode.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
  currentFilter.classList.add('img-filters__button--active');
}

function onDefaultFilterNodeClick (evt) {
  onFilterClick(evt);
  createPhotos(photosDetails);
}

function onDiscussedFilterNodeClick (evt) {
  onFilterClick(evt);

  const discussedPhotos = photosDetails.slice().sort(compareCommentsCount);
  createPhotos(discussedPhotos);
}

function onRandomFilterNodeClick (evt) {
  onFilterClick(evt);

  const shuffledDetails = shuffle(photosDetails.slice());
  createPhotos(shuffledDetails.slice(0,10));
}

function addPhotosFilters() {
  photosFiltersNode.classList.remove('img-filters--inactive');
  defaultFilterNode.addEventListener('click', debounce(onDefaultFilterNodeClick));
  discussedFilterNode.addEventListener('click', debounce(onDiscussedFilterNodeClick));
  randomFilterNode.addEventListener('click', debounce(onRandomFilterNodeClick));
}

export{createPhotos, photosContainerNode, addPhotosFilters};
