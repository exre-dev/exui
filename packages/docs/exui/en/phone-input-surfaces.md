### ExUI phone input appearance

`PhoneInput` keeps its country button and number field at the same height. Use `variant="sm"`, `"default"` or `"lg"`; `size` remains the native input attribute. At a 16px root, small is 32px, large is 40px, and default follows density: 36px in standard density and 32px in compact density. Heights scale with the root font size.

Both halves use the form-control background tokens. The country search renders the standard `Input`, retaining its rounded border, inset spacing and focus appearance while the combobox handles filtering, keyboard navigation and selection. All eight existing examples share this appearance.
