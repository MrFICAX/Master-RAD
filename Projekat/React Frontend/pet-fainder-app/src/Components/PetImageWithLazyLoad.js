import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PetImageWithLazyLoad = ({ image }) => (
  <div>
    <LazyLoadImage
      alt={image}
      height={250}
      // src={'https://petmagazine.rs/wp-content/uploads/2022/11/43968_web.jpg'} // test
      src={`https://mrficax-react-bucket.s3.amazonaws.com/${image}`}
      
      width={350} />
    <span>{image && image.caption}</span>
  </div>
);

export default PetImageWithLazyLoad;