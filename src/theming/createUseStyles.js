/**
 * Create a useStyles hook.
 *
 * eg: `useStyle = createUseStyles({theme} => {...})`
 */
export function createUseStyles(styling) {
  return (stylingParameter) => {
    const theme = {
      debug: () =>
        //'#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16)),
        'none',
      //
      headBackground: '#F8F8F8',
      headFontColor: '#888888',
      bodyBackground: '#FFFFFF',
      errorColor: '#C70039',
      title: '#F8F8F8',
      paragraph: '#BABABA',
    };

    const classes =
      typeof styling === 'function'
        ? styling({ theme, ...stylingParameter })
        : styling;

    return { classes, theme };
  };
}
