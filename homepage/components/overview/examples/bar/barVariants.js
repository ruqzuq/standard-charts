import default_manyCountries from './default/manyCountries.json';
import default_multipleScenarios from './default/multipleScenarios.json';
import default_negativeScenarios from './default/negativeScenarios.json';
import default_simple from './default/simple.json';
import default_simpleScenario from './default/simpleScenario.json';

export const barVariants = [
  {
    variant: 'Default',
    examples: [
      default_simple,
      default_simpleScenario,
      default_multipleScenarios,
      default_negativeScenarios,
      default_manyCountries,
    ],
  },
];
