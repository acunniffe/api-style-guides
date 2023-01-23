import {StandardDefinition} from "./lib/standard-definition";

export const allStandards: Record<string, StandardDefinition<any>> =  {
  OAS_CORRECTNESS: require('./oas-correctness').default,
  OpticBreakingChanges: require('./breaking-changes').default,
  UrlStyleGuide: require('./url-style-guides').default,
  Naming: require('./naming').default,
}

