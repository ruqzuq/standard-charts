import React from 'react';

/**
 * A simple icon with required properties in a desktop application.
 */
export function Icon(props) {
  const { src, size, width = size, height = 'auto', style, className } = props;

  return (
    <img
      className={'unselectable ' + className}
      style={{ ...style }}
      draggable="false"
      src={src}
      alt=""
      width={width}
      height={height}
    />
  );
}
