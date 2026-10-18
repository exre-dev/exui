// Private stable image lookup for this family only.
const assets: Readonly<Record<string,string>> = {
  "https://picsum.photos/1000/800?grayscale&random=1": "/examples/reui/photos/b7c3c9f06c82916658.jpg",
  "https://picsum.photos/1000/800?grayscale&random=2": "/examples/reui/photos/afb744cd7d1af1b5c6.jpg",
  "https://picsum.photos/1000/800?grayscale&random=3": "/examples/reui/photos/2f95edd007f2710283.jpg",
  "https://picsum.photos/1000/800?grayscale&random=4": "/examples/reui/photos/d00a8e2f9bec60abb1.jpg",
  "https://picsum.photos/1000/800?grayscale&random=5": "/examples/reui/photos/e18fa64c931e89f480.jpg",
  "https://picsum.photos/1000/800?grayscale&random=6": "/examples/reui/photos/c27612d0e011078f3a.jpg",
  "https://picsum.photos/1000/800?grayscale&random=7": "/examples/reui/photos/e143a8adf2e1915a25.jpg",
  "https://picsum.photos/1000/800?grayscale&random=8": "/examples/reui/photos/355afce7afc66d079f.jpg"
}
export default function exampleAsset(source:string):string { const local = assets[source]; if (!local) throw new Error(`Missing archived demo image: ${source}`); return local }
