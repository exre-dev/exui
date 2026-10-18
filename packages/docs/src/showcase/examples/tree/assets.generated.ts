// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/833451dbb99bcf927d.jpg",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c6064767ae24420606.jpg",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/2bc0a75442d5cf52e4.jpg",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/99f5b111c8dfb9bdaa.jpg",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/240c6b87e9fc32d076.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/7da2efac125ddc6e00.jpg",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/1d09296b721df419b9.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
