import { catalogPages } from "./catalog"
import { navigationGroup } from "../../lib/site-contract.mjs"
export const presentationPages = catalogPages.map(page => ({ ...page, navigationGroup: navigationGroup(page) }))
