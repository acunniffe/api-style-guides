import { Operation } from "fast-json-patch";
import { RulesetDefinition } from "@stoplight/spectral-core";
import exp from "constants";
export interface StandardDefinition<Config> {
  slug: string;
  defaultConfiguration: Config;
  githubAuthor: string;
  isConfigValid: (config: Config) => true | Errors;
  toRulesetPatches: ConfigToRulesetPatches<Config>;
  generateSpectralRuleset?: SpectralRulesGenerator<Config>;
}

type Errors = string[];

type ConfigToRulesetPatches<Config> = (
  config: Config,
  generatedSpectralRuleset:
    | ConfigAddressableSpectralRulesetDefinition
    | undefined
) => {
  compatibility: {
    spectral: {
      canPatch: ((config: Config) => boolean) | boolean;
      patch?: (spectralYml: RulesetDefinition) => Patch<RulesetDefinition>;
    };
    optic?: {
      canPatch: ((config: Config) => boolean) | boolean;
      patch?: (opticYml: OpticYml) => Patch<OpticYml>;
    };
  };
};

export type Patch<T> =
  | { updated: T }
  | { errors: Errors }
  | { patch: Operation[] };

export type OpticYml = {
  ruleset: { [key: string]: object }[];
};

type SpectralRulesGenerator<Config> = (
  config: Config
) => Promise<RulesetDefinition>;

export type ConfigAddressableSpectralRulesetDefinition = {
  url: string;
  contents: RulesetDefinition;
  configHash: string;
};
