// ─────────────────────────────────────────────────────────────────────────────
// App.tsx
//
// Imports:
//   theme.css      — color custom properties  (swap via data-theme attr)
//   spacing.css    — space / component-size custom properties
//   typography.css — font / text custom properties
//   app.module.css — scoped component class names
//
// To switch theme at runtime, set document.documentElement.dataset.theme
// to one of: "cga386" | "amber" | "green" | "mono"
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { Accordion } from "@base-ui/react/accordion";
import { Dialog } from "@base-ui/react/dialog";
import { Tabs } from "@base-ui/react/tabs";
import { Tooltip } from "@base-ui/react/tooltip";
import { Checkbox } from "@base-ui/react/checkbox";
import { Switch } from "@base-ui/react/switch";
import { Select } from "@base-ui/react/select";
import { Slider } from "@base-ui/react/slider";
import { Progress } from "@base-ui/react/progress";
import { Menu } from "@base-ui/react/menu";
import { RadioGroup } from "@base-ui/react/radio-group";
import { Radio } from "@base-ui/react/radio";
import { Separator } from "@base-ui/react/separator";
import { NumberField } from "@base-ui/react/number-field";
import type { CSSProperties, ReactNode } from "react";

import "./styles/theme.css";
import "./styles/spacing.css";
import "./styles/typography.css";
import "./styles/index.css";
import S from "./app.module.css";

// ── Types ─────────────────────────────────────────────────────
type ThemeName = "cga386" | "amber" | "green" | "mono";

interface TableRow {
  name: string;
  type: string;
  size: string;
  status: "STABLE" | "BETA" | "ALPHA";
}

interface AccordionEntry { v: string; title: string; body: string; }
interface SelectOption { v: string; l: string; }
interface RadioOption { v: string; l: string; }
type TabId = "buttons" | "forms" | "accordion" | "dialog" | "table" | "misc";

// ── Static data ───────────────────────────────────────────────
const THEME_NAMES: readonly ThemeName[] = ["cga386", "amber", "green", "mono"];

const NAV_LINKS: readonly string[] = [
  "Home", "Components", "Scaffolding", "Base CSS", "JavaScript", "Customize",
];

const SIDEBAR_ITEMS: readonly string[] = [
  "Download", "File structure", "What's included", "HTML template", "Examples", "What next?",
];

const TABLE_DATA: readonly TableRow[] = [
  { name: "Accordion", type: "Composite", size: "4.2 KB", status: "STABLE" },
  { name: "Dialog", type: "Overlay", size: "3.8 KB", status: "STABLE" },
  { name: "Menu", type: "Composite", size: "5.1 KB", status: "STABLE" },
  { name: "Slider", type: "Input", size: "2.9 KB", status: "BETA" },
  { name: "Tooltip", type: "Overlay", size: "1.6 KB", status: "STABLE" },
  { name: "Select", type: "Input", size: "3.2 KB", status: "STABLE" },
];

const ACCORDION_ITEMS: readonly AccordionEntry[] = [
  { v: "system", title: "SYSTEM REQUIREMENTS", body: "CPU: Intel 386 SX or compatible | RAM: 640K | OS: MS-DOS 6.22 or React 18+ | VGA: Hercules monochrome preferred" },
  { v: "install", title: "INSTALLATION", body: "Run SETUP.EXE from the installation disk. Follow the on-screen prompts. Reboot when complete. Press F1 at any time for help." },
  { v: "license", title: "LICENSE INFORMATION", body: 'This software is provided "as is". Not responsible for corrupted boot sectors, segmentation faults, or general protection faults.' },
  { v: "support", title: "TECHNICAL SUPPORT", body: "For assistance, contact your local BBS, post to USENET, or consult the printed manual. Average response time: 6-8 weeks." },
];

const SELECT_OPTIONS: readonly SelectOption[] = [
  { v: "vga256", l: "VGA or IBM PS2 – 256 Colors" },
  { v: "vgagray", l: "VGA or IBM PS2 – Grey Scale" },
  { v: "ega", l: "EGA/VGA – 16 Colors" },
  { v: "cga", l: "CGA – 4 Colors" },
  { v: "herc", l: "Hercules Monochrome" },
];

const RADIO_OPTIONS: readonly RadioOption[] = [
  { v: "vga256", l: "VGA or IBM PS2 – 256 Colors" },
  { v: "vgagray", l: "VGA or IBM PS2 – Grey Scale" },
  { v: "ega16", l: "EGA/VGA – 16 Colors" },
];

