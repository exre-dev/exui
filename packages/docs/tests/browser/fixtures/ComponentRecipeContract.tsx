import * as React from "react"
import { ActionButton, Badge, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, SelectContent, SelectField, SelectGroup, SelectItem, SelectTrigger, SelectValue, Sidebar, SidebarContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, Tabs, TabsList, TabsTrigger } from "@exre/exui"
import { CheckIcon, LayersIcon, SettingsIcon } from "lucide-react"
import { useT } from "../../../src/showcase/translations"
export function ComponentRecipeContract() {
  const t = useT()
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <ShowcaseSection
      id="recipes"
      title={t("Component recipe contract")}
      description={t("Deterministic reference states generated from the public component recipes.")}
    >
      <div data-testid="recipe-contract" className="grid gap-4">
        <PreviewPanel title={t("Button sizes and variants")}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button data-testid="recipe-button-small" size="sm"><LayersIcon />{t("Small")}</Button>
              <Button data-testid="recipe-button-default"><LayersIcon />{t("Default")}</Button>
              <Button data-testid="recipe-button-large" size="lg"><LayersIcon />{t("Large")}</Button>
              <Button data-testid="recipe-button-icon" size="icon" aria-label={t("Icon recipe")}><SettingsIcon /></Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button data-testid="recipe-primary">{t("Primary")}</Button>
              <Button data-testid="recipe-button-secondary" variant="secondary">{t("Secondary")}</Button>
              <Button data-testid="recipe-button-ghost" variant="ghost">{t("Ghost")}</Button>
              <Button data-testid="recipe-button-danger" variant="danger">{t("Danger")}</Button>
              <Button data-testid="recipe-button-disabled" disabled>{t("Disabled")}</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton data-testid="recipe-action-button-default">{t("Action")}</ActionButton>
              <ActionButton data-testid="recipe-action-button-secondary" variant="secondary">{t("Secondary action")}</ActionButton>
              <ActionButton data-testid="recipe-action-button-danger" variant="danger">{t("Danger action")}</ActionButton>
              <ActionButton data-testid="recipe-action-button-small" size="sm">{t("Small action")}</ActionButton>
              <ActionButton data-testid="recipe-action-button-large" size="lg">{t("Large action")}</ActionButton>
            </div>
          </div>
        </PreviewPanel>

        <PreviewPanel title={t("Form Control states")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input data-testid="recipe-input-default" aria-label={t("Default name")} placeholder={t("Default")} />
            <Input data-testid="recipe-input-focus" aria-label={t("Focused name")} defaultValue={t("Focused")} />
            <Input data-testid="recipe-input-invalid" aria-label={t("Invalid name")} aria-invalid="true" defaultValue={t("Invalid")} />
            <Input data-testid="recipe-input-disabled" aria-label={t("Disabled name")} disabled defaultValue={t("Disabled")} />
            <SelectField>
              <SelectTrigger data-testid="recipe-select-trigger" aria-label={t("Recipe select")}>
                <SelectValue placeholder={t("Select an option")} />
              </SelectTrigger>
              <SelectContent data-testid="recipe-select-content">
                <SelectGroup>
                  <SelectItem data-testid="recipe-select-first" value="first">{t("First option")}</SelectItem>
                  <SelectItem data-testid="recipe-select-second" value="second">{t("Second option")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </SelectField>
          </div>
        </PreviewPanel>

        <PreviewPanel title={t("Sidebar Item states")}>
          <SidebarProvider className="min-h-0">
            <Sidebar collapsible="none" className="h-auto w-full">
              <SidebarContent className="p-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton data-testid="recipe-sidebar-default">
                      <LayersIcon />
                      <span>{t("Default destination")}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton data-testid="recipe-sidebar-active" isActive>
                      <CheckIcon />
                      <span>{t("Active destination")}</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton data-testid="recipe-sidebar-nested" href="#recipes">{t("Nested destination")}</SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton data-testid="recipe-sidebar-disabled" disabled>
                      <SettingsIcon />
                      <span>{t("Disabled destination")}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="group" data-collapsible="icon">
                    <SidebarMenuButton data-testid="recipe-sidebar-icon-only" aria-label={t("Icon-only destination")}>
                      <SettingsIcon />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
        </PreviewPanel>

        <PreviewPanel title={t("Menu surface and items")}>
          <div
            data-testid="recipe-menu-surface"
            className="grid max-w-sm"
            style={{
              padding: "var(--exui-component-menu-surface-padding)",
              borderRadius: "var(--exui-component-menu-surface-radius)",
              background: "var(--exui-component-menu-surface-background)",
              color: "var(--exui-component-menu-surface-foreground)",
              border: "1px solid var(--exui-component-menu-surface-border)",
              boxShadow: "var(--exui-component-menu-surface-shadow)",
            }}
          >
            <div className="rounded-[var(--exui-component-menu-item-radius)] px-[var(--exui-component-menu-item-padding-inline)] py-[var(--exui-component-menu-item-padding-block)]">{t("Standard item")}</div>
            <div className="flex items-center gap-[var(--exui-component-menu-item-gap)] rounded-[var(--exui-component-menu-item-radius)] px-[var(--exui-component-menu-item-padding-inline)] py-[var(--exui-component-menu-item-padding-block)]">
              <CheckIcon className="size-4" />{t("Checked item")}</div>
            <div className="rounded-[var(--exui-component-menu-item-radius)] px-[var(--exui-component-menu-item-padding-inline)] py-[var(--exui-component-menu-item-padding-block)] [color:var(--exui-component-menu-item-destructive-foreground)]">{t("Destructive item")}</div>
          </div>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="mt-3" variant="outline">{t("Test real menu")}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent data-testid="recipe-menu-content" align="start">
              <DropdownMenuItem data-testid="recipe-menu-item">{t("Standard item")}</DropdownMenuItem>
              <DropdownMenuCheckboxItem data-testid="recipe-menu-checked" checked>{t("Checked item")}</DropdownMenuCheckboxItem>
              <DropdownMenuItem data-testid="recipe-menu-destructive" variant="destructive">{t("Destructive item")}</DropdownMenuItem>
              <DropdownMenuItem data-testid="recipe-menu-disabled" disabled>{t("Disabled item")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewPanel>

        <PreviewPanel title={t("Dialog surface")}>
          <Dialog>
          <div
            data-testid="recipe-dialog-surface"
            className="grid max-w-md"
            style={{
              gap: "var(--exui-component-dialog-surface-gap)",
              padding: "var(--exui-component-dialog-surface-padding)",
              borderRadius: "var(--exui-component-dialog-surface-radius)",
              background: "var(--exui-component-dialog-surface-background)",
              color: "var(--exui-component-dialog-surface-foreground)",
              border: "1px solid var(--exui-component-dialog-surface-border)",
              boxShadow: "var(--exui-component-dialog-surface-shadow)",
            }}
          >
            <DialogHeader>
              <DialogTitle>{t("Recipe preview")}</DialogTitle>
              <DialogDescription>{t("A deterministic dialog surface using the public contract.")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">{t("Cancel")}</Button>
              <Button>{t("Confirm")}</Button>
            </DialogFooter>
          </div>
            <DialogTrigger asChild>
              <Button data-testid="recipe-dialog-trigger" className="mt-3" variant="outline">{t("Test real dialog")}</Button>
            </DialogTrigger>
            <DialogContent data-testid="recipe-dialog-content" closeLabel={t("Close")}>
              <DialogHeader>
                <DialogTitle data-testid="recipe-dialog-title">{t("Recipe contract dialog")}</DialogTitle>
                <DialogDescription data-testid="recipe-dialog-description">{t("This dialog verifies the real portal and focus behavior.")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>{t("Confirm")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PreviewPanel>

        <PreviewPanel title={t("Tabs variants")}>
          <div data-testid="recipe-tabs" className="grid gap-4">
            <Tabs defaultValue="overview">
              <TabsList data-testid="recipe-tabs-default-list">
                <TabsTrigger data-testid="recipe-tab-default-overview" value="overview">{t("Overview")}</TabsTrigger>
                <TabsTrigger data-testid="recipe-tab-default-details" value="details">{t("Details")}</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="overview">
              <TabsList data-testid="recipe-tabs-line-list" variant="line">
                <TabsTrigger data-testid="recipe-tab-line-overview" value="overview">{t("Overview")}</TabsTrigger>
                <TabsTrigger data-testid="recipe-tab-line-details" value="details">{t("Details")}</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs defaultValue="overview">
              <TabsList data-testid="recipe-tabs-primary-list" variant="primary">
                <TabsTrigger data-testid="recipe-tab-primary-overview" value="overview">{t("Overview")}</TabsTrigger>
                <TabsTrigger data-testid="recipe-tab-primary-details" value="details">{t("Details")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </PreviewPanel>
      </div>
    </ShowcaseSection>
  )
}

function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}

function PreviewPanel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const t = useT()
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium">{title}</h3>
        <Badge variant="outline">{t("Core")}</Badge>
      </div>
      {children}
    </div>
  )
}
