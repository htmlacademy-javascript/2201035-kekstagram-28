import {createPhotos} from './create-photos.js';

let personalDetails;

function createError (errorText) {
  return `<div class ="download-photos-error">${errorText}</div>`;
}

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
    document.body.insertAdjacentHTML('beforeend', createError(`${error} – Ошибка загрузки фотографий других пользователей`));

    const errorContainer = document.querySelector('.download-photos-error');
    errorContainer.style.position = 'absolute';
    errorContainer.style.top = '5px';
    errorContainer.style.left = '5px';
    errorContainer.style.fontSize = '15px';
    errorContainer.style.padding = '3px';
    errorContainer.style.border = '2px solid red';
    errorContainer.style.borderRadius = '5px';
    errorContainer.style.Maxwidth = '98%';
    errorContainer.style.textAlign = 'center';
  });

export{personalDetails};