const TABS: readonly { val: TabId; label: string }[] = [
  { val: "buttons", label: "Buttons" },
  { val: "forms", label: "Forms" },
  { val: "accordion", label: "Accordion" },
  { val: "dialog", label: "Dialog" },
  { val: "table", label: "Table" },
  { val: "misc", label: "Misc" },
];

const HEADING_SIZES: readonly { tag: string; size: string }[] = [
  { tag: "h1", size: "var(--text-3xl)" },
  { tag: "h2", size: "var(--text-2xl)" },
  { tag: "h3", size: "var(--text-xl)" },
  { tag: "h4", size: "var(--text-lg)" },
];

// Status → CSS custom property name (references theme token at runtime)
const STATUS_VAR: Record<TableRow["status"], string> = {
  STABLE: "var(--color-success)",
  BETA: "var(--color-warning)",
  ALPHA: "var(--color-danger)",
};

// ── Helper components ─────────────────────────────────────────

function Sect({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div className={S.sectionHeader}>{title}</div>
      <div className={S.panel}>
        <div className={S.panelInner}>{children}</div>
      </div>
    </div>
  );
}

// Primary button — filled
function BtnPrimary({
  children, onClick, className = "", style,
}: { children: ReactNode; onClick?: () => void; className?: string; style?: CSSProperties }) {
  return (
    <button
      className={`${S.btn} ${S.btnPrimary} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Secondary button — outlined
function BtnSecondary({
  children, onClick, className = "", style,
}: { children: ReactNode; onClick?: () => void; className?: string; style?: CSSProperties }) {
  return (
    <button
      className={`${S.btn} ${S.btnSecondary} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CheckboxRow({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={S.checkLabel}>
      <Checkbox.Root checked={checked} onCheckedChange={onChange} className={S.checkRoot}>
        <Checkbox.Indicator className={S.checkIndicator}>X</Checkbox.Indicator>
      </Checkbox.Root>
      {label}
    </label>
  );
}

// ── App ───────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<ThemeName>("cga386");
  const [activeNav, setActiveNav] = useState("Components");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [sliderVal, setSliderVal] = useState([33]);
  const [progVal] = useState(65);
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [radioVal, setRadioVal] = useState("vga256");
  const [numVal, setNumVal] = useState(8);
  const [activeTab, setActiveTab] = useState<TabId>("buttons");
  const [selectVal, setSelectVal] = useState("ega");

  // Apply theme to <html> on mount and when theme changes (so [data-theme="cga386"] selectors apply)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function handleThemeChange(name: ThemeName) {
    setTheme(name);
  }

  return (
    <div className={S.page}>

      {/* ── NAVBAR ── */}
      <nav className={S.navbar}>
        <span className={S.navBrand}>Bootstrap</span>
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            className={`${S.navItem} ${activeNav === link ? S.navItemActive : ""}`}
            onClick={() => setActiveNav(link)}
          >
            {link}
          </button>
        ))}
        {/* Theme switcher */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "stretch" }}>
          {THEME_NAMES.map((name) => (
            <button
              key={name}
              className={`${S.navItem} ${theme === name ? S.navItemActive : ""}`}
              onClick={() => handleThemeChange(name)}
              style={{ fontSize: "11px", padding: "4px 8px" }}
            >
              {name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BREADCRUMB ── */}
      <div className={S.breadcrumb}>
        Overview of the project, its contents, and how to get started.
      </div>

      {/* ── BODY ── */}
      <div className={S.container}>
        <div className={S.row}>

          {/* ── SIDEBAR ── */}
          <div className={S.col3}>
            <div className={S.sidebar}>
              {SIDEBAR_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className={i === 0 ? S.sidebarItemActive : S.sidebarItem}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className={S.col9}>
            <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>

              <Tabs.List className={S.tabList}>
                {TABS.map(({ val, label }) => (
                  <Tabs.Tab
                    key={val}
                    value={val}
                    className={activeTab === val ? S.tabActive : S.tab}
                  >
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {/* ════ BUTTONS ════ */}
              <Tabs.Panel value="buttons" className={S.tabPanel}>
                <Sect title="1. BUTTONS">
                  <div style={{ marginBottom: "10px" }}>
                    <div className={S.label} style={{ marginBottom: "6px" }}>Primary (filled):</div>
                    <BtnPrimary>Default</BtnPrimary>
                    <BtnPrimary className={S.btnSuccess} style={{ color: "var(--color-bg-black)" }}>Success</BtnPrimary>
                    <BtnPrimary className={S.btnWarning} style={{ color: "var(--color-bg-black)" }}>Warning</BtnPrimary>
                    <BtnPrimary className={S.btnDanger} style={{ color: "var(--color-bg-black)" }}>Danger</BtnPrimary>
                    <BtnPrimary className={S.btnInfo} style={{ color: "var(--color-bg-black)" }}>Info</BtnPrimary>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <div className={S.label} style={{ marginBottom: "6px" }}>Secondary (outlined):</div>
                    <BtnSecondary>Default</BtnSecondary>
                    <BtnSecondary style={{ borderColor: "var(--color-success)", color: "var(--color-success)" }}>Success</BtnSecondary>
                    <BtnSecondary style={{ borderColor: "var(--color-warning)", color: "var(--color-warning)" }}>Warning</BtnSecondary>
                    <BtnSecondary style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}>Danger</BtnSecondary>
                    <BtnSecondary style={{ borderColor: "var(--color-info)", color: "var(--color-info)" }}>Info</BtnSecondary>
                  </div>
                  <div>
                    <div className={S.label} style={{ marginBottom: "6px" }}>Sizes:</div>
                    <BtnPrimary className={S.btnLg}>Large</BtnPrimary>
                    <BtnPrimary>Default</BtnPrimary>
                    <BtnPrimary className={S.btnSm}>&lt;Small&gt;</BtnPrimary>
                  </div>
                </Sect>

                <Sect title="2. TOOLTIPS">
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <Tooltip.Provider>
                      {(["top", "bottom", "left", "right"] as const).map((pos) => (
                        <Tooltip.Root key={pos}>
                          <Tooltip.Trigger render={
                            <button className={`${S.btn} ${S.btnSecondary}`}>
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </button>
                          } />
                          <Tooltip.Portal>
                            <Tooltip.Positioner side={pos}>
                              <Tooltip.Popup className={S.tooltipPopup}>Tooltip on {pos}</Tooltip.Popup>
                            </Tooltip.Positioner>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ))}
                    </Tooltip.Provider>
                  </div>
                </Sect>
              </Tabs.Panel>

              {/* ════ FORMS ════ */}
              <Tabs.Panel value="forms" className={S.tabPanel}>
                <Sect title="3. FORM CONTROLS">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <span className={S.label}>Username:</span>
                      <input className={S.input} defaultValue="DOS_USER" />
                      <span className={S.label}>Password:</span>
                      <input className={S.input} type="password" defaultValue="*****" />
                      <span className={S.label}>Number field:</span>
                      <NumberField.Root value={numVal} onValueChange={(v) => setNumVal(v ?? 0)} style={{ marginBottom: "8px" }}>
                        <NumberField.Group className={S.numberRoot}>
                          <NumberField.Decrement className={S.numberBtn}>-</NumberField.Decrement>
                          <NumberField.Input className={S.numberInput} />
                          <NumberField.Increment className={`${S.numberBtn} ${S.numberBtnRight}`}>+</NumberField.Increment>
                        </NumberField.Group>
                      </NumberField.Root>
                    </div>

                    <div style={{ flex: 1 }}>
                      <span className={S.label}>Graphics adapter:</span>
                      <Select.Root value={selectVal} onValueChange={(v) => setSelectVal(v ?? "")}>
                        <Select.Trigger className={S.selectTrigger}>
                          <Select.Value />
                          <span>▾</span>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Positioner>
                            <Select.Popup className={S.selectPopup}>
                              <Select.List>
                                {SELECT_OPTIONS.map(({ v, l }) => (
                                  <Select.Item key={v} value={v} className={S.selectOption}>
                                    {selectVal === v ? "√ " : "  "}{l}
                                  </Select.Item>
                                ))}
                              </Select.List>
                            </Select.Popup>
                          </Select.Positioner>
                        </Select.Portal>
                      </Select.Root>

                      <div style={{ marginTop: "12px" }}>
                        <span className={S.label}>Checkboxes:</span>
                        <CheckboxRow label=" Save credentials" checked={checked1} onChange={setChecked1} />
                        <CheckboxRow label=" Verbose logging" checked={checked2} onChange={setChecked2} />
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <span className={S.label}>Toggle switch:</span>
                        <label className={S.switchLabel}>
                          <Switch.Root
                            checked={switched}
                            onCheckedChange={setSwitched}
                            className={`${S.switchRoot} ${switched ? S.switchRootOn : ""}`}
                          >
                            <Switch.Thumb className={`${S.switchThumb} ${switched ? S.switchThumbOn : ""}`}>
                              {switched ? "ON" : ""}
                            </Switch.Thumb>
                          </Switch.Root>
                          {switched ? "Enabled" : "Disabled"}
                        </label>
                      </div>
                    </div>
                  </div>
                </Sect>

                <Sect title="4. RADIO GROUP">
                  <div className={S.infoBox}>Select a graphics adapter from the choices below</div>
                  <RadioGroup value={radioVal} onValueChange={setRadioVal}>
                    {RADIO_OPTIONS.map(({ v, l }) => (
                      <Radio.Root key={v} value={v} className={S.radioRow}>
                        <span className={`${S.radioCheck} ${radioVal === v ? S.radioCheckActive : ""}`}>
                          {radioVal === v ? "√" : " "}
                        </span>
                        <Radio.Indicator keepMounted style={{ display: "none" }} />
                        <span className={`${S.radioLabel} ${radioVal === v ? S.radioLabelActive : ""}`}>{l}</span>
                      </Radio.Root>
                    ))}
                  </RadioGroup>
                  <div style={{ marginTop: "8px" }} className={S.label}>
                    √ = supported by your system &nbsp;|&nbsp; Use ↑,↓ and ENTER. ESC to go back. F1 for help.
                  </div>
                </Sect>

                <Sect title="5. SLIDER + PROGRESS">
                  <span className={S.label}>CPU Clock: {sliderVal[0]} MHz</span>
                  <Slider.Root
                    value={sliderVal}
                    onValueChange={setSliderVal}
                    min={4}
                    max={40}
                    className={S.sliderRoot}
                    style={{ marginBottom: "12px" }}
                  >
                    <Slider.Control className={S.sliderControl}>
                      <Slider.Track className={S.sliderTrack}>
                        <Slider.Indicator className={S.sliderFill} />
                        <Slider.Thumb className={S.sliderThumb} />
                      </Slider.Track>
                    </Slider.Control>
                  </Slider.Root>

                  <span className={S.label}>Memory: {progVal}% used</span>
                  <Progress.Root value={progVal} style={{ marginBottom: "8px" }}>
                    <Progress.Track className={S.progressTrack}>
                      <Progress.Indicator
                        className={S.progressFill}
                        style={{ width: `${progVal}%` }}
                      />
                    </Progress.Track>
                  </Progress.Root>
                </Sect>
              </Tabs.Panel>

              {/* ════ ACCORDION ════ */}
              <Tabs.Panel value="accordion" className={S.tabPanel}>
                <Sect title="6. ACCORDION">
                  <Accordion.Root defaultValue={["system"]}>
                    {ACCORDION_ITEMS.map(({ v, title, body }) => (
                      <Accordion.Item key={v} value={v} className={S.accItem}>
                        <Accordion.Header>
                          <Accordion.Trigger className={S.accTrigger}>
                            <span>{title}</span>
                            <span className={S.accArrow}>▾</span>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel className={S.accPanel}>{body}</Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </Sect>
              </Tabs.Panel>

              {/* ════ DIALOG ════ */}
              <Tabs.Panel value="dialog" className={S.tabPanel}>
                <Sect title="7. DIALOG / MODAL">
                  <div className={S.infoBox}>
                    Dialogs are windowed overlays. Click the button below to open one.
                  </div>
                  <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Dialog.Trigger render={
                      <button className={`${S.btn} ${S.btnSecondary}`}>Open Dialog</button>
                    } />
                    <Dialog.Portal>
                      <Dialog.Backdrop className={S.dialogBackdrop} />
                      <Dialog.Popup className={S.dialogPopup}>
                        <div className={S.dialogTitleBar}>
                          <span>■ SIERRA ON-LINE — SETUP.EXE</span>
                          <Dialog.Close render={<button className={S.dialogCloseBtn}>✕</button>} />
                        </div>
                        <div className={S.dialogBody}>
                          <Dialog.Title className={S.dialogTitle}>
                            Select Configuration
                          </Dialog.Title>
                          <Dialog.Description className={S.dialogDescription}>
                            Use ↑ ↓ and ENTER to select. ESC to go back.
                          </Dialog.Description>
                          <div className={S.infoBox}>
                            Copyright 1991-92<br />Sierra On-Line, Inc.<br />All rights reserved.
                          </div>
                        </div>
                        <div className={S.dialogFooter}>
                          <Dialog.Close render={
                            <button className={`${S.btn} ${S.btnSecondary}`}
                              style={{ borderColor: "var(--color-fg-dim)", color: "var(--color-fg-dim)" }}>
                              Cancel
                            </button>
                          } />
                          <Dialog.Close render={
                            <button className={`${S.btn} ${S.btnPrimary}`}
                              style={{ background: "var(--color-accent-hi)", borderColor: "var(--color-accent-hi)", color: "var(--color-bg-black)" }}>
                              OK
                            </button>
                          } />
                        </div>
                      </Dialog.Popup>
                    </Dialog.Portal>
                  </Dialog.Root>
                </Sect>

                <Sect title="8. DROPDOWN MENUS">
                  {[
                    { label: "File ▾", colorVar: "--color-fg-link", items: ["New", "Open", "Save", "Save As"], danger: "Exit" },
                    { label: "Edit ▾", colorVar: "--color-fg-dim", items: ["Cut", "Copy", "Paste", "Select All"] },
                    { label: "Themes ▾", colorVar: "--color-warning", items: ["Cerulean", "Default", "Slate", "Cyborg"] },
                  ].map(({ label, colorVar, items, danger }) => (
                    <Menu.Root key={label}>
                      <Menu.Trigger render={
                        <button
                          className={`${S.btn} ${S.btnSecondary}`}
                          style={{ borderColor: `var(${colorVar})`, color: `var(${colorVar})` }}
                        >
                          {label}
                        </button>
                      } />
                      <Menu.Portal>
                        <Menu.Positioner>
                          <Menu.Popup className={S.menuPopup}>
                            {items.map((item) => (
                              <Menu.Item key={item} className={S.menuItem}>{item}</Menu.Item>
                            ))}
                            {danger && (
                              <>
                                <Separator className={S.menuSep} />
                                <Menu.Item className={`${S.menuItem} ${S.menuItemDanger}`}>{danger}</Menu.Item>
                              </>
                            )}
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                  ))}
                </Sect>
              </Tabs.Panel>

              {/* ════ TABLE ════ */}
              <Tabs.Panel value="table" className={S.tabPanel}>
                <Sect title="9. DATA TABLE — DIR C:\COMPONENTS\*.*">
                  <table className={S.table}>
                    <thead>
                      <tr>
                        {(["NAME", "TYPE", "SIZE", "STATUS"] as const).map((h) => (
                          <th key={h} className={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_DATA.map((row, i) => {
                        const sel = selectedRow === i;
                        const rowClass = sel
                          ? S.trSelected
                          : i % 2 === 0 ? S.trOdd : S.trEven;
                        return (
                          <tr key={row.name} className={rowClass} onClick={() => setSelectedRow(i)}>
                            <td className={S.td} style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-link)" }}>{row.name}</td>
                            <td className={S.td} style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-text)" }}>{row.type}</td>
                            <td className={S.td} style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-text)" }}>{row.size}</td>
                            <td className={S.td} style={{ color: sel ? "var(--color-bg-black)" : STATUS_VAR[row.status] }}>{row.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Sect>
              </Tabs.Panel>

              {/* ════ MISC ════ */}
              <Tabs.Panel value="misc" className={S.tabPanel}>
                <Sect title="10. TYPOGRAPHY">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      {HEADING_SIZES.map(({ tag, size }) => (
                        <div key={tag} className={S.headingDemo} style={{ fontSize: size }}>
                          {tag.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 2 }}>
                      <div className={S.infoBox}>Example body text</div>
                      <p className={S.bodyText}>
                        Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque
                        penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                      </p>
                      <p className={S.finePrint} style={{ marginTop: "8px" }}>
                        This line of text is meant to be treated as fine print.
                      </p>
                    </div>
                  </div>
                </Sect>

                <Sect title="11. SEPARATORS">
                  <p className={S.bodyText} style={{ marginBottom: "8px" }}>Above the separator line.</p>
                  <Separator className={S.separator} />
                  <p className={S.finePrint}>Below the separator line.</p>
                </Sect>

                <Sect title="12. CODE BLOCK">
                  <pre className={S.codeBlock}>
                    {`C:\\BASE-UI> npm install @base-ui/react\n\nadded 1 package in 0.386s\n\nC:\\BASE-UI> type README.TXT\n\nINSTALLATION COMPLETE.\nPress any key to continue_`}
                  </pre>
                </Sect>
              </Tabs.Panel>

            </Tabs.Root>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className={S.footer}>
        BASE UI / BOOTSTRA.386 &nbsp;|&nbsp; Press F1 for help &nbsp;|&nbsp; ALT+F4 to quit &nbsp;|&nbsp; C:\BASE-UI&gt;_
      </div>
    </div>
  );
}