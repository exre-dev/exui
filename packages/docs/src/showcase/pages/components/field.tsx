import { examples } from "../../examples/field/index.generated"
import { extensions } from "../../examples/field/exui-extensions"
import { ExampleGallery } from "../../ExampleGallery"

export default function Page() { return <ExampleGallery examples={examples} extensions={extensions} /> }
