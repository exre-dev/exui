import type { ComponentProps } from "react"
import {
  CASCADER_LABELS,
  DEFAULT_COLOR_PICKER_I18N,
  DEFAULT_DATE_SELECTOR_I18N,
  DEFAULT_EMOJI_PICKER_I18N,
  DEFAULT_FILTER_LABELS,
  DEFAULT_FILTER_OPERATOR_LABELS,
  DEFAULT_TIME_PICKER_I18N,
  mergeDataGridI18n,
  type Calendar,
  type CascaderLabels,
  type ColorPickerI18nConfig,
  type DataGridI18nConfig,
  type DateSelectorI18nConfig,
  type EmojiPickerI18nConfig,
  type FilterLabels,
  type FilterOperatorLabels,
  type PhoneInput,
  type TimePickerI18nConfig,
} from "@exre/exui"
import { format } from "date-fns"
import { enUS, zhCN } from "date-fns/locale"
import { exampleComplexLocales } from "./example-complex-locales"

const cascaderZh: CascaderLabels = {
  search: (parentLabel) => parentLabel ? `搜索${parentLabel}...` : "搜索...",
  back: "返回",
  loading: "正在加载...",
  loadingMore: "正在加载更多...",
  loadMore: "加载更多",
  error: "无法加载项目。",
  retry: "重试",
  empty: "未找到结果。",
  selectedCount: (count) => `已选择 ${count} 项`,
  breadcrumbLabel: "面包屑导航",
  chipsLabel: "已选项目",
  removeChip: (label) => `移除${label}`,
  pathSeparator: "/",
  rootLevel: "顶层",
  itemCount: (count) => `${count} 项`,
  branchAffordance: "子菜单",
  selectedState: "已选择",
  partiallySelectedState: "部分已选择",
  columnsLabel: "层级",
  actionsLabel: "操作",
  submenuAffordance: "打开菜单",
  panelLabel: "选项",
  keyboardHint: (mode, dir) => {
    const open = dir === "rtl" ? "左" : "右"
    const back = dir === "rtl" ? "右" : "左"
    if (mode === "tree") return `按向${open}箭头展开，按向${back}箭头折叠。`
    if (mode === "columns") return `按向${open}箭头打开下一列，按向${back}箭头返回。`
    return `按向${open}箭头打开分支，按向${back}箭头返回。`
  },
  rootAnnouncement: (count) => `顶层，${count} 项`,
  expandedAnnouncement: (label, count) => `${label}已展开，${count} 项`,
  collapsedAnnouncement: (label) => `${label}已折叠`,
  levelAnnouncement: (parentLabel, depth, count) => `${parentLabel}，第 ${depth} 层，${count} 项`,
  resultsAnnouncement: (count) => `${count} 个结果`,
  maxReachedAnnouncement: (max) => `已达到最多 ${max} 项的选择上限`,
  cascadeAnnouncement: (label, count, selecting) => `${label}已${selecting ? "选择" : "取消选择"}，${count} 个子项同步更改`,
  searchingAnnouncement: "正在搜索...",
}

const dataGridZh: DataGridI18nConfig = {
  labels: {
    sortAscending: "升序",
    sortDescending: "降序",
    pinColumnStart: "固定到左侧",
    pinColumnEnd: "固定到右侧",
    moveColumnStart: "移到左侧",
    moveColumnEnd: "移到右侧",
    columnsMenu: "列选项",
    unpinColumn: (title) => `取消固定“${title}”列`,
    toggleColumns: "选择显示的列",
    rowCreate: "添加行",
    pinRow: "固定行",
    unpinRow: "取消固定行",
    selectRow: "选择行",
    selectAll: "全选",
    expandRow: "展开行",
    collapseRow: "折叠行",
    dragToReorder: "拖动以调整顺序",
    dragToReorderRow: "拖动以调整行顺序",
    reorderingUnavailable: "无法调整顺序",
    loading: "正在加载...",
    empty: "暂无数据",
    allRowsLoaded: "已加载所有记录",
    rowsPerPage: "每页行数",
    paginationInfo: ({ from, to, count }) => `第 ${from}–${to} 条，共 ${count} 条`,
    previousPage: "前往上一页",
    nextPage: "前往下一页",
    goToPage: (page) => `前往第 ${page} 页`,
    paginationEllipsis: "...",
    filterSelectedCount: (count) => `已选择 ${count} 项`,
    filterNoResults: "未找到结果。",
    filterClear: "清除筛选",
  },
}

