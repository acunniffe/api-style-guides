
const fs = require('fs')
const path = require('path')
const changeCase = require('change-case')
const slugify = require('slugify')
const rootDirectory = __dirname


const pluginSlug = slugify([...process.argv][2], {lower: true})
const CapCase = changeCase.constantCase(pluginSlug)

const pluginRegistry = path.join(rootDirectory, 'standards', `index.ts`)
const pluginFile = path.join(rootDirectory, 'standards', `${pluginSlug}.ts`)
const documentationFile = path.join(rootDirectory, 'pages', 'standards', `${pluginSlug}.mdx`)



const defaultPlugin = "import { StandardDefinition } from \"./lib/standard-definition\";\n" +
  "\n" +
  "type Config = {\n" +
  "};\n" +
  "\n" +
  "const "+CapCase+": StandardDefinition<Config> = {\n" +
  "  slug: \"" + pluginSlug +"\",\n" +
  "  githubAuthor: \"opticdev\",\n" +
  "  defaultConfiguration: {\n" +
  "  },\n" +
  "  isConfigValid: (config) => true,\n" +
  "  generateSpectralRuleset: (config) => {\n" +
  "    \n" +
  "  },\n" +
  "  toRulesetPatches: (config: Config, generatedSpectralRuleset) => {\n" +
  "    \n" +
  "  }\n" +
  "};\n" +
  "\n" +
  "export default "+CapCase+"\n"



const defaultDocsMarkdown = `
import ${CapCase} from '../../standards/${pluginSlug}'
import { Toggle, AlwaysAdded, TextInput, SelectInput } from '../../components';


# ${pluginSlug}

Documentation here!

<Toggle name={"${pluginSlug}"} standard={${CapCase}} description="description" />

... other config
`





function writeBoilerplateToDisk() {
  fs.writeFileSync(pluginFile, defaultPlugin.toString())
  console.log("Generated empty plugin to: "+ pluginFile)
  fs.writeFileSync(documentationFile, defaultDocsMarkdown)
  console.log("Generated empty plugin to: "+ documentationFile)

  const registryContents = fs.readFileSync(pluginRegistry).toString()
  const lines = registryContents.split('\n')
  const firstLineOfDef = lines.findIndex(i => i.includes('export const allStandards:'))

  lines.splice(firstLineOfDef+1, 0, `  ${CapCase}: require('./${pluginSlug}').default,`)

  fs.writeFileSync(pluginRegistry, lines.join('\n'))



}


writeBoilerplateToDisk()
