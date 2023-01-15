import default_monthScenarios from './default/monthScenarios.json';
import default_multipleScenarios from './default/multipleScenarios.json';
import default_negativeScenarios from './default/negativeScenarios.json';
import default_simple from './default/simple.json';
import default_yearScenarios from './default/yearScenarios.json';

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
  /* {
    variant: 'Stack',
    examples: [
      stack_simple,
      stack_simpleLabel,
      stack_simpleScenariosLabel,
      stack_negativeLabel,
      stack_complexLabel,
    ],
  }, */
];
