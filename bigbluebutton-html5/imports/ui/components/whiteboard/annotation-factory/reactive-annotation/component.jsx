import React from 'react';
import PropTypes from 'prop-types';

const ReactiveAnnotation = (props) => {
  const Component = props.drawObject;

  return (
    <Component
      version={1}
      annotation={props.annotation}
      slideWidth={props.slideWidth}
      slideHeight={props.slideHeight}
    />
  );
};

ReactiveAnnotation.propTypes = {
  annotation: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ])).isRequired,
  drawObject: PropTypes.func.isRequired,
  slideWidth: PropTypes.number.isRequired,
  slideHeight: PropTypes.number.isRequired,
};

export default ReactiveAnnotation;
