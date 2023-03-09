import { OpticYml, Patch, StandardDefinition } from './standard-definition';
import { RulesetDefinition } from '@stoplight/spectral-core';
import * as jsonPatch from 'fast-json-patch';
import { PersistedSpectralYaml } from './persist-spectral-yaml';

export const defaultOpticYml: OpticYml = Object.freeze({
  ruleset: [],
});

export const defaultSpectralYml: RulesetDefinition = Object.freeze({
  extends: [],
});

export type RunnerConfigs = {
  opticYml: OpticYml;
  spectralYml: RulesetDefinition;
  compatibility: {
    optic: boolean;
    spectral: boolean;
  };
};

export async function configToPatches(
  plugin: StandardDefinition<any>,
  globalConfig: Record<string, object>,
  runnerConfigs: RunnerConfigs = {
    compatibility: { optic: true, spectral: true },
    opticYml: jsonPatch.deepClone(defaultOpticYml),
    spectralYml: jsonPatch.deepClone(defaultSpectralYml),
  },
  hostname: string = 'https://example.com'
): Promise<RunnerConfigs> {
  const pluginActivated = globalConfig.hasOwnProperty(plugin.slug);
  if (pluginActivated) {
    const config = getConfig(plugin, globalConfig);

    const spectralGenerated = plugin.generateSpectralRuleset
      ? await plugin.generateSpectralRuleset(config)
      : undefined;

    let spectral;
    if (spectralGenerated) {
      spectral = await PersistedSpectralYaml.persist(
        plugin.slug,
        spectralGenerated,
        hostname
      );
    }

    const patches = plugin.toRulesetPatches(config, spectral);

    let updatedRunnerConfigs: RunnerConfigs =
      jsonPatch.deepClone(runnerConfigs);

    if (
      patches.compatibility.spectral &&
      canPatch(patches.compatibility.spectral.canPatch, config)
    ) {
      updatedRunnerConfigs.spectralYml = patchConfig(
        runnerConfigs.spectralYml,
        patches.compatibility.spectral.patch(runnerConfigs.spectralYml)
      );
    } else {
      updatedRunnerConfigs.compatibility.spectral = false;
    }

    if (
      patches.compatibility.optic &&
      canPatch(patches.compatibility.optic.canPatch, config)
    ) {
      updatedRunnerConfigs.opticYml = patchConfig(
        runnerConfigs.opticYml,
        patches.compatibility.optic.patch(runnerConfigs.opticYml)
      );
    } else {
      updatedRunnerConfigs.compatibility.optic = false;
    }

    return updatedRunnerConfigs;
  } else {
    return runnerConfigs;
  }
}

function getConfig(
  plugin: StandardDefinition<any>,
  globalConfig: Record<string, object>
) {
  const config = globalConfig[plugin.slug];
  const validate = plugin.isConfigValid(config);

  if (validate === true) {
    return config;
  } else {
    throw new Error(`${plugin.slug} config is not valid ${validate.join(',')}`);
  }
}

function canPatch(canPatch: boolean | ((config: any) => boolean), config: any) {
  if (typeof canPatch === 'boolean') return canPatch;
  return canPatch(config);
}

function patchConfig<YamlFormat extends OpticYml | RulesetDefinition>(
  configYaml: YamlFormat,
  patch: Patch<YamlFormat>
): YamlFormat {
  if ('errors' in patch) {
    throw new Error(patch.errors.join(', '));
  } else if ('updated' in patch) {
    return jsonPatch.deepClone(configYaml);
  } else if ('patch' in patch) {
    patch.patch;
    return jsonPatch.applyPatch(jsonPatch.deepClone(configYaml), patch.patch)
      .newDocument as unknown as YamlFormat;
  }
}
