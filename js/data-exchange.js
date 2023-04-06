import {createPhotos} from './create-photos.js';
import { onUploadedPhotoClose } from './form-processing.js';

let personalDetails;

let resultContainer;
let buttonResultClose;
let showedResult;

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

function onDownloadPhotoErorr (error) {
  document.body.insertAdjacentHTML('beforeend', createDownloadError(`${error} – Ошибка загрузки фотографий других пользователей`));

  const errorContainer = document.querySelector('.download-photos-error');

  errorContainer.style.position = 'absolute';
  errorContainer.style.top = '1%';
  errorContainer.style.left = '1%';
  errorContainer.style.fontSize = '15px';
  errorContainer.style.padding = '4px';
  errorContainer.style.border = '2px solid red';
  errorContainer.style.borderRadius = '5px';
  errorContainer.style.Maxwidth = '98%';
  errorContainer.style.textAlign = 'center';
}

function downloadPhotos () {
  fetch ('https://28.javascript.pages.academy/kekstagram/data')
    .then((response)=>{
      if (response.ok) {
        return response.json();
      }
      throw new Error (response.status + response.statusText);
    })
    .then((data)=>{
      personalDetails = data;
      createPhotos(data);
    })
    .catch((error)=>{
      onDownloadPhotoErorr(error);
    });
}


function sendFormData (formData) {
  fetch ('https://28.javascript.pages.academy/kekstagram', {
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

export{personalDetails, downloadPhotos, sendFormData};
