import { StandardDefinition } from './lib/standard-definition';
import fastJsonPatch from 'fast-json-patch';

type Config = {
  applies: 'added' | 'always';
  'server-lowercase': boolean;
  'server-has-api': boolean;
  'path-casing': boolean;
  'resource-names-plural': boolean;
  'paths-no-trailing-slash': boolean;
  'paths-no-file-extensions': boolean;
  'paths-no-http-verbs': boolean;
  'paths-avoid-special-characters': boolean;
  'paths-no-query-params': boolean;
  'path-parameters-snake-case': boolean;
  'query-parameters-snake-case': boolean;
  'path-parameters-on-path-only': boolean;
};

const UrlStyleGuide: StandardDefinition<Config> = {
  slug: 'url-style-guides',
  githubAuthor: 'stoplight',
  defaultConfiguration: {
    applies: 'added',
    'server-lowercase': true,
    'server-has-api': true,
    'path-casing': true,
    'resource-names-plural': true,
    'paths-no-trailing-slash': true,
    'paths-no-file-extensions': true,
    'paths-no-http-verbs': true,
    'paths-avoid-special-characters': true,
    'paths-no-query-params': true,
    'path-parameters-snake-case': true,
    'query-parameters-snake-case': true,
    'path-parameters-on-path-only': true,
  },
  isConfigValid: (config) => {
    return true;
  },
  generateSpectralRuleset: (config) => {
    const falseKeys: string[] = Object.entries(config)
      .filter((i) => !i[1] && i[0] !== 'applies')
      .map((i) => i[0]);

    const cloned = fastJsonPatch.deepClone(SpectralUrlStyleGuides);

    falseKeys.forEach((key) => {
      delete cloned.rules[key];
    });

    return cloned;
  },
  toRulesetPatches: (config: Config, generatedSpectralRuleset) => {
    return {
      compatibility: {
        spectral: {
          canPatch: true,
          patch: (spectralYml) => {
            if ('extends' in spectralYml) {
              return {
                patch: [
                  {
                    op: 'add',
                    path: '/extends/-',
                    value: generatedSpectralRuleset.url,
                  },
                ],
              };
            } else {
              return {
                patch: [
                  {
                    op: 'add',
                    path: '/extends',
                    value: [generatedSpectralRuleset.url],
                  },
                ],
              };
            }
          },
        },
        optic: {
          canPatch: true,
          patch: (opticYml) => {
            const applies = config.applies ?? 'always';
            const existingSpectral = opticYml.ruleset.find((i) =>
              i.hasOwnProperty('spectral')
            );
            if (existingSpectral && applies in existingSpectral) {
              existingSpectral.spectral[applies].push(
                generatedSpectralRuleset.url
              );
            } else if (!existingSpectral) {
              opticYml.ruleset = [
                ...opticYml.ruleset,
                {
                  spectral: {
                    added:
                      applies === 'added' ? [generatedSpectralRuleset.url] : [],
                    always:
                      applies === 'always'
                        ? [generatedSpectralRuleset.url]
                        : [],
                  },
                },
              ];
            }

            return { updated: opticYml };
          },
        },
      },
    };
  },
};

