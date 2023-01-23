import fsP from 'node:fs/promises';
import path from 'node:path';
import { RulesetDefinition } from '@stoplight/spectral-core';
import hash from 'node-object-hash';
import { ConfigAddressableSpectralRulesetDefinition } from './standard-definition';
const hasher = hash();
import { Collection, MongoClient } from 'mongodb';
import fs from 'fs';

export const localHashDir = path.resolve(process.cwd(), '.hashed-spectral');

export interface PersistSpectralYaml {
  persist(
    slug: string,
    content: RulesetDefinition,
    hostname?: string
  ): Promise<ConfigAddressableSpectralRulesetDefinition>;
  lookup(contentHash: string): Promise<RulesetDefinition | null>;
}

export class LocalPersist implements PersistSpectralYaml {
  constructor() {
    if (!fs.existsSync(localHashDir)) {
      fs.mkdirSync(localHashDir);
    }
  }
  async lookup(contentHash: string): Promise<RulesetDefinition | null> {
    try {
      const contents = (
        await fsP.readFile(path.join(localHashDir, contentHash))
      ).toString();
      return JSON.parse(contents) as unknown as RulesetDefinition;
    } catch (e) {
      return null;
    }
  }

  async persist(
    slug: string,
    content: RulesetDefinition,
    hostname: string = 'https://example.com'
  ): Promise<ConfigAddressableSpectralRulesetDefinition> {
    const name = hasher.hash(content).substring(0, 7);
    await fsP.writeFile(
      path.join(localHashDir, name),
      JSON.stringify(content, null, 2)
    );

    const url = new URL(hostname)
    url.pathname = `/api/${slug}/${name}`;

    return {
      url: url.toString(),
      contents: content,
      configHash: name,
    };
  }
}

export class CloudPersist implements PersistSpectralYaml {
  private configCollection: Collection<{ hash: string; value: any }>;

  constructor(password = process.env.MONGO_PASSWORD) {
    const uri = `mongodb+srv://backend:${password}@cluster0.yynrerb.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    this.configCollection = client
      .db('configs')
      .collection<{ hash: string; value: any }>('config');
  }
  async lookup(contentHash: string): Promise<RulesetDefinition | null> {
    try {
      const lookup = await this.configCollection.findOne({ hash: contentHash });
      return lookup.value;
    } catch (e) {
      return null;
    }
  }

  async persist(
    slug: string,
    content: RulesetDefinition,
    hostname: string
  ): Promise<ConfigAddressableSpectralRulesetDefinition> {
    const hash = hasher.hash(content).substring(0, 7);

    try {
      await this.configCollection.insertOne({
        hash,
        value: content,
      });
    } catch (e) {
      if (!e.message.startsWith('E11000 duplicate key')) {
        throw new Error(e);
      } else {
        console.error(e);
      }
    }
    const url = new URL(hostname);
    url.pathname = `/api/${slug}/${hash}`;

    return {
      url: url.toString(),
      contents: content,
      configHash: hash,
    };
  }
}

//check prod
export const PersistedSpectralYaml: PersistSpectralYaml =
  process.env.NODE_ENV === 'production'
    ? new CloudPersist()
    : new LocalPersist();
