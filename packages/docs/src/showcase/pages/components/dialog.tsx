import { examples } from "../../examples/dialog/index.generated"
import { ExampleGallery } from "../../ExampleGallery"
import { extensions } from "../../examples/dialog/exui-extensions"

export default function Page() { return <ExampleGallery examples={examples} extensions={extensions} /> }
