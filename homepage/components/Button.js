import React from 'react';
import { createUseStyles } from '../theming/createUseStyles';

const useStyles = createUseStyles(({ width, height }) => ({
  button: {
    width: width,
    height: height,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
}));

export function Button(props) {
  const { children, width = '100%', height = '100%', onClick, style } = props;

  const { classes } = useStyles({ width, height });

  return (
    <div
      onClick={onClick}
      className="button"
      style={{ ...classes.button, ...style }}
    >
      {children}
    </div>
  );
}