export const SpectralUrlStyleGuides = Object.freeze({
  formats: ['oas2', 'oas3', 'oas3.0', 'oas3.1'],
  aliases: {
    Request_Parameter_Query: {
      description: '',
      targets: [
        {
          formats: ['oas3'],
          given: [
            "$.paths[*].parameters[?(@.in == 'query')].name",
            "$.paths[*][*].parameters[?(@.in == 'query')].name",
            "$.components.parameters[?(@.in == 'query')].name",
          ],
        },
        {
          formats: ['oas2'],
          given: [
            "$.paths[*].parameters[?(@.in == 'query')].name",
            "$.paths[*][*].parameters[?(@.in == 'query')].name",
            "$.components.parameters[?(@.in == 'query')].name",
          ],
        },
      ],
    },
    Request_Parameter_Path: {
      description: '',
      targets: [
        {
          formats: ['oas3'],
          given: [
            "$.paths[*].parameters[?(@.in == 'path')].name",
            "$.paths[*][*].parameters[?(@.in == 'path')].name",
            "$.components.parameters[?(@.in == 'path')].name",
          ],
        },
        {
          formats: ['oas2'],
          given: [
            "$.paths[*].parameters[?(@.in == 'path')].name",
            "$.paths[*][*].parameters[?(@.in == 'path')].name",
            "$.components.parameters[?(@.in == 'path')].name",
          ],
        },
      ],
    },
  },
  rules: {
    'server-lowercase': {
      given: ['$.servers[*].url'],
      severity: 'error',
      then: {
        function: 'pattern',
        functionOptions: {
          match: '^[^A-Z]*$',
        },
      },
      description:
        'Server URLs must be lowercase. This standard helps meet industry best practices.\n\n**Invalid Example**\n\nThe `name` property on line 8 (`user-Id`) must be separated by an underscore character and the `I` must be lowercase.\n\n```json\n{\n    "servers": [\n      {\n        "url": "https://ACME.com/api"\n      }\n    ]\n}\n```\n\n**Valid Example**\n\n```json\n{\n    "servers": [\n      {\n        "url": "https://acme.com/api"\n      }\n    ]\n}\n```',
      message: 'Server URL must be lowercase',
      formats: ['oas3'],
    },
    'server-has-api': {
      given: ['$.servers[*].url'],
      severity: 'info',
      then: {
        function: 'pattern',
        functionOptions: {
          match: '^.*\\/api/?.*',
        },
      },
      description: 'Server must have /api',
      message: 'Server must have /api in it',
      formats: ['oas3'],
    },
    'path-casing': {
      given: ['$.paths'],
      severity: 'error',
      then: {
        function: 'pattern',
        functionOptions: {
          match:
            '^\\/([a-z0-9]+(-[a-z0-9]+)*)?(\\/[a-z0-9]+(-[a-z0-9]+)*|\\/{.+})*$',
        },
        field: '@key',
      },
      description:
        'Paths must be `kebab-case`, with hyphens separating words.\n\n**Invalid Example**\n\n`userInfo` must be separated with a hyphen.\n\n```json\n{\n    "/userInfo": {\n        "post: }\n       ....\n}\n``` \n\n**Valid Example**\n\n```json\n{\n    "/user-info": {\n       "post: }\n       ....\n}\n```',
      message: 'Paths must be kebab-case',
    },
    'resource-names-plural': {
      given: ['$.paths'],
      severity: 'warn',
      then: {
        function: 'pattern',
        functionOptions: {
          match: '^((\\/v\\d+)*((\\/[\\w+-]*s)(\\/\\{.*\\})*)*)$',
        },
        field: '@key',
      },
      description:
        'Resource names should generally be plural. \n\n**Invalid Example**\n\n```json\n{\n    "paths": {\n      "/user": \n    }\n  }\n```\n\n**Valid Example**\n\n```json\n{\n    "paths": {\n      "/users": \n    }\n}\n```',
      message: 'Resource names should generally be plural',
    },
    'paths-no-trailing-slash': {
      given: ['$.paths'],
      severity: 'error',
      then: {
        function: 'pattern',
        functionOptions: {
          notMatch: '\\/$',
        },
        field: '@key',
      },
      description:
        'Paths must not end with a trailing slash. \n\n`/users` and `/users/` are separate paths. It\'s considered bad practice for them to differ based only on a trailing slash. It\'s usually preferred to not have a trailing slash.\n\n**Invalid Example**\n\nThe `users` path ends with a slash. \n\n```json\n{\n    "/users/": {\n       "post: }\n       ....\n}\n``` \n\n**Valid Example**\n\n```json\n{\n    "/user": {\n       "post: }\n       ....\n}\n```',
      message: 'Paths must not end with a trailing slash',
    },
    'paths-no-file-extensions': {
      given: ['$.paths'],
      severity: 'error',
      then: {
        function: 'pattern',
        functionOptions: {
          notMatch: '\\b(JSON|json|XML|xml)\\b',
        },
        field: '@key',
      },
      description:
        'Paths must not include `json` or `xml` file extensions.\n\n**Invalid Example**\n\nThe path contains a `.json` extension. \n\n```json\n{\n    "/user.json": {\n       "post: }\n       ....\n}\n``` \n\n**Valid Example**\n\n```json\n{\n    "/user": {\n       "post: }\n       ....\n}\n```',
      message: 'Paths must not have file extensions',
    },
    'paths-no-http-verbs': {
      given: ['$.paths'],
      severity: 'error',
      then: {
        function: 'pattern',
        functionOptions: {
          notMatch:
            '\\b(GET|PUT|POST|DELETE|LIST|CREATE|REMOVE|get|put|post|delete|list|create|remove|Get|Put|Post|Delete|List|Create|Remove)\\b',
        },
        field: '@key',
      },
      description:
        'Verbs such as `get`, `delete`, and `put` must not be included in paths because this information is conveyed by the HTTP method.\n\n**Invalid Example**\n\nThe path contains the verb `get`. \n\n```json\n{\n    "/getUsers": {\n       "post: }\n       ....\n}\n``` \n\n**Valid Example**\n\n```json\n{\n    "/user": {\n       "post: }\n       ....\n}\n```',
      message: 'Paths must not have HTTP verbs in them',
    },
    'paths-avoid-special-characters': {
      given: ['$.paths'],
      severity: 'warn',
      then: {
        function: 'pattern',
        functionOptions: {
          notMatch: '^(.*)([\\$&+,;=?@%]+)(.*)$',
          match: '',
        },
        field: '@key',
      },
      description:
        'Paths should not contain special characters, such as `$` `&` `+` `,` `;` `=` `?` and `@%`.\n\n**Invalid Example**\n\nThe path contains an ampersand. \n\n```json\n{\n    "/user&info": {\n       "post: }\n       ....\n}\n``` \n\n**Valid Example**\n\n```json\n{\n    "/user": {\n       "post: }\n       ....\n}\n```',
      message: 'Avoid using special characters in paths',
    },
    'paths-no-query-params': {
      given: ['$.paths'],
      severity: 'warn',
      then: {
        function: 'pattern',
        functionOptions: {
          notMatch: '\\?',
        },
        field: '@key',
      },
      description:
        'Paths should not have query parameters in them. They should be defined separately in the OpenAPI.\n\n**Invalid Example**\n\n```json\n{\n "/users/{?id}": {\n\n```\n\n**Valid Example**\n\n```json lineNumbers\n{\n    "parameters": [\n        {\n            "schema": {\n                "type": "string"\n            },\n            "name": "id",\n            "in": "path",\n            "required": true,\n            "description": "User\'s ID"\n        }\n    ]\n}\n\n```',
      message:
        'Paths should not have query parameters in them. They should be defined separately in the OpenAPI.',
    },
    'path-parameters-snake-case': {
      given: ['#Request_Parameter_Path'],
      severity: 'error',
      then: {
        function: 'casing',
        functionOptions: {
          type: 'snake',
          disallowDigits: true,
        },
        field: 'name',
      },
      description:
        'Path parameters must be `snake_case`, with each word separated by an underscore character and the first letter of each word lowercase. Also, the path parameter must not contain digits.\n\n**Invalid Example**\n\nThe `name` property on line 9 (`userId`) must be separated by an underscore character and the `I` must be lowercase.\n\n```json lineNumbers\n{\n    "paths": {\n      "/users/{userId}": {\n        "parameters": [\n          {\n            "schema": {\n              "type": "integer"\n            },\n            "name": "userId",\n            "in": "path"\n          }\n        ]\n      }\n    }\n  }\n```\n\n**Valid Example**\n\n```json lineNumbers\n{\n    "paths": {\n      "/users/{userId}": {\n        "parameters": [\n          {\n            "schema": {\n              "type": "integer"\n            },\n            "name": "user_id",\n            "in": "path"\n          }\n        ]\n      }\n    }\n  }\n```',
      message: 'Path parameters must be snake_case and must not contain digits',
    },
    'query-parameters-snake-case': {
      given: ['#Request_Parameter_Query'],
      severity: 'error',
      then: {
        function: 'casing',
        functionOptions: {
          type: 'snake',
          disallowDigits: true,
        },
      },
      description:
        'Query parameters must be `snake_case`, with each word separated by an underscore character and the first letter of each word lowercase. Also, the query parameter must not contain digits.\n\n**Invalid Example**\n\nThe `name` property on line 8 (`user-Id`) must be separated by an underscore character and the `I` must be lowercase.\n\n```json lineNumbers\n{\n   "parameters": [\n     {\n       "schema": {\n         "type": "string"\n       },\n       "in": "query",\n       "name": "user-Id"\n     }\n   ]\n}\n```\n\n**Valid Example**\n\n```json lineNumbers\n{\n    "parameters": [\n      {\n        "schema": {\n          "type": "string"\n        },\n        "in": "query",\n        "name": "user_id"\n      }\n    ]\n }\n```',
      message: 'Query parameters should be snake_case and not contain digits',
    },
    'path-parameters-on-path-only': {
      given: ["$.paths[*][*].parameters[?(@.in == 'path')]"],
      severity: 'warn',
      then: {
        function: 'falsy',
      },
      description:
        'Path parameters should be defined on the path level instead of the operation level.\n\n**Invalid Example**\n\nThe `user_id` path parameter on line 8 should not be included with the `patch\' operation.\n\n```json lineNumbers\n{      \n  "patch": {\n      "parameters": [\n        {\n          "schema": {\n          "type": "integer"\n         },\n        "name": "user_id",\n        "in": "path"\n      }\n    ]\n  }\n}\n```\n\n**Valid Example**\n\nThe `user-id` path parameter is correctly located at the path level.\n\n```json lineNumbers\n\n{  \n    "paths": {\n       "/users/{userId}": {\n         "parameters": [\n           {\n             "schema": {\n               "type": "integer"\n           },\n             "name": "user_id",\n             "in": "path"\n           }\n       ]\n     }\n   }\n }\n```',
      message:
        'Path parameters should be defined on the path level instead of the operation level.',
    },
  },
  functionsDir: 'functions',
});

export default UrlStyleGuide;
