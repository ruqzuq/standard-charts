import React from 'react';
import { createUseStyles } from '../../theming/createUseStyles';

const useStyles = createUseStyles(({ theme, size, thin, verticalPadding }) => ({
  container: {
    backgroundColor: theme.debug(),
    padding: `${verticalPadding}  20px`,
    width: 'calc(100% - 40px)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    backgroundColor: theme.debug(),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleFont: {
    fontSize: size,
    fontWeight: thin ? '300' : '400',
  },
}));

export function Header(props) {
  const {
    title,
    size = 24,
    thin,
    rightElement,
    verticalPadding = '5px',
  } = props;

  const { classes } = useStyles({ size, thin, verticalPadding });

  return (
    <div style={classes.container}>
      <div style={classes.title}>
        <div style={classes.titleFont}>{title}</div>
        {rightElement}
      </div>
    </div>
  );
}
