import { getNumbers } from './string-processing.js';
import { addClass, getValueFromBrackets } from './utils.js';

const form = document.querySelector('.img-upload__form');
const uploadControl = form.querySelector('#upload-file');
const uploadedPhotoContainer = form.querySelector('.img-upload__overlay');
const uploadedPhotoPreview = uploadedPhotoContainer.querySelector('.img-upload__preview').querySelector('img');
const effectsPreview = uploadedPhotoContainer.querySelectorAll('.effects__preview');
const body = document.body;
const buttonClose = uploadedPhotoContainer.querySelector('.img-upload__cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const scaleControlMinus = form.querySelector ('.scale__control--smaller');
const scaleControlPlus = form.querySelector ('.scale__control--bigger');
const scaleValue = form.querySelector ('.scale__control--value');
const effectLevelContainer = form.querySelector('.img-upload__effect-level');
const effectSlider = effectLevelContainer.querySelector('.effect-level__slider');
const effectValue = effectLevelContainer.querySelector('.effect-level__value');
const effectsList = form.querySelector('.effects__list');

const sliderSettings = {
  chrome: {
    range: {
      min: 0,
      max: 1
    },
    start:1,
    step:0.1,
    format: {
      to: function (value) {
        return `grayscale(${value})`;
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  },
  sepia: {
    range: {
      min: 0,
      max: 1
    },
    start:1,
    step:0.1,
    format: {
      to: function (value) {
        return `sepia(${value})`;
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  },
  marvin: {
    range: {
      min: 0,
      max: 100
    },
    start:100,
    step:1,
    format: {
      to: function (value) {
        return `invert(${value}%)`;
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  },
  phobos: {
    range: {
      min: 0,
      max: 3
    },
    start:3,
    step:0.1,
    format: {
      to: function (value) {
        return `blur(${value}px)`;
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  },
  heat: {
    range: {
      min: 1,
      max: 3
    },
    start:3,
    step:0.1,
    format: {
      to: function (value) {
        return `brightness(${value})`;
      },
      from: function (value) {
        return parseFloat(value);
      },
    }
  }
};

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

function onMinusClick () {
  const actualScaleValue = getNumbers(scaleValue.value) - 25;
  if (actualScaleValue < 25) {
    return;
  }
  uploadedPhotoPreview.style.transform = `scale(${actualScaleValue / 100})`;
  scaleValue.value = `${actualScaleValue}%`;
}

function onPlusClick () {
  const actualScaleValue = getNumbers(scaleValue.value) + 25;
  if (actualScaleValue > 100) {
    return;
  }
  uploadedPhotoPreview.style.transform = `scale(${actualScaleValue / 100})`;
  scaleValue.value = `${actualScaleValue}%`;
}

function onEffectPick (evt) {
  const effectItem = evt.target.closest('.effects__item');
  if (!effectItem) {
    return;
  }

  if(effectSlider.noUiSlider) {
    effectSlider.noUiSlider.destroy();
  }

  const pickedEffect = effectItem.querySelector('input');
  uploadedPhotoPreview.className = '';
  if(pickedEffect.value === 'none') {
    effectValue.value = '';
    uploadedPhotoPreview.style.filter = '';
    addClass(effectLevelContainer, 'hidden');
    return;
  }

  effectLevelContainer.classList.remove('hidden');
  uploadedPhotoPreview.classList.add(`effects__preview--${pickedEffect.value}`);

  noUiSlider.create(effectSlider, sliderSettings[pickedEffect.value]);
  effectSlider.noUiSlider.on('update', () =>{
    const sliderValue = effectSlider.noUiSlider.get();
    const sliderNumberValue = getValueFromBrackets(sliderValue);

    uploadedPhotoPreview.style.filter = sliderValue;

    if (pickedEffect.value === 'chrome' || pickedEffect.value === 'sepia') {
      effectValue.value = `${sliderNumberValue * 100}%`;
    }

    if (pickedEffect.value === 'marvin') {
      effectValue.value = `${sliderNumberValue}%`;
    }

    if (pickedEffect.value === 'phobos') {
      effectValue.value = `${(sliderNumberValue / 3 * 100).toFixed(0)}%`;
    }

    if (pickedEffect.value === 'heat') {
      effectValue.value = `${((sliderNumberValue - 1) / 2 * 100).toFixed(0)}%`;
    }
  });
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
  scaleControlMinus.addEventListener('click', onMinusClick);
  scaleControlPlus.addEventListener('click', onPlusClick);
  effectsList.addEventListener('change', onEffectPick);
  addClass(effectLevelContainer, 'hidden');
}

function onUploadedPhotoClose () {
  uploadedPhotoContainer.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonClose.removeEventListener('click', onUploadedPhotoClose);
  document.removeEventListener('keydown', onUploadedPhotoEscape);
  form.removeEventListener('submit', onFormSubmit);
  scaleControlMinus.removeEventListener('click', onMinusClick);
  scaleControlPlus.removeEventListener('click', onPlusClick);
  effectsList.removeEventListener('change', onEffectPick);
  uploadedPhotoPreview.className = '';
  if(effectSlider.noUiSlider) {
    effectSlider.noUiSlider.destroy();
  }
}

function onPhotoUpload () {
  uploadedPhotoPreview.src = URL.createObjectURL(uploadControl.files[0]);
  effectsPreview.forEach((element)=>{
    element.style.backgroundImage = `url(${URL.createObjectURL(uploadControl.files[0])})`;
  });
  onUploadedPhotoOpen();
}

uploadControl.addEventListener('change', onPhotoUpload);
