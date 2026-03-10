// ─────────────────────────────────────────────────────────────────────────────
// App.tsx
//
// Imports:
//   theme.css      — color custom properties  (swap via data-theme attr)
//   spacing.css    — space / component-size custom properties
//   typography.css — font / text custom properties
//   styles/index.css — component styles (shared, navbar, sidebar, buttons, etc.)
//   components/    — themed Base UI wrapper components
//
// To switch theme at runtime, set document.documentElement.dataset.theme
// to one of: "cga386" | "amber" | "green" | "mono"
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import {
  Sidebar,
  WindowContainer,
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitleBar,
  DialogClose,
  DialogBody,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  TabsRoot,
  TabsList,
  TabsTab,
  TabsPanel,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipPositioner,
  TooltipPopup,
  Checkbox,
  Switch,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectPositioner,
  SelectPopup,
  SelectList,
  SelectItem,
  SliderRoot,
  SliderControl,
  SliderTrack,
  SliderIndicator,
  SliderThumb,
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
  MenuRoot,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuItem,
  RadioGroupRoot,
  RadioRoot,
  Separator,
  NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldInput,
  NumberFieldIncrement,
  Button,
  AsciiProgressBar,
} from "./components";

import "./styles/theme.css";
import "./styles/spacing.css";
import "./styles/typography.css";
import "./styles/index.css";

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
      <div className="sectionHeader">{title}</div>
      <div className="panel">
        <div className="panelInner">{children}</div>
      </div>
    </div>
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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function handleThemeChange(name: ThemeName) {
    setTheme(name);
  }

  return (
    <div className="page">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <span className="navBrand">Bootstrap</span>
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            className={`navItem ${activeNav === link ? "navItemActive" : ""}`}
            onClick={() => setActiveNav(link)}
          >
            {link}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "stretch" }}>
          {THEME_NAMES.map((name) => (
            <button
              key={name}
              className={`navItem ${theme === name ? "navItemActive" : ""}`}
              onClick={() => handleThemeChange(name)}
              style={{ fontSize: "11px", padding: "4px 8px" }}
            >
              {name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── BREADCRUMB ── */}
      <div className="breadcrumb">
        Overview of the project, its contents, and how to get started.
      </div>

      {/* ── BODY ── */}
      <div className="container">
        <div className="row">

          {/* ── SIDEBAR ── */}
          <div className="col3">
            <Sidebar items={SIDEBAR_ITEMS} />
            <div style={{ marginTop: "var(--space-4, 16px)", display: "flex", flexDirection: "column", gap: "var(--space-4, 16px)" }}>
              <WindowContainer variant="primary" title="Primary (gray)">
                <div style={{ padding: "8px 0", color: "var(--color-fg-dim)" }}>Content in primary window.</div>
              </WindowContainer>
              <WindowContainer variant="secondary" title="Secondary (black)">
                <div style={{ padding: "8px 0", color: "var(--color-fg-dim)" }}>Content in secondary window.</div>
              </WindowContainer>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="col9">
            <TabsRoot value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>

              <TabsList>
                {TABS.map(({ val, label }) => (
                  <TabsTab key={val} value={val} active={activeTab === val}>
                    {label}
                  </TabsTab>
                ))}
              </TabsList>

              {/* ════ BUTTONS ════ */}
              <TabsPanel value="buttons" className="tabPanel">
                <Sect title="1. BUTTONS">
                  <div style={{ marginBottom: "10px" }}>
                    <div className="label" style={{ marginBottom: "6px" }}>Primary (filled):</div>
                    <Button variant="primary">Default</Button>
                    <Button variant="success" style={{ color: "var(--color-bg-black)" }}>Success</Button>
                    <Button variant="warning" style={{ color: "var(--color-bg-black)" }}>Warning</Button>
                    <Button variant="danger" style={{ color: "var(--color-bg-black)" }}>Danger</Button>
                    <Button variant="info" style={{ color: "var(--color-bg-black)" }}>Info</Button>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <div className="label" style={{ marginBottom: "6px" }}>Secondary (outlined):</div>
                    <Button variant="secondary">Default</Button>
                    <Button variant="secondary" style={{ borderColor: "var(--color-success)", color: "var(--color-success)" }}>Success</Button>
                    <Button variant="secondary" style={{ borderColor: "var(--color-warning)", color: "var(--color-warning)" }}>Warning</Button>
                    <Button variant="secondary" style={{ borderColor: "var(--color-danger)", color: "var(--color-danger)" }}>Danger</Button>
                    <Button variant="secondary" style={{ borderColor: "var(--color-info)", color: "var(--color-info)" }}>Info</Button>
                  </div>
                  <div>
                    <div className="label" style={{ marginBottom: "6px" }}>Sizes:</div>
                    <Button variant="primary" size="lg">Large</Button>
                    <Button variant="primary">Default</Button>
                    <Button variant="primary" size="sm">&lt;Small&gt;</Button>
                  </div>
                </Sect>

                <Sect title="2. TOOLTIPS">
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <TooltipProvider>
                      {(["top", "bottom", "left", "right"] as const).map((pos) => (
                        <TooltipRoot key={pos}>
                          <TooltipTrigger render={
                            <Button variant="secondary">
                              {pos.charAt(0).toUpperCase() + pos.slice(1)}
                            </Button>
                          } />
                          <TooltipPortal>
                            <TooltipPositioner side={pos}>
                              <TooltipPopup>Tooltip on {pos}</TooltipPopup>
                            </TooltipPositioner>
                          </TooltipPortal>
                        </TooltipRoot>
                      ))}
                    </TooltipProvider>
                  </div>
                </Sect>
              </TabsPanel>

              {/* ════ FORMS ════ */}
              <TabsPanel value="forms" className="tabPanel">
                <Sect title="3. FORM CONTROLS">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <span className="label">Username:</span>
                      <input className="input" defaultValue="DOS_USER" />
                      <span className="label">Password:</span>
                      <input className="input" type="password" defaultValue="*****" />
                      <span className="label">Number field:</span>
                      <NumberFieldRoot value={numVal} onValueChange={(v) => setNumVal(v ?? 0)} style={{ marginBottom: "8px" }}>
                        <NumberFieldGroup>
                          <NumberFieldDecrement>-</NumberFieldDecrement>
                          <NumberFieldInput />
                          <NumberFieldIncrement>+</NumberFieldIncrement>
                        </NumberFieldGroup>
                      </NumberFieldRoot>
                    </div>

                    <div style={{ flex: 1 }}>
                      <span className="label">Graphics adapter:</span>
                      <SelectRoot value={selectVal} onValueChange={(v) => setSelectVal(String(v ?? ""))}>
                        <SelectTrigger>
                          <SelectValue />
                          <span>▾</span>
                        </SelectTrigger>
                        <SelectPortal>
                          <SelectPositioner>
                            <SelectPopup>
                              <SelectList>
                                {SELECT_OPTIONS.map(({ v, l }) => (
                                  <SelectItem key={v} value={v}>
                                    {selectVal === v ? "√ " : "  "}{l}
                                  </SelectItem>
                                ))}
                              </SelectList>
                            </SelectPopup>
                          </SelectPositioner>
                        </SelectPortal>
                      </SelectRoot>

                      <div style={{ marginTop: "12px" }}>
                        <span className="label">Checkboxes:</span>
                        <Checkbox label=" Save credentials" checked={checked1} onCheckedChange={setChecked1} />
                        <Checkbox label=" Verbose logging" checked={checked2} onCheckedChange={setChecked2} />
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <span className="label">Toggle switch:</span>
                        <Switch label={switched ? "Enabled" : "Disabled"} checked={switched} onCheckedChange={setSwitched} />
                      </div>
                    </div>
                  </div>
                </Sect>

                <Sect title="4. RADIO GROUP">
                  <div className="infoBox">Select a graphics adapter from the choices below</div>
                  <RadioGroupRoot value={radioVal} onValueChange={(v) => setRadioVal(String(v ?? ""))}>
                    {RADIO_OPTIONS.map(({ v, l }) => (
                      <RadioRoot key={v} value={v} selected={radioVal === v}>
                        {l}
                      </RadioRoot>
                    ))}
                  </RadioGroupRoot>
                  <div style={{ marginTop: "8px" }} className="label">
                    √ = supported by your system &nbsp;|&nbsp; Use ↑,↓ and ENTER. ESC to go back. F1 for help.
                  </div>
                </Sect>

                <Sect title="5. SLIDER + PROGRESS">
                  <span className="label">CPU Clock: {sliderVal[0]} MHz</span>
                  <SliderRoot
                    value={sliderVal}
                    onValueChange={(v) => setSliderVal(Array.isArray(v) ? [...v] : [v])}
                    min={4}
                    max={40}
                    style={{ marginBottom: "12px" }}
                  >
                    <SliderControl>
                      <SliderTrack>
                        <SliderIndicator />
                        <SliderThumb />
                      </SliderTrack>
                    </SliderControl>
                  </SliderRoot>

                  <span className="label">Memory: {progVal}% used</span>
                  <ProgressRoot value={progVal} style={{ marginBottom: "8px" }}>
                    <ProgressTrack>
                      <ProgressIndicator style={{ width: `${progVal}%` }} />
                    </ProgressTrack>
                  </ProgressRoot>
                </Sect>
              </TabsPanel>

              {/* ════ ACCORDION ════ */}
              <TabsPanel value="accordion" className="tabPanel">
                <Sect title="6. ACCORDION">
                  <AccordionRoot defaultValue={["system"]}>
                    {ACCORDION_ITEMS.map(({ v, title, body }) => (
                      <AccordionItem key={v} value={v}>
                        <AccordionHeader>
                          <AccordionTrigger>{title}</AccordionTrigger>
                        </AccordionHeader>
                        <AccordionPanel>{body}</AccordionPanel>
                      </AccordionItem>
                    ))}
                  </AccordionRoot>
                </Sect>
              </TabsPanel>

              {/* ════ DIALOG ════ */}
              <TabsPanel value="dialog" className="tabPanel">
                <Sect title="7. DIALOG / MODAL">
                  <div className="infoBox">
                    Dialogs are windowed overlays. Click the button below to open one.
                  </div>
                  <DialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger render={<Button variant="secondary">Open Dialog</Button>} />
                    <DialogPortal>
                      <DialogBackdrop />
                      <DialogPopup>
                        <DialogTitleBar>
                          <span>■ SIERRA ON-LINE — SETUP.EXE</span>
                          <DialogClose render={<button className="dialogCloseBtn">✕</button>} />
                        </DialogTitleBar>
                        <DialogBody>
                          <DialogTitle className="dialogTitle">
                            Select Configuration
                          </DialogTitle>
                          <DialogDescription className="dialogDescription">
                            Use ↑ ↓ and ENTER to select. ESC to go back.
                          </DialogDescription>
                          <div className="infoBox">
                            Copyright 1991-92<br />Sierra On-Line, Inc.<br />All rights reserved.
                          </div>
                        </DialogBody>
                        <DialogFooter>
                          <DialogClose render={
                            <Button variant="secondary" style={{ borderColor: "var(--color-fg-dim)", color: "var(--color-fg-dim)" }}>
                              Cancel
                            </Button>
                          } />
                          <DialogClose render={
                            <Button variant="primary" style={{ background: "var(--color-accent-hi)", borderColor: "var(--color-accent-hi)", color: "var(--color-bg-black)" }}>
                              OK
                            </Button>
                          } />
                        </DialogFooter>
                      </DialogPopup>
                    </DialogPortal>
                  </DialogRoot>
                </Sect>

                <Sect title="8. DROPDOWN MENUS">
                  {[
                    { label: "File ▾", colorVar: "--color-fg-link", items: ["New", "Open", "Save", "Save As"], danger: "Exit" },
                    { label: "Edit ▾", colorVar: "--color-fg-dim", items: ["Cut", "Copy", "Paste", "Select All"] },
                    { label: "Themes ▾", colorVar: "--color-warning", items: ["Cerulean", "Default", "Slate", "Cyborg"] },
                  ].map(({ label, colorVar, items, danger }) => (
                    <MenuRoot key={label}>
                      <MenuTrigger render={
                        <Button variant="secondary" style={{ borderColor: `var(${colorVar})`, color: `var(${colorVar})` }}>
                          {label}
                        </Button>
                      } />
                      <MenuPortal>
                        <MenuPositioner>
                          <MenuPopup>
                            {items.map((item) => (
                              <MenuItem key={item}>{item}</MenuItem>
                            ))}
                            {danger && (
                              <>
                                <Separator />
                                <MenuItem danger>{danger}</MenuItem>
                              </>
                            )}
                          </MenuPopup>
                        </MenuPositioner>
                      </MenuPortal>
                    </MenuRoot>
                  ))}
                </Sect>
              </TabsPanel>

              {/* ════ TABLE ════ */}
              <TabsPanel value="table" className="tabPanel">
                <Sect title="9. DATA TABLE — DIR C:\COMPONENTS\*.*">
                  <table className="table">
                    <thead>
                      <tr>
                        {(["NAME", "TYPE", "SIZE", "STATUS"] as const).map((h) => (
                          <th key={h} className="th">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_DATA.map((row, i) => {
                        const sel = selectedRow === i;
                        const rowClass = sel
                          ? "trSelected"
                          : i % 2 === 0 ? "trOdd" : "trEven";
                        return (
                          <tr key={row.name} className={rowClass} onClick={() => setSelectedRow(i)}>
                            <td className="td" style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-link)" }}>{row.name}</td>
                            <td className="td" style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-text)" }}>{row.type}</td>
                            <td className="td" style={{ color: sel ? "var(--color-bg-black)" : "var(--color-fg-text)" }}>{row.size}</td>
                            <td className="td" style={{ color: sel ? "var(--color-bg-black)" : STATUS_VAR[row.status] }}>{row.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Sect>
              </TabsPanel>

              {/* ════ MISC ════ */}
              <TabsPanel value="misc" className="tabPanel">
                <Sect title="10. TYPOGRAPHY">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      {HEADING_SIZES.map(({ tag, size }) => (
                        <div key={tag} className="headingDemo" style={{ fontSize: size }}>
                          {tag.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 2 }}>
                      <div className="infoBox">Example body text</div>
                      <p className="bodyText">
                        Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque
                        penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                      </p>
                      <p className="finePrint" style={{ marginTop: "8px" }}>
                        This line of text is meant to be treated as fine print.
                      </p>
                    </div>
                  </div>
                </Sect>

                <Sect title="11. SEPARATORS">
                  <p className="bodyText" style={{ marginBottom: "8px" }}>Above the separator line.</p>
                  <Separator />
                  <p className="finePrint">Below the separator line.</p>
                </Sect>

                <Sect title="12. CODE BLOCK">
                  <pre className="codeBlock">
                    {`C:\\BASE-UI> npm install @base-ui/react\n\nadded 1 package in 0.386s\n\nC:\\BASE-UI> type README.TXT\n\nINSTALLATION COMPLETE.\nPress any key to continue_`}
                  </pre>
                </Sect>

                <Sect title="13. ASCII PROGRESS BAR">
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <AsciiProgressBar title="Rent" value={50} />
                    <AsciiProgressBar title="Health" value={100} />
                    <AsciiProgressBar title="Mana" value={25} />
                    <AsciiProgressBar title="XP" value={progVal} />
                  </div>
                </Sect>
              </TabsPanel>

            </TabsRoot>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="footer">
        BASE UI / BOOTSTRA.386 &nbsp;|&nbsp; Press F1 for help &nbsp;|&nbsp; ALT+F4 to quit &nbsp;|&nbsp; C:\BASE-UI&gt;_
      </div>
    </div>
  );
}