const dateSelectorZh: DateSelectorI18nConfig = {
  selectDate: "选择日期",
  apply: "应用",
  cancel: "取消",
  clear: "清除",
  today: "今天",
  filterTypes: { is: "等于", before: "早于", after: "晚于", between: "介于" },
  periodTypes: { day: "日", month: "月", quarter: "季度", halfYear: "半年", year: "年" },
  months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  quarters: ["第一季度", "第二季度", "第三季度", "第四季度"],
  halfYears: ["上半年", "下半年"],
  weekdays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"],
  placeholder: "选择日期...",
  rangePlaceholder: "选择日期范围...",
}

const filtersZh: FilterLabels = {
  addFilter: "添加筛选",
  advancedFilter: "高级筛选",
  showRecords: "在此视图中显示符合条件的记录",
  builderEmpty: "暂无筛选条件",
  builderEmptyHint: "添加筛选条件以缩小显示范围。",
  addCondition: "添加筛选",
  addConditionGroup: "添加分组",
  addToGroup: "向此分组添加筛选",
  removeGroup: "移除分组",
  wrapInGroup: "放入新分组",
  ungroup: "取消分组",
  moveToTopLevel: "移到顶层",
  moveToGroup: (position) => `移到第 ${position} 个分组`,
  reorder: "调整顺序",
  reorderHint: "按 Alt 加上箭头或下箭头调整顺序",
  groupAll: "满足以下所有条件...",
  groupAny: "满足以下任一条件...",
  groupPlaceholder: "将筛选条件拖到这里",
  rowLabel: (condition, depth) => `${condition}，第 ${depth} 层`,
  groupLabel: (description, depth) => `${description}，第 ${depth} 层`,
  groupAnnouncement: (added) => added ? "已添加分组" : "已移除分组",
  reorderAnnouncement: (label, position, total) => `${label}已移到第 ${position} 项，共 ${total} 项`,
  moveAnnouncement: (label, destination, position, total) => `${label}已移入${destination}，位于第 ${position} 项，共 ${total} 项`,
  clearAll: "全部清除",
  groupMenu: "分组选项",
  searchFields: "搜索属性...",
  searchOperators: "搜索运算符...",
  searchOptions: "搜索...",
  back: "返回",
  clear: "清除",
  apply: "应用",
  discard: "放弃更改",
  empty: "无结果",
  loading: "正在加载...",
  loadingMore: "正在加载更多...",
  loadMore: "加载更多",
  error: "加载失败",
  retry: "重试",
  where: "筛选条件",
  and: "且",
  or: "或",
  combinator: "更改组合关系",
  combinatorLabel: (word) => `${word}，更改组合关系`,
  duplicate: "复制一份",
  negate: "取反",
  convertToAdvanced: "高级编辑器",
  remove: "移除",
  chipMenu: (fieldLabel) => `${fieldLabel}筛选选项`,
  filtersLabel: "筛选",
  filterLabel: (condition) => condition,
  readOnly: "只读。无法更改这些筛选条件。",
  pathSeparator: " > ",
  valuePlaceholder: "输入文本...",
  selectPlaceholder: "请选择...",
  noValue: "无值",
  selectCondition: "选择条件",
  incomplete: "筛选条件不完整",
  branchAffordance: "打开列表",
  exclusiveHint: "无法与其他选项组合",
  exclusiveAnnouncement: (label, cleared) => `已选择${label}，已清除其他 ${cleared} 个选择。`,
  itemCount: (count) => `${count} 项`,
  fieldsLabel: "属性",
  resultsAnnouncement: (count) => `${count} 个结果`,
  actionsLabel: "操作",
  stepAnnouncement: (step, label) => step === "field"
    ? `选择属性。${label}`
    : step === "operator" ? `为${label}选择条件` : `为${label}输入值`,
  countAnnouncement: (count) => `已应用 ${count} 个筛选条件`,
  valueCount: (count) => `已选择 ${count} 项`,
  valueDetail: (summary, values) => `${summary}：${values.join("、")}`,
  valueRange: (from, to) => `${from} 至 ${to}`,
  rangeFrom: (fieldLabel) => `${fieldLabel}起始值`,
  rangeTo: (fieldLabel) => `${fieldLabel}结束值`,
  rangeSeparator: "至",
  negated: (operatorLabel) => `不满足“${operatorLabel}”`,
  issueOperator: "请选择条件",
  issueValue: "请输入值",
  issueRange: "请输入范围的起始值和结束值",
  issueRangeOrder: "范围的结束值早于起始值",
  issueEmptyGroup: "此分组尚无条件",
  issueSummary: (count) => `${count} 行需要处理`,
}

