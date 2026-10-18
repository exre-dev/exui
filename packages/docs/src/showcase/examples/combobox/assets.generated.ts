// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/f1d4253436738aaf8f.jpg",
  "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/5785adb882eb815215.jpg",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/833451dbb99bcf927d.jpg",
  "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/db62bd4fecdc9df2e3.jpg",
  "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/b2bda5d4122155a038.jpg",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c6064767ae24420606.jpg",
  "https://images.unsplash.com/photo-1506795660185-2f0c6a1c7f6c?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/833451dbb99bcf927d.jpg",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/efb8484410f45934d5.jpg",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/36d650ee9968995d8e.jpg",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/df73db9a2c25069a42.jpg",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/ccbc5e77aa9f9a4b17.jpg",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/e93553df2422635515.jpg",
  "https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/a3afee2f77d259ce6a.jpg",
  "https://images.unsplash.com/photo-1543299750-19d1d6297053?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/c75592a667f30cfd44.jpg",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/7da2efac125ddc6e00.jpg",
  "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/4349381d8a8476edbc.jpg",
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/973d47055c51440af7.jpg",
  "https://images.unsplash.com/photo-1620075225255-8c2051b6c015?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/067c566cd567259bb9.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
