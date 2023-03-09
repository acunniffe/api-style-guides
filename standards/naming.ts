import { StandardDefinition } from './lib/standard-definition';

type CasingOptions =
  | 'Capital-Param-Case'
  | 'param-case'
  | 'snake_case'
  | 'PascalCase'
  | 'camelCase';

export const CasingOptionsSelect = [
  { value: undefined, name: '---' },
  { value: 'Capital-Param-Case', name: 'Capital-Param-Case' },
  { value: 'param-case', name: 'param-case' },
  { value: 'snake_case', name: 'snake_case' },
  { value: 'PascalCase', name: 'PascalCase' },
  { value: 'camelCase', name: 'camelCase' },
];

type Config = {
  applies: 'always' | 'added';
  requestHeaders?: CasingOptions;
  queryParameters?: CasingOptions;
  responseHeaders?: CasingOptions;
  cookieParameters?: CasingOptions;
  pathComponents?: CasingOptions;
  properties?: CasingOptions;
};

const Naming: StandardDefinition<Config> = {
  slug: 'naming',
  githubAuthor: 'opticdev',
  defaultConfiguration: {
    applies: 'added',
  },
  isConfigValid: (config) => {
    return true;
  },
  toRulesetPatches: (config: Config, generatedSpectralRuleset) => {
    return {
      compatibility: {
        spectral: {
          canPatch: false,
        },
        optic: {
          canPatch: true,
          patch: (opticYml) => {
            if (opticYml.ruleset.some((i) => i.hasOwnProperty('naming'))) {
              return {
                errors: [
                  'Naming changes already in optic yml from another style guide',
                ],
              };
            }

            opticYml.ruleset = [
              ...(opticYml.ruleset || []),
              {
                naming: config,
              },
            ];

            return { updated: opticYml };
          },
        },
      },
    };
  },
};

export default Naming;
