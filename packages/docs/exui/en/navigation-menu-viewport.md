### NavigationMenu viewport width

The default `NavigationMenuViewport` follows its measured content width on desktop and uses full width below the `md` breakpoint. Menu options remain visible and clickable when application Tailwind utilities load after ExUI CSS. Use the default viewport without a manual width override for ordinary menus.

Keep the default responsive width of `NavigationMenuContent` as well. An unconditional `w-full` on the content or viewport can constrain desktop measurement and clip the menu links.
