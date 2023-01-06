import monthScenarios from './default/monthScenarios.json';
import multipleScenarios from './default/multipleScenarios.json';
import negativeScenarios from './default/negativeScenarios.json';
import simple from './default/simple.json';
import yearScenarios from './default/yearScenarios.json';

export const columnVariants = [
  {
    variant: 'Default',
    examples: [
      simple,
      yearScenarios,
      monthScenarios,
      negativeScenarios,
      multipleScenarios,
    ],
  },
];
