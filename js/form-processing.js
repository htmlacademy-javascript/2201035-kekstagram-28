import {addClass, getValueFromBrackets, isEscapeKey} from './utils.js';
import {sendFormData} from './api.js';

const SCALE_STEP = 25;
const MAX_SCALE_VALUE = 100;
const MAX_HASHTAG_NUMBER = 5;
const HASHTAG_REG = /^#[a-zа-яё0-9]{1,19}$/i;
const Effects = {
  NONE: 'none',
  CHROME: 'chrome',
  MARVIN:'marvin',
  SEPIA: 'sepia',
  PHOBOS: 'phobos',
  HEAT: 'heat'
};
const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const formNode = document.querySelector('.img-upload__form');
const uploadControlNode = formNode.querySelector('#upload-file');
const uploadedPhotoContainerNode = formNode.querySelector('.img-upload__overlay');
const uploadedPhotoPreviewNode = uploadedPhotoContainerNode.querySelector('.img-upload__preview').querySelector('img');
const effectsPreviewNode = uploadedPhotoContainerNode.querySelectorAll('.effects__preview');
const body = document.body;
const buttonCloseNode = uploadedPhotoContainerNode.querySelector('#upload-cancel');
const hashtagInputNode = formNode.querySelector('.text__hashtags');
const commentInputNode = formNode.querySelector('.text__description');
const scaleControlMinusNode = formNode.querySelector ('.scale__control--smaller');
const scaleControlPlusNode = formNode.querySelector ('.scale__control--bigger');
const scaleValueNode = formNode.querySelector ('.scale__control--value');
const effectLevelContainerNode = formNode.querySelector('.img-upload__effect-level');
const effectSliderNode = effectLevelContainerNode.querySelector('.effect-level__slider');
const effectValueNode = effectLevelContainerNode.querySelector('.effect-level__value');
const effectsListNode = formNode.querySelector('.effects__list');
const effectNone = effectsListNode.querySelector('#effect-none');
const submitButtonNode = formNode.querySelector('#upload-submit');

const SliderSettings = {
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

const pristine = new Pristine(formNode, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'span',
  errorTextClass: 'hashtag__error'
});

function validateHashtagsReg (value) {
  if (!value) {
    return true;
  }

  const hashtagArray = value.split(' ');

  return !hashtagArray.some((hashtag)=> !HASHTAG_REG.test(hashtag));
}

function validateHashtagsNumber (value) {
  if (!value) {
    return true;
  }
  const hashtagArray = value.split(' ');

  return hashtagArray.length <= MAX_HASHTAG_NUMBER;
}

function validateHashtagsUniqueness (value) {
  if (!value) {
    return true;
  }
  const usedHashtags = [];
  const hashtagArray = value.split(' ');
  let isArrayValid = true;

  for (let i = 0; i < hashtagArray.length; i ++) {
    if(usedHashtags.includes(hashtagArray[i].toLowerCase())){
      if (hashtagArray[i] !== ''){
        isArrayValid = false;
        break;
      }
    }
    usedHashtags.push(hashtagArray[i].toLowerCase());
  }
  return isArrayValid;
}

pristine.addValidator(hashtagInputNode,validateHashtagsReg, 'Хэштэги начинаются с #, не содержат спецсимволы и не превышают 20 символов, разделены одним пробелом');
pristine.addValidator(hashtagInputNode,validateHashtagsNumber, 'Не более 5 хэштэгов');
pristine.addValidator(hashtagInputNode,validateHashtagsUniqueness, 'Хэштэги не должны повторяться');

function onMinusClick () {
  const actualScaleValue = Number(scaleValueNode.value.slice(0,-1)) - SCALE_STEP;
  if (actualScaleValue < SCALE_STEP) {
    return;
  }
  uploadedPhotoPreviewNode.style.transform = `scale(${actualScaleValue / 100})`;
  scaleValueNode.value = `${actualScaleValue}%`;
}

function onPlusClick () {
  const actualScaleValue = Number(scaleValueNode.value.slice(0,-1)) + SCALE_STEP;
  if (actualScaleValue > MAX_SCALE_VALUE) {
    return;
  }
  uploadedPhotoPreviewNode.style.transform = `scale(${actualScaleValue / 100})`;
  scaleValueNode.value = `${actualScaleValue}%`;
}

