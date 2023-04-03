const form = document.querySelector('.img-upload__form');
const uploadControl = form.querySelector('#upload-file');
const uploadedPhotoContainer = form.querySelector('.img-upload__overlay');
const uploadedPhotoPreview = uploadedPhotoContainer.querySelector('.img-upload__preview').querySelector('img');
const effectsPreview = uploadedPhotoContainer.querySelectorAll('.effects__preview');
const body = document.body;
const buttonClose = uploadedPhotoContainer.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form);

function validateHashtags (value) {
  if (value === '') {
    return true;
  }

  const hashtagReg = /^#[a-zа-яё0-9]{1,19}$/i;
  const hashtagArray = value.split(' ');

  if (hashtagArray.length > 5) {
    return false;
  }

  let isArrayValid = true;
  const usedHashtags = [];

  hashtagArray.forEach((hashtag)=>{
    if(!hashtagReg.test(hashtag)) {
      isArrayValid = false;
    }
    if(usedHashtags.includes(hashtag.toLowerCase())){
      isArrayValid = false;
    }
    usedHashtags.push(hashtag.toLowerCase());
  });

  if (!isArrayValid) {
    return false;
  }
  return true;
}

pristine.addValidator(hashtagInput,validateHashtags);

function onFormSubmit (evt) {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
}

function onUploadedPhotoEscape (evt) {
  if (evt.key === 'Escape') {
    if (hashtagInput === document.activeElement || commentInput === document.activeElement) {
      return;
    }
    evt.preventDefault();
    onUploadedPhotoClose();
  }
}

function onUploadedPhotoOpen () {
  body.classList.add('modal-open');
  uploadedPhotoContainer.classList.remove('hidden');
  buttonClose.addEventListener('click', onUploadedPhotoClose);
  document.addEventListener('keydown', onUploadedPhotoEscape);
  form.addEventListener('submit', onFormSubmit);
}

function onUploadedPhotoClose () {
  uploadedPhotoContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonClose.removeEventListener('click', onUploadedPhotoClose);
  document.removeEventListener('keydown', onUploadedPhotoEscape);
  form.removeEventListener('submit', onFormSubmit);
}

function onPhotoUpload () {
  uploadedPhotoPreview.src = URL.createObjectURL(uploadControl.files[0]);
  effectsPreview.forEach((element)=>{
    element.style.backgroundImage = `url(${URL.createObjectURL(uploadControl.files[0])})`;
  });
  onUploadedPhotoOpen();
}

uploadControl.addEventListener('change', onPhotoUpload);
