const photoTemplate = document.querySelector('#picture').content;
const photosFragment = document.createDocumentFragment();
const photosContainer = document.querySelector('.pictures');

const createPhotos = function (personalDetails) {
  personalDetails.forEach((currentDetails) => {
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
};


export{createPhotos, photosContainer};
