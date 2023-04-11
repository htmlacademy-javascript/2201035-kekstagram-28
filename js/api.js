import {createPhotos, addPhotosFilters} from './create-photos.js';
import { onUploadedPhotoClose } from './form-processing.js';

let photosDetails = [];
let resultContainer;
let buttonResultClose;
let showedResult;
const API_URL = 'https://28.javascript.pages.academy/kekstagram';

function onAroundSendingResultClick (evt) {
  if (evt.target.closest('.error__inner') || evt.target.closest('.success__inner')) {
    return;
  }
  onSendingResultClose();
}

function onSendingResultEscape (evt) {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    onSendingResultClose();
  }
}

function onSendingResultClose () {
  buttonResultClose.removeEventListener('click', onSendingResultClose);
  document.removeEventListener('keydown', onSendingResultEscape);
  document.removeEventListener('click', onAroundSendingResultClick);
  showedResult.remove();
}

function openSendingResult (sendingResult) {
  resultContainer = document.querySelector(`#${sendingResult}`).content.cloneNode(true);

  document.body.append(resultContainer);

  showedResult = document.querySelector(`.${sendingResult}`);
  buttonResultClose = showedResult.querySelector(`.${sendingResult}__button`);

  buttonResultClose.addEventListener('click', onSendingResultClose);
  document.addEventListener('keydown', onSendingResultEscape);
  document.addEventListener('click', onAroundSendingResultClick);
}

function createDownloadError (errorText) {
  return `<div class ="download-photos-error">${errorText}</div>`;
}

function onGetPhotosError (error) {
  document.body.insertAdjacentHTML('beforeend', createDownloadError(`${error} – Ошибка загрузки фотографий других пользователей`));

  const errorContainerNode = document.querySelector('.download-photos-error');

  errorContainerNode.style.position = 'absolute';
  errorContainerNode.style.top = '1%';
  errorContainerNode.style.left = '1%';
  errorContainerNode.style.fontSize = '15px';
  errorContainerNode.style.padding = '4px';
  errorContainerNode.style.border = '2px solid red';
  errorContainerNode.style.borderRadius = '5px';
  errorContainerNode.style.Maxwidth = '98%';
  errorContainerNode.style.textAlign = 'center';
}

function getPhotos () {
  fetch (`${API_URL}/data`)
    .then((response)=>{
      if (response.ok) {
        return response.json();
      }

      throw new Error (response.status + response.statusText);
    })
    .then((data)=>{
      photosDetails = data;
      createPhotos(photosDetails);
      addPhotosFilters();
    })
    .catch(onGetPhotosError);
}


function sendFormData (formData) {
  return fetch (API_URL, {
    method: 'POST',
    body: formData
  })
    .then((response)=>{
      if (response.ok) {
        onUploadedPhotoClose();
        openSendingResult('success');
      } else {
        openSendingResult('error');
      }
    })
    .catch(()=> {
      openSendingResult('error');
    });
}

export {photosDetails, getPhotos, sendFormData};