function onEffectPick (evt) {
  const effectItem = evt.target.closest('.effects__item');
  if (!effectItem) {
    return;
  }

  if(effectSliderNode.noUiSlider) {
    effectSliderNode.noUiSlider.destroy();
  }

  const pickedEffect = effectItem.querySelector('input');
  uploadedPhotoPreviewNode.className = '';
  if(pickedEffect.value === Effects.NONE) {
    effectValueNode.value = '';
    uploadedPhotoPreviewNode.style.filter = '';
    addClass(effectLevelContainerNode, 'hidden');
    return;
  }

  effectLevelContainerNode.classList.remove('hidden');
  uploadedPhotoPreviewNode.classList.add(`effects__preview--${pickedEffect.value}`);

  noUiSlider.create(effectSliderNode, SliderSettings[pickedEffect.value]);
  effectSliderNode.noUiSlider.on('update', () =>{
    const sliderValue = effectSliderNode.noUiSlider.get();
    const sliderNumberValue = getValueFromBrackets(sliderValue);

    uploadedPhotoPreviewNode.style.filter = sliderValue;

    if (pickedEffect.value === Effects.CHROME || pickedEffect.value === Effects.SEPIA) {
      effectValueNode.value = `${sliderNumberValue * 100}%`;
    }

    if (pickedEffect.value === Effects.MARVIN) {
      effectValueNode.value = `${sliderNumberValue}%`;
    }

    if (pickedEffect.value === Effects.PHOBOS) {
      effectValueNode.value = `${(sliderNumberValue / 3 * 100).toFixed(0)}%`;
    }

    if (pickedEffect.value === Effects.HEAT) {
      effectValueNode.value = `${((sliderNumberValue - 1) / 2 * 100).toFixed(0)}%`;
    }
  });
}

function onFormSubmit (evt) {
  evt.preventDefault();
  if (!pristine.validate()) {
    return;
  }
  submitButtonNode.disabled = true;
  sendFormData(new FormData(evt.target)).then(()=>{
    submitButtonNode.disabled = false;
  });
}

function onUploadedPhotoEscape (evt) {
  if (isEscapeKey(evt)) {
    if (hashtagInputNode === document.activeElement || commentInputNode === document.activeElement) {
      return;
    }
    if (body.querySelector('.error')) {
      return;
    }
    evt.preventDefault();
    onUploadedPhotoClose();
  }
}

function onUploadedPhotoOpen () {
  body.classList.add('modal-open');
  uploadedPhotoContainerNode.classList.remove('hidden');
  buttonCloseNode.addEventListener('click', onUploadedPhotoClose);
  document.addEventListener('keydown', onUploadedPhotoEscape);
  formNode.addEventListener('submit', onFormSubmit);
  scaleControlMinusNode.addEventListener('click', onMinusClick);
  scaleControlPlusNode.addEventListener('click', onPlusClick);
  effectsListNode.addEventListener('change', onEffectPick);
  addClass(effectLevelContainerNode, 'hidden');
}

function onUploadedPhotoClose () {
  uploadedPhotoContainerNode.classList.add('hidden');
  body.classList.remove('modal-open');
  buttonCloseNode.removeEventListener('click', onUploadedPhotoClose);
  document.removeEventListener('keydown', onUploadedPhotoEscape);
  formNode.removeEventListener('submit', onFormSubmit);
  scaleControlMinusNode.removeEventListener('click', onMinusClick);
  scaleControlPlusNode.removeEventListener('click', onPlusClick);
  effectsListNode.removeEventListener('change', onEffectPick);
  uploadedPhotoPreviewNode.className = '';
  uploadedPhotoPreviewNode.style.filter = '';
  uploadedPhotoPreviewNode.style.transform = '';
  scaleValueNode.value = '100%';
  hashtagInputNode.value = '';
  commentInputNode.value = '';
  uploadControlNode.value = '';
  effectNone.checked = true;
  if(effectSliderNode.noUiSlider) {
    effectSliderNode.noUiSlider.destroy();
  }
}

function onPhotoUpload () {
  const matches = FILE_TYPES.some((it) => uploadControlNode.files[0].name.toLowerCase().endsWith(it));
  if(!matches) {
    return;
  }
  uploadedPhotoPreviewNode.src = URL.createObjectURL(uploadControlNode.files[0]);
  effectsPreviewNode.forEach((element)=>{
    element.style.backgroundImage = `url(${URL.createObjectURL(uploadControlNode.files[0])})`;
  });
  onUploadedPhotoOpen();
}

uploadControlNode.addEventListener('change', onPhotoUpload);

export {onUploadedPhotoClose};
