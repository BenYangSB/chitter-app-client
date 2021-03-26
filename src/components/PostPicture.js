import React from 'react';
import ImageUploading from 'react-images-uploading';

export function PostPicture(props) {
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    //Try to set the prop as the image list
    props.setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={10}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
              className="addRemoveImageBtn"
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll} className="addRemoveImageBtn">Remove all images</button>
            <div id="uploadedImagesContainer">
            {imageList.map((image, index) => (
              // <div key={index} className="image-item">
                <div className="uploadedImage">
                  <img src={image['data_url']} alt="" width="150" />
                  <div className="image-item__btn-wrapper">
                    <button onClick={() => onImageUpdate(index)} className="updateRemoveImgBtn">Update</button>
                    <button onClick={() => onImageRemove(index)} className="updateRemoveImgBtn">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
}

export default PostPicture;
