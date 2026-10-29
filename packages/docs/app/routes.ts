import { index, route, type RouteConfig } from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),
  route(":locale/docs/icons", "routes/icons.tsx"),
  route(":locale/docs/:group?", "routes/overview.tsx"),
  route(":locale/docs/*", "routes/docs.tsx"),
  route("examples/:id", "routes/example.tsx"),
  route("search/:locale/index.json", "routes/search.ts"),
  route("404", "routes/static-not-found.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig
