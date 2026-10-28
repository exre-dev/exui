import type { ComponentType } from "react"
import * as GlassIcons from "@exre/exui/icons/glass-icons"
import type { GlassIconProps } from "@exre/exui/icons/glass-icons"
import asset0 from "@exre/exui/icons/glass-icons/activity.svg"
import asset1 from "@exre/exui/icons/glass-icons/add.svg"
import asset2 from "@exre/exui/icons/glass-icons/arrow-02.svg"
import asset3 from "@exre/exui/icons/glass-icons/arrow.svg"
import asset4 from "@exre/exui/icons/glass-icons/bag-02.svg"
import asset5 from "@exre/exui/icons/glass-icons/bag.svg"
import asset6 from "@exre/exui/icons/glass-icons/bookmark.svg"
import asset7 from "@exre/exui/icons/glass-icons/buy.svg"
import asset8 from "@exre/exui/icons/glass-icons/calendar.svg"
import asset9 from "@exre/exui/icons/glass-icons/camera.svg"
import asset10 from "@exre/exui/icons/glass-icons/chart.svg"
import asset11 from "@exre/exui/icons/glass-icons/chat.svg"
import asset12 from "@exre/exui/icons/glass-icons/clock.svg"
import asset13 from "@exre/exui/icons/glass-icons/close.svg"
import asset14 from "@exre/exui/icons/glass-icons/danger.svg"
import asset15 from "@exre/exui/icons/glass-icons/discount.svg"
import asset16 from "@exre/exui/icons/glass-icons/discovery.svg"
import asset17 from "@exre/exui/icons/glass-icons/document.svg"
import asset18 from "@exre/exui/icons/glass-icons/edit.svg"
import asset19 from "@exre/exui/icons/glass-icons/filter.svg"
import asset20 from "@exre/exui/icons/glass-icons/folder.svg"
import asset21 from "@exre/exui/icons/glass-icons/gallery.svg"
import asset22 from "@exre/exui/icons/glass-icons/game.svg"
import asset23 from "@exre/exui/icons/glass-icons/graph.svg"
import asset24 from "@exre/exui/icons/glass-icons/heart.svg"
import asset25 from "@exre/exui/icons/glass-icons/home.svg"
import asset26 from "@exre/exui/icons/glass-icons/info-02.svg"
import asset27 from "@exre/exui/icons/glass-icons/info.svg"
import asset28 from "@exre/exui/icons/glass-icons/location.svg"
import asset29 from "@exre/exui/icons/glass-icons/lock-02.svg"
import asset30 from "@exre/exui/icons/glass-icons/lock.svg"
import asset31 from "@exre/exui/icons/glass-icons/menu-02.svg"
import asset32 from "@exre/exui/icons/glass-icons/menu.svg"
import asset33 from "@exre/exui/icons/glass-icons/message.svg"
import asset34 from "@exre/exui/icons/glass-icons/notification.svg"
import asset35 from "@exre/exui/icons/glass-icons/paper.svg"
import asset36 from "@exre/exui/icons/glass-icons/paper-plus.svg"
import asset37 from "@exre/exui/icons/glass-icons/play.svg"
import asset38 from "@exre/exui/icons/glass-icons/profile.svg"
import asset39 from "@exre/exui/icons/glass-icons/search.svg"
import asset40 from "@exre/exui/icons/glass-icons/send.svg"
import asset41 from "@exre/exui/icons/glass-icons/setting.svg"
import asset42 from "@exre/exui/icons/glass-icons/shield.svg"
import asset43 from "@exre/exui/icons/glass-icons/show.svg"
import asset44 from "@exre/exui/icons/glass-icons/star-02.svg"
import asset45 from "@exre/exui/icons/glass-icons/star.svg"
import asset46 from "@exre/exui/icons/glass-icons/tick.svg"
import asset47 from "@exre/exui/icons/glass-icons/video.svg"
import asset48 from "@exre/exui/icons/glass-icons/volume.svg"
import asset49 from "@exre/exui/icons/glass-icons/wallet.svg"

export type IconEntry = { name: string; slug: string; Component: ComponentType<GlassIconProps>; assetUrl: string }
export const iconCatalog: IconEntry[] = [
  { name: "ActivityIcon", slug: "activity", Component: GlassIcons.ActivityIcon, assetUrl: asset0 },
  { name: "AddIcon", slug: "add", Component: GlassIcons.AddIcon, assetUrl: asset1 },
  { name: "Arrow02Icon", slug: "arrow-02", Component: GlassIcons.Arrow02Icon, assetUrl: asset2 },
  { name: "ArrowIcon", slug: "arrow", Component: GlassIcons.ArrowIcon, assetUrl: asset3 },
  { name: "Bag02Icon", slug: "bag-02", Component: GlassIcons.Bag02Icon, assetUrl: asset4 },
  { name: "BagIcon", slug: "bag", Component: GlassIcons.BagIcon, assetUrl: asset5 },
  { name: "BookmarkIcon", slug: "bookmark", Component: GlassIcons.BookmarkIcon, assetUrl: asset6 },
  { name: "BuyIcon", slug: "buy", Component: GlassIcons.BuyIcon, assetUrl: asset7 },
  { name: "CalendarIcon", slug: "calendar", Component: GlassIcons.CalendarIcon, assetUrl: asset8 },
  { name: "CameraIcon", slug: "camera", Component: GlassIcons.CameraIcon, assetUrl: asset9 },
  { name: "ChartIcon", slug: "chart", Component: GlassIcons.ChartIcon, assetUrl: asset10 },
  { name: "ChatIcon", slug: "chat", Component: GlassIcons.ChatIcon, assetUrl: asset11 },
  { name: "ClockIcon", slug: "clock", Component: GlassIcons.ClockIcon, assetUrl: asset12 },
  { name: "CloseIcon", slug: "close", Component: GlassIcons.CloseIcon, assetUrl: asset13 },
  { name: "DangerIcon", slug: "danger", Component: GlassIcons.DangerIcon, assetUrl: asset14 },
  { name: "DiscountIcon", slug: "discount", Component: GlassIcons.DiscountIcon, assetUrl: asset15 },
  { name: "DiscoveryIcon", slug: "discovery", Component: GlassIcons.DiscoveryIcon, assetUrl: asset16 },
  { name: "DocumentIcon", slug: "document", Component: GlassIcons.DocumentIcon, assetUrl: asset17 },
  { name: "EditIcon", slug: "edit", Component: GlassIcons.EditIcon, assetUrl: asset18 },
  { name: "FilterIcon", slug: "filter", Component: GlassIcons.FilterIcon, assetUrl: asset19 },
  { name: "FolderIcon", slug: "folder", Component: GlassIcons.FolderIcon, assetUrl: asset20 },
  { name: "GalleryIcon", slug: "gallery", Component: GlassIcons.GalleryIcon, assetUrl: asset21 },
  { name: "GameIcon", slug: "game", Component: GlassIcons.GameIcon, assetUrl: asset22 },
  { name: "GraphIcon", slug: "graph", Component: GlassIcons.GraphIcon, assetUrl: asset23 },
  { name: "HeartIcon", slug: "heart", Component: GlassIcons.HeartIcon, assetUrl: asset24 },
  { name: "HomeIcon", slug: "home", Component: GlassIcons.HomeIcon, assetUrl: asset25 },
  { name: "Info02Icon", slug: "info-02", Component: GlassIcons.Info02Icon, assetUrl: asset26 },
  { name: "InfoIcon", slug: "info", Component: GlassIcons.InfoIcon, assetUrl: asset27 },
  { name: "LocationIcon", slug: "location", Component: GlassIcons.LocationIcon, assetUrl: asset28 },
  { name: "Lock02Icon", slug: "lock-02", Component: GlassIcons.Lock02Icon, assetUrl: asset29 },
  { name: "LockIcon", slug: "lock", Component: GlassIcons.LockIcon, assetUrl: asset30 },
  { name: "Menu02Icon", slug: "menu-02", Component: GlassIcons.Menu02Icon, assetUrl: asset31 },
  { name: "MenuIcon", slug: "menu", Component: GlassIcons.MenuIcon, assetUrl: asset32 },
  { name: "MessageIcon", slug: "message", Component: GlassIcons.MessageIcon, assetUrl: asset33 },
  { name: "NotificationIcon", slug: "notification", Component: GlassIcons.NotificationIcon, assetUrl: asset34 },
  { name: "PaperIcon", slug: "paper", Component: GlassIcons.PaperIcon, assetUrl: asset35 },
  { name: "PaperPlusIcon", slug: "paper-plus", Component: GlassIcons.PaperPlusIcon, assetUrl: asset36 },
  { name: "PlayIcon", slug: "play", Component: GlassIcons.PlayIcon, assetUrl: asset37 },
  { name: "ProfileIcon", slug: "profile", Component: GlassIcons.ProfileIcon, assetUrl: asset38 },
  { name: "SearchIcon", slug: "search", Component: GlassIcons.SearchIcon, assetUrl: asset39 },
  { name: "SendIcon", slug: "send", Component: GlassIcons.SendIcon, assetUrl: asset40 },
  { name: "SettingIcon", slug: "setting", Component: GlassIcons.SettingIcon, assetUrl: asset41 },
  { name: "ShieldIcon", slug: "shield", Component: GlassIcons.ShieldIcon, assetUrl: asset42 },
  { name: "ShowIcon", slug: "show", Component: GlassIcons.ShowIcon, assetUrl: asset43 },
  { name: "Star02Icon", slug: "star-02", Component: GlassIcons.Star02Icon, assetUrl: asset44 },
  { name: "StarIcon", slug: "star", Component: GlassIcons.StarIcon, assetUrl: asset45 },
  { name: "TickIcon", slug: "tick", Component: GlassIcons.TickIcon, assetUrl: asset46 },
  { name: "VideoIcon", slug: "video", Component: GlassIcons.VideoIcon, assetUrl: asset47 },
  { name: "VolumeIcon", slug: "volume", Component: GlassIcons.VolumeIcon, assetUrl: asset48 },
  { name: "WalletIcon", slug: "wallet", Component: GlassIcons.WalletIcon, assetUrl: asset49 },
]
