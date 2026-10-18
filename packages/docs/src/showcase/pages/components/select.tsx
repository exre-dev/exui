import { examples } from "../../examples/select/index.generated"
import { ExampleGallery } from "../../ExampleGallery"
import { extensions } from "../../examples/select/exui-extensions"

export default function Page() { return <ExampleGallery examples={examples} extensions={extensions} /> }