const filterOperatorsZh: FilterOperatorLabels = {
  contains: "包含",
  not_contains: "不包含",
  starts_with: "开头为",
  ends_with: "结尾为",
  is: "等于",
  is_not: "不等于",
  is_any_of: "是其中任意一项",
  is_none_of: "不是其中任何一项",
  has_any_of: "包含其中任意一项",
  has_all_of: "包含其中所有项",
  has_none_of: "不包含其中任何一项",
  eq: "等于",
  neq: "不等于",
  gt: "大于",
  gte: "大于或等于",
  lt: "小于",
  lte: "小于或等于",
  between: "介于",
  not_between: "不介于",
  is_before: "早于",
  is_after: "晚于",
  is_on_or_before: "不晚于",
  is_on_or_after: "不早于",
  empty: "为空",
  not_empty: "不为空",
}

const colorNamesZh: Record<string, string> = {
  pink: "粉色", red: "红色", orange: "橙色", yellow: "黄色", lime: "黄绿色",
  green: "绿色", cyan: "青色", "sky blue": "天蓝色", blue: "蓝色", violet: "蓝紫色",
  purple: "紫色", magenta: "洋红色", brown: "棕色", olive: "橄榄色", black: "黑色",
  "dark gray": "深灰色", gray: "灰色", "light gray": "浅灰色", white: "白色",
  grayish: "偏灰", vibrant: "鲜艳", dark: "深", light: "浅",
}

const colorPickerZh: ColorPickerI18nConfig = {
  labels: {
    placeholder: "选择颜色", panelLabel: "选择颜色", openPicker: "打开颜色选择器",
    area: "颜色", hue: "色相", saturation: "饱和度", brightness: "亮度", lightness: "明度",
    chroma: "色度", red: "红色", green: "绿色", blue: "蓝色", alpha: "不透明度",
    hex: "十六进制", format: "颜色格式", eyeDropper: "从屏幕取色", copy: "复制颜色",
    copied: "已复制", clear: "清除", swatches: "色板",
  },
  functions: {
    getColorName: (color) => DEFAULT_COLOR_PICKER_I18N.functions.getColorName(color)
      .replace(/\b(?:sky blue|dark gray|light gray|[a-z]+)\b/g, (word) => colorNamesZh[word] ?? word)
      .replaceAll(" ", ""),
  },
}

const timePickerZh: TimePickerI18nConfig = {
  labels: {
    placeholder: "选择时间", hour: "时", minute: "分", second: "秒", period: "时段",
    am: "上午", pm: "下午", now: "现在", clear: "清除", confirm: "确定",
    panelLabel: "选择时间", openPicker: "打开时间选择器",
  },
  // The public formatter uses the translated period labels and preserves the
  // example's hour cycle, precision and explicit period-position variant.
  functions: { ...DEFAULT_TIME_PICKER_I18N.functions },
}

const emojiPickerZh: EmojiPickerI18nConfig = {
  labels: {
    trigger: "添加表情", panel: "表情选择器", search: "搜索表情", clearSearch: "清除搜索", remove: "移除表情",
    list: "表情", categories: "表情分类", frequent: "常用", recent: "最近使用",
    searchResults: "搜索结果", custom: "自定义", smileys: "笑脸与情感", people: "人物与身体",
    nature: "动物与自然", food: "食物与饮品", travel: "旅行与地点", activities: "活动",
    objects: "物品", symbols: "符号", flags: "旗帜", skinTone: "肤色",
    skinTones: ["默认", "浅色", "较浅", "中等", "较深", "深色"],
    empty: "未找到表情", emptyHint: "试试其他词语或短代码", loading: "正在加载表情",
    error: "无法加载表情", retry: "重试", preview: "选择一个表情",
  },
  functions: {
    formatResultCount: (count) => `找到 ${count} 个表情`,
    formatSelected: (label) => `已选择${label}`,
    formatLabel: (label) => label,
  },
}

