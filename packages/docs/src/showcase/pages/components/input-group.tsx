import { examples } from "../../examples/input-group/index.generated"
import { ExampleGallery } from "../../ExampleGallery"
import { extensions } from "../../examples/input-group/exui-extensions"

export default function Page() { return <ExampleGallery examples={examples} extensions={extensions} /> }
