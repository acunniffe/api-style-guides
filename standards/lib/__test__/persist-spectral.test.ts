import { it, describe } from '@jest/globals';
import { CloudPersist, LocalPersist } from '../persist-spectral-yaml';

describe('development', () => {
  const localPersist = new LocalPersist();
  it('persist local', async () => {
    const hash = await localPersist.persist('test', {
      extends: [],
    });

    expect(await localPersist.lookup(hash.configHash)).toMatchInlineSnapshot(`
      Object {
        "extends": Array [],
      }
    `);
  });
});

// describe('production', () => {
//   const localPersist = new CloudPersist('');
//   it('persist cloud', async () => {
//     const hash = await localPersist.persist('test', {
//       extends: ['ABC'],
//     });
//
//     expect(await localPersist.lookup(hash.configHash)).toMatchInlineSnapshot(`
//       Object {
//         "extends": Array [],
//       }
//     `);
//   });
// });
