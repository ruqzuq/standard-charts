import React from 'react';
import packageJSON from '../../../package/package.json';
import { createUseStyles } from '../../theming/createUseStyles';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { ChartType } from './ChartType';
import { barVariants } from './examples/bar/barVariants';
import { columnVariants } from './examples/column/ColumnVariants';
import githubLogo from './githubLogo';
import { Header } from './Header';

const useStyles = createUseStyles(({ theme }) => ({
  container: {
    backgroundColor: theme.debug(),
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    width: '100%',
    height: '100%',
  },
  version: {
    color: '#dddddd',
    display: 'inline',
    marginLeft: '5px',
  },
  links: { display: 'flex', flexDirection: 'row', gap: '10px' },
  anchor: { color: 'none', textDecoration: 'none' },
}));

export function Overview(props) {
  const { setSelectedChart } = props;

  const { classes } = useStyles();

  const Version = () => (
    <div style={classes.version}>v{packageJSON.version}</div>
  );

  const DownloadButton = () => (
    <a
      href={`./download/standard-charts_v${packageJSON.version}.js`}
      className="unselectable"
      style={classes.anchor}
      download
    >
      <Button width="140px" height="40px" style={{ color: 'black' }}>
        Download
        <Version />
      </Button>
    </a>
  );

  const GitHub = () => (
    <a href="https://github.com/ruqzuq/standard-charts">
      <Icon src={githubLogo} size="40px" />
    </a>
  );

  return (
    <div style={classes.container}>
      <Header
        title={
          <div>
            Standard-Charts <Version />
          </div>
        }
        rightElement={
          <div style={classes.links}>
            <DownloadButton />
            <GitHub />
          </div>
        }
        size="40px"
        thin
        verticalPadding="10px"
      />
      <ChartType
        type="Column"
        variants={columnVariants}
        setSelectedChart={setSelectedChart}
      />
      <ChartType
        type="Bar"
        variants={barVariants}
        setSelectedChart={setSelectedChart}
      />
    </div>
  );
}
