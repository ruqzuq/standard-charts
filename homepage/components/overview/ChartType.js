import React from 'react';
import { createUseStyles } from '../../theming/createUseStyles';
import { Example } from './Example';
import { Header } from './Header';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  exampleContainer: {
    backgroundColor: theme.debug(),
    width: 'calc(100% - 40px)',
    padding: '0px 20px',
  },
}));

/**
 *
 * @param {[{variant: string, examples: ?[]}]} props.variants
 * @returns
 */
export function ChartType(props) {
  const { type = '', variants = [], setSelectedChart } = props;

  const { classes } = useStyles();

  return (
    <div style={classes.container}>
      <Header title={type} thin />
      {variants.map(({ variant, examples }) => (
        <div key={variant}>
          <Header title={variant} size="18px" />
          <div style={classes.exampleContainer}>
            {examples.map((example, index) => (
              <Example
                key={variant + index}
                example={example}
                onClick={() => {
                  setSelectedChart(example);
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
