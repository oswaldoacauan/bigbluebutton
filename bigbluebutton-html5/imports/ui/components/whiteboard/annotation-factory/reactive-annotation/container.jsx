import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ReactiveAnnotationService from './service';
import ReactiveAnnotation from './component';

const ReactiveAnnotationContainer = (props) => {
  if (props.annotations) {
    return props.annotations.map(annotation =>
      <ReactiveAnnotation
        key={annotation._id}
        annotation={annotation}
        slideWidth={props.slideWidth}
        slideHeight={props.slideHeight}
        drawObject={props.drawObject}
      />
    );
  }

  return null;
};

export default withTracker((params) => {
  const { shapeId } = params;
  const annotations = ReactiveAnnotationService.getAnnotationsById(shapeId);
  // console.log(annotations);
  return {
    annotations,
  };
})(ReactiveAnnotationContainer);

ReactiveAnnotationContainer.propTypes = {
  // annotation: PropTypes.objectOf(PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number,
  //   PropTypes.object,
  // ])),
  drawObject: PropTypes.func.isRequired,
  slideWidth: PropTypes.number.isRequired,
  slideHeight: PropTypes.number.isRequired,
};

ReactiveAnnotationContainer.defaultProps = {
  annotation: undefined,
};
