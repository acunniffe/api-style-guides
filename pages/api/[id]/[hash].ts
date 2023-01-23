import { allStandards } from '../../../standards';
import { PersistedSpectralYaml } from '../../../standards/lib/persist-spectral-yaml';

const registeredStandards = new Set(
  Object.values(allStandards).map((i) => i.slug)
);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=1086400');

  const { id, hash } = req.query;
  if (registeredStandards.has(id)) {
    const result = await PersistedSpectralYaml.lookup(hash);
    if (result) {
      res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .send(JSON.stringify(result, null, 2));
    } else {
      res
        .status(404)
        .json({ error: `Standard '${id}' config for ${hash} not found` });
    }
  } else {
    res.status(404).json({ error: `Standard '${id}' not found` });
  }
}
