import { StandardDefinition } from "./lib/standard-definition";

type Config = {
  exclude_operations_with_extension: string;
};

const BreakingChanges: StandardDefinition<Config> = {
  slug: "breaking-changes",
  githubAuthor: "opticdev",
  defaultConfiguration: {
    exclude_operations_with_extension: "x-draft",
  },
  isConfigValid: (config) => {
    if (config.exclude_operations_with_extension) {
      if (!config.exclude_operations_with_extension.startsWith("x-")) {
        return [
          `Skip operations extension must start with "x-". Currently: ${config.exclude_operations_with_extension} `,
        ];
      }
    }
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
            if (opticYml.rulesets["breaking-changes"]) {
              return {
                errors: [
                  "Breaking changes already in optic yml from another style guide",
                ],
              };
            }

            opticYml.rulesets["breaking-changes"] = {
              exclude_operations_with_extension:
                config.exclude_operations_with_extension,
            };

            return { updated: opticYml };
          },
        },
      },
    };
  },
};

export default BreakingChanges
