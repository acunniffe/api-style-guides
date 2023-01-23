import { allStandards } from '../index';
import * as jsonPatch from 'fast-json-patch';
import {
  configToPatches,
  defaultOpticYml,
  defaultSpectralYml,
  RunnerConfigs,
} from './config-to-patches';

import { stringify } from 'yaml';
export async function generate(
  config: Record<string, object>,
  hostname: string = 'https://example.com'
): Promise<
  RunnerConfigs & { opticYamlContents: string; spectralYamlContents: string }
> {
  const plugins = allStandards;

  let runnerConfig: RunnerConfigs = {
    compatibility: { optic: true, spectral: true },
    opticYml: jsonPatch.deepClone(defaultOpticYml),
    spectralYml: jsonPatch.deepClone(defaultSpectralYml),
  };

  const iterablePlugins = Object.entries(plugins);
  for await (const plugin of iterablePlugins) {
    const [key, definition] = plugin;
    runnerConfig = await configToPatches(
      definition,
      config,
      runnerConfig,
      hostname
    );
  }

  return {
    ...runnerConfig,
    opticYamlContents: stringify(runnerConfig.opticYml),
    spectralYamlContents: stringify(runnerConfig.spectralYml),
  };
}
