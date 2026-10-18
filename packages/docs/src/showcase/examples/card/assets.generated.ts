// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://github.com/shadcn.png": "/examples/reui/photos/0a10b9bc070f3bdf60.jpg",
  "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/df73db9a2c25069a42.jpg",
  "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80": "/examples/reui/photos/4349381d8a8476edbc.jpg",
  "https://picsum.photos/1000/800?grayscale&random=18": "/examples/reui/photos/ef0dd68937b330fd5d.jpg",
  "https://picsum.photos/1000/800?grayscale&random=52": "/examples/reui/photos/b95555a5234cc46caa.jpg",
  "https://picsum.photos/1000/800?grayscale&random=62": "/examples/reui/photos/9f4ac34c03d6835b1d.jpg",
  "https://picsum.photos/1000/800?grayscale&random=76": "/examples/reui/photos/d67c379524f2607a3b.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
