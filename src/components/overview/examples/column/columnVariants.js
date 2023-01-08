import default_monthScenarios from './default/monthScenarios.json';
import default_multipleScenarios from './default/multipleScenarios.json';
import default_negativeScenarios from './default/negativeScenarios.json';
import default_simple from './default/simple.json';
import default_yearScenarios from './default/yearScenarios.json';
import stack_simple from './stack/simple.json';

export const columnVariants = [
  {
    variant: 'Default',
    examples: [
      default_simple,
      default_yearScenarios,
      default_monthScenarios,
      default_negativeScenarios,
      default_multipleScenarios,
    ],
  },
  {
    variant: 'Stack',
    examples: [stack_simple],
  },
];