type CalendarLabels = Required<NonNullable<ComponentProps<typeof Calendar>["labels"]>>

function calendarLabels(language: "en" | "zh-CN"): CalendarLabels {
  const zh = language === "zh-CN"
  const locale = zh ? zhCN : enUS
  const fullDate = (date: Date) => format(date, "PPPP", { locale })
  return {
    labelNav: () => zh ? "日历导航" : "Calendar navigation",
    labelGrid: (date) => format(date, zh ? "yyyy年M月" : "LLLL yyyy", { locale }),
    labelGridcell: (date, modifiers) => `${fullDate(date)}${modifiers?.today ? zh ? "，今天" : ", today" : ""}`,
    labelMonthDropdown: () => zh ? "选择月份" : "Choose month",
    labelYearDropdown: () => zh ? "选择年份" : "Choose year",
    labelNext: () => zh ? "前往下个月" : "Go to next month",
    labelPrevious: () => zh ? "前往上个月" : "Go to previous month",
    labelDayButton: (date, modifiers) => [
      fullDate(date),
      modifiers.today ? zh ? "今天" : "today" : "",
      modifiers.selected ? zh ? "已选择" : "selected" : "",
      modifiers.disabled ? zh ? "不可用" : "unavailable" : "",
    ].filter(Boolean).join(zh ? "，" : ", "),
    labelWeekday: (date) => format(date, "EEEE", { locale }),
    labelWeekNumber: (week) => zh ? `第 ${week} 周` : `Week ${week}`,
    labelWeekNumberHeader: () => zh ? "周数" : "Week number",
  }
}

type PhoneLabels = NonNullable<ComponentProps<typeof PhoneInput>["labels"]>
// The 245 selectable regions in the phone runtime's pinned metadata. Country
// codes stay stable; only their display labels follow the Showcase language.
const phoneCountries = "AC AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TA TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ")

function phoneLabels(language: "en" | "zh-CN"): PhoneLabels {
  const names = new Intl.DisplayNames([language], { type: "region" })
  return {
    ...Object.fromEntries(phoneCountries.map((code) => [code, names.of(code) ?? code])),
    ZZ: language === "zh-CN" ? "国际" : "International",
    country: language === "zh-CN" ? "国家或地区" : "Country or region",
    phone: language === "zh-CN" ? "电话号码" : "Phone number",
    ext: language === "zh-CN" ? "分机" : "Extension",
  }
}

export const exampleLocales = {
  en: {
    cascader: CASCADER_LABELS,
    dataGrid: mergeDataGridI18n(),
    dateSelector: DEFAULT_DATE_SELECTOR_I18N,
    filters: DEFAULT_FILTER_LABELS,
    filterOperators: DEFAULT_FILTER_OPERATOR_LABELS,
    colorPicker: DEFAULT_COLOR_PICKER_I18N,
    timePicker: DEFAULT_TIME_PICKER_I18N,
    emojiPicker: DEFAULT_EMOJI_PICKER_I18N,
    phoneInput: phoneLabels("en"),
    calendar: enUS,
    calendarLabels: calendarLabels("en"),
    ...exampleComplexLocales.en,
  },
  "zh-CN": {
    cascader: cascaderZh,
    dataGrid: dataGridZh,
    dateSelector: dateSelectorZh,
    filters: filtersZh,
    filterOperators: filterOperatorsZh,
    colorPicker: colorPickerZh,
    timePicker: timePickerZh,
    emojiPicker: emojiPickerZh,
    phoneInput: phoneLabels("zh-CN"),
    calendar: zhCN,
    calendarLabels: calendarLabels("zh-CN"),
    ...exampleComplexLocales["zh-CN"],
  },
}
