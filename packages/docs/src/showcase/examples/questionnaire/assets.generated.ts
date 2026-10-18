// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
