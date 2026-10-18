// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg",
  "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/4349381d8a8476edbc.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
