import { it } from '@jest/globals';
import { configToPatches } from '../config-to-patches';

import { LocalPersist } from '../persist-spectral-yaml';
import BreakingChanges from '../../breaking-changes';
import UrlStyleGuide from '../../url-style-guides';

it('can create an optic.yml patch', async () => {
  const patches = await configToPatches(BreakingChanges, {
    [BreakingChanges.slug]: {
      exclude_operations_with_extension: 'x-draft',
    },
  });
  expect(patches).toMatchInlineSnapshot(`
    Object {
      "compatibility": Object {
        "optic": true,
        "spectral": false,
      },
      "opticYml": Object {
        "rulesets": Object {
          "breaking-changes": Object {
            "exclude_operations_with_extension": "x-draft",
          },
        },
      },
      "spectralYml": Object {
        "extends": Array [],
      },
    }
  `);
});
it('can create a spectral yml patch', async () => {
  const patches = await configToPatches(UrlStyleGuide, {
    [UrlStyleGuide.slug]: {
      'resource-names-plural': false,
    },
  });

  const lookup = await new LocalPersist().lookup(
    // @ts-ignore
    patches.spectralYml.extends[0]
  );
  expect(lookup).toMatchSnapshot();

  // this is wrong
  expect(patches).toMatchInlineSnapshot(`
    Object {
      "compatibility": Object {
        "optic": true,
        "spectral": true,
      },
      "opticYml": Object {
        "rulesets": Object {
          "spectral": Object {
            "added": Array [],
            "always": Array [
              "145a2f5",
            ],
          },
        },
      },
      "spectralYml": Object {
        "extends": Array [
          "145a2f5",
        ],
      },
    }
  `);
});
