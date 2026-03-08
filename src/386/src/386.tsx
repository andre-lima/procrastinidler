import { useState } from "react";
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

/* ─────────────────────────────────────────────────────────────
   BOOTSTRA.386 — Base UI Theme
   CGA palette:
     bg:       #0000aa  CGA blue
     bg-dark:  #000055  darker panel
     black:    #000000
     white:    #ffffff
     cyan:     #00aaaa  CGA cyan — headers, highlights
     hi-cyan:  #55ffff  bright cyan — links, active text
     yellow:   #ffff55  CGA bright yellow
     red:      #ff5555  CGA bright red
     green:    #55ff55  CGA bright green
     magenta:  #ff55ff  CGA bright magenta
     gray:     #aaaaaa
     dark-gray:#555555
───────────────────────────────────────────────────────────── */

// ── Type aliases ──────────────────────────────────────────────
type Styles = Record<string, CSSProperties>;

// ── Static style map ──────────────────────────────────────────
const S = {
  /* page */
  page: {
    background: "#0000aa",
    color: "#ffffff",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "14px",
    minHeight: "100vh",
  },

  /* ── NAVBAR ── */
  navbar: {
    background: "#000000",
    borderBottom: "1px solid #555555",
    display: "flex",
    alignItems: "stretch",
    height: "28px",
    padding: "0",
  },
  navBrand: {
    color: "#ff55ff",
    padding: "4px 12px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    borderRight: "1px solid #555555",
    fontSize: "13px",
  },
  navItem: {
    color: "#ffffff",
    padding: "4px 10px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
  },
  navItemActive: {
    background: "#ffffff",
    color: "#000000",
    fontWeight: "bold",
  },

  /* ── LAYOUT ── */
  container: { maxWidth: "960px", margin: "0 auto", padding: "12px 16px" },
  row: { display: "flex", gap: "0" },
  col3: { width: "25%", flexShrink: 0 } as CSSProperties,
  col9: { flex: 1 },

  /* ── SIDEBAR ── */
  sidebar: {
    background: "#000055",
    border: "1px solid #00aaaa",
    marginRight: "16px",
    padding: "4px 0",
  },
  sidebarItemActive: {
    background: "#00aaaa",
    color: "#ffffff",
    padding: "2px 12px",
    display: "block",
    cursor: "pointer",
    fontSize: "13px",
  },
  sidebarItem: {
    color: "#55ffff",
    padding: "2px 12px",
    display: "block",
    cursor: "pointer",
    fontSize: "13px",
    textDecoration: "none",
  },

  /* ── SECTION HEADER ── */
  sectionHeader: {
    background: "#00aaaa",
    color: "#ffffff",
    padding: "3px 12px",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "0",
    letterSpacing: "1px",
  },

  /* ── PANEL ── */
  panel: {
    border: "1px solid #00aaaa",
    marginBottom: "12px",
    background: "#000066",
  },
  panelInner: { padding: "10px 12px" },
  infoBox: {
    border: "1px solid #55ffff",
    padding: "8px 12px",
    marginBottom: "10px",
    color: "#55ffff",
    fontSize: "13px",
    background: "#000055",
  },

  /* ── TYPOGRAPHY ── */
  label: { color: "#aaaaaa", fontSize: "12px", marginBottom: "3px", display: "block" },

  /* ── ACCORDION ── */
  accTrigger: {
    width: "100%",
    background: "#000055",
    color: "#55ffff",
    border: "none",
    borderBottom: "1px solid #00aaaa",
    padding: "4px 12px",
    textAlign: "left" as const,
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
  },
  accPanel: {
    padding: "8px 12px",
    color: "#ffffff",
    fontSize: "13px",
    borderBottom: "1px solid #00aaaa",
    background: "#000066",
  },

  /* ── INPUT ── */
  input: {
    background: "#000000",
    border: "1px solid #00aaaa",
    color: "#55ffff",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    padding: "3px 8px",
    width: "100%",
    outline: "none",
    marginBottom: "8px",
  },

  /* ── CHECKBOX ── */
  checkRoot: {
    width: "14px",
    height: "14px",
    border: "1px solid #00aaaa",
    background: "#000000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    verticalAlign: "middle",
    marginRight: "6px",
  },
  checkIndicator: { color: "#55ffff", fontSize: "11px", lineHeight: 1 },

  /* ── SWITCH ── */
  switchRoot: {
    display: "inline-flex",
    border: "1px solid #00aaaa",
    background: "#000000",
    cursor: "pointer",
    padding: "0",
    width: "44px",
    height: "16px",
    position: "relative" as const,
    verticalAlign: "middle",
    marginRight: "8px",
  },
  switchThumb: {
    display: "block",
    width: "18px",
    height: "14px",
    background: "#555555",
    margin: "1px",
    transition: "transform 0.15s",
    fontSize: "8px",
    color: "#000",
    lineHeight: "14px",
    textAlign: "center" as const,
    fontFamily: '"DOS", "Courier New", Courier, monospace',
  },

  /* ── SLIDER ── */
  sliderRoot: {
    width: "100%",
    position: "relative" as const,
    height: "20px",
    display: "flex",
    alignItems: "center",
  },
  sliderTrack: {
    width: "100%",
    height: "8px",
    background: "#000000",
    border: "1px solid #00aaaa",
    position: "relative" as const,
  },
  sliderThumb: {
    width: "12px",
    height: "18px",
    background: "#55ffff",
    border: "none",
    position: "absolute" as const,
    top: "50%",
    transform: "translate(-50%,-50%)",
    cursor: "pointer",
    outline: "none",
  },

  /* ── PROGRESS ── */
  progTrack: { background: "#000000", border: "1px solid #00aaaa", height: "14px", width: "100%" },
  progFill: { height: "100%", background: "#00aaaa" },

  /* ── TABS ── */
  tabList: { display: "flex", borderBottom: "1px solid #00aaaa", marginBottom: "0" },
  tab: {
    padding: "3px 14px",
    border: "1px solid transparent",
    borderBottom: "none",
    background: "#000055",
    color: "#aaaaaa",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "-1px",
    marginRight: "2px",
    outline: "none",
  },
  tabActive: {
    padding: "3px 14px",
    border: "1px solid #00aaaa",
    borderBottom: "1px solid #000066",
    background: "#000066",
    color: "#55ffff",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    cursor: "pointer",
    marginBottom: "-1px",
    marginRight: "2px",
    outline: "none",
    fontWeight: "bold",
  },
  tabPanel: {
    border: "1px solid #00aaaa",
    borderTop: "none",
    padding: "10px 12px",
    background: "#000066",
    color: "#ffffff",
    fontSize: "13px",
  },

  /* ── SELECT ── */
  selectTrigger: {
    background: "#000000",
    border: "1px solid #00aaaa",
    color: "#55ffff",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    padding: "3px 8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    outline: "none",
  },
  selectPopup: {
    background: "#000055",
    border: "1px solid #00aaaa",
    zIndex: 100,
    minWidth: "160px",
  },
  selectOption: {
    padding: "3px 12px",
    color: "#55ffff",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
  },

  /* ── TOOLTIP ── */
  tooltipPopup: {
    background: "#00aaaa",
    color: "#000000",
    padding: "3px 8px",
    fontSize: "12px",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    border: "1px solid #55ffff",
  },

  /* ── DIALOG ── */
  dialogBackdrop: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 200,
  },
  dialogPopup: {
    background: "#000066",
    border: "2px solid #00aaaa",
    width: "420px",
    maxWidth: "90vw",
    boxShadow: "4px 4px 0 #000000",
  },
  dialogTitleBar: {
    background: "#00aaaa",
    color: "#ffffff",
    padding: "3px 10px",
    fontWeight: "bold",
    fontSize: "13px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
  },
  dialogBody: { padding: "14px 16px", color: "#ffffff", fontSize: "13px", lineHeight: 1.6 },
  dialogFooter: {
    padding: "8px 16px",
    borderTop: "1px solid #00aaaa",
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },

  /* ── MENU ── */
  menuPopup: {
    background: "#000055",
    border: "1px solid #00aaaa",
    zIndex: 100,
    minWidth: "140px",
    boxShadow: "2px 2px 0 #000000",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "3px 12px",
    color: "#55ffff",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
    textAlign: "left" as const,
    outline: "none",
  },
  menuSep: { borderTop: "1px solid #00aaaa", margin: "3px 0" },

  /* ── TABLE ── */
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: "13px" },
  th: {
    background: "#00aaaa",
    color: "#ffffff",
    padding: "2px 10px",
    textAlign: "left" as const,
    fontWeight: "normal",
    letterSpacing: "1px",
    border: "1px solid #55ffff",
  },
  td: {
    padding: "2px 10px",
    border: "1px solid #000055",
    color: "#ffffff",
  },
  trEven: { background: "#00004a" },
  trOdd: { background: "#000066" },
  trSelected: { background: "#00aaaa", color: "#000000" },

  /* ── NUMBER FIELD ── */
  numberRoot: { display: "flex", border: "1px solid #00aaaa" },
  numberBtn: {
    background: "#000055",
    color: "#55ffff",
    border: "none",
    borderRight: "1px solid #00aaaa",
    padding: "2px 8px",
    cursor: "pointer",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "14px",
  },
  numberInput: {
    background: "#000000",
    color: "#55ffff",
    border: "none",
    fontFamily: '"DOS", "Courier New", Courier, monospace',
    fontSize: "13px",
    padding: "2px 8px",
    width: "60px",
    textAlign: "center" as const,
    outline: "none",
  },
} as const satisfies Styles;

// ── Button style factories ─────────────────────────────────────
//
// Visual model — DOS raised-block look:
//   Resting : 4px bright-cyan shadow offset bottom-right → raised feel
//   Pressed : translate(3px, 3px) + shadow shrinks to 1px → "sinking" feel
//
// Shadow uses #00aaaa (CGA cyan) so it's clearly visible against the
// dark blue (#000066) panel background.
//
// The :active rule is injected once into <head> via a className — no
// onMouseDown/onMouseUp state needed.
//
// Primary   = gray filled bg, black text   (default call: no args)
// Secondary = blue outlined, cyan text

const BTN_SHADOW = "4px 4px 0 #333333";
const BTN_SHADOW_PRESSED = "1px 1px 0 #333333";
const BTN_FONT = '"DOS", "Courier New", Courier, monospace';

if (typeof document !== "undefined" && !document.getElementById("btn386-active-style")) {
  const tag = document.createElement("style");
  tag.id = "btn386-active-style";
  tag.textContent = `.btn386:active { transform: translate(3px, 3px) !important; box-shadow: ${BTN_SHADOW_PRESSED} !important; }`;
  document.head.appendChild(tag);
}

/** Primary — gray filled background, black text */
const btnStyle = (color = "#000000", bg = "#aaaaaa"): CSSProperties => ({
  border: `1px solid ${bg}`,
  borderRadius: 0,
  color,
  background: bg,
  padding: "5px 18px",
  fontFamily: BTN_FONT,
  fontSize: "13px",
  fontWeight: "bold",
  cursor: "pointer",
  marginRight: "8px",
  marginBottom: "8px",
  display: "inline-block",
  boxShadow: BTN_SHADOW,
  transition: "box-shadow 0.06s, transform 0.06s",
});

/** Secondary — blue outlined, cyan text, transparent background */
const btnActiveStyle = (color = "#55ffff", bg = "transparent"): CSSProperties => ({
  border: `1px solid ${color}`,
  borderRadius: 0,
  color,
  background: bg,
  padding: "5px 18px",
  fontFamily: BTN_FONT,
  fontSize: "13px",
  cursor: "pointer",
  marginRight: "8px",
  marginBottom: "8px",
  display: "inline-block",
  boxShadow: BTN_SHADOW,
  transition: "box-shadow 0.06s, transform 0.06s",
});

// ── Domain types ──────────────────────────────────────────────
interface TableRow {
  name: string;
  type: string;
  size: string;
  status: "STABLE" | "BETA" | "ALPHA";
}

interface AccordionEntry {
  v: string;
  title: string;
  body: string;
}

interface SelectOption {
  v: string;
  l: string;
}

interface RadioOption {
  v: string;
  l: string;
}

type TabId = "buttons" | "forms" | "accordion" | "dialog" | "table" | "misc";

// ── Helper components ─────────────────────────────────────────
interface SectProps {
  title: string;
  children: ReactNode;
}

const Sect = ({ title, children }: SectProps) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={S.sectionHeader}>{title}</div>
    <div style={{ ...S.panel, border: "1px solid #00aaaa" }}>
      <div style={S.panelInner}>{children}</div>
    </div>
  </div>
);

interface BtnProps {
  color?: string;
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
}

const Btn = ({ color = "#ffffff", active, children, onClick, style }: BtnProps) =>
  active ? (
    <button className="btn386" style={{ ...btnActiveStyle("#000000", color), ...style }} onClick={onClick}>
      {children}
    </button>
  ) : (
    <button className="btn386" style={{ ...btnStyle(color), ...style }} onClick={onClick}>
      {children}
    </button>
  );

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckboxRow = ({ label, checked, onChange }: CheckboxRowProps) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      marginBottom: "6px",
      cursor: "pointer",
      fontSize: "13px",
      color: "#ffffff",
    }}
  >
    <Checkbox.Root
      checked={checked}
      onCheckedChange={onChange}
      style={S.checkRoot}
      data-checked={checked || undefined}
    >
      <Checkbox.Indicator style={S.checkIndicator}>X</Checkbox.Indicator>
    </Checkbox.Root>
    {label}
  </label>
);

// ── Static data ───────────────────────────────────────────────
const NAV_LINKS: readonly string[] = [
  "Home",
  "Components",
  "Scaffolding",
  "Base CSS",
  "JavaScript",
  "Customize",
];

const SIDEBAR_ITEMS: readonly string[] = [
  "Download",
  "File structure",
  "What's included",
  "HTML template",
  "Examples",
  "What next?",
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
  {
    v: "system",
    title: "SYSTEM REQUIREMENTS",
    body: "CPU: Intel 386 SX or compatible | RAM: 640K | OS: MS-DOS 6.22 or React 18+ | VGA: Hercules monochrome preferred",
  },
  {
    v: "install",
    title: "INSTALLATION",
    body: "Run SETUP.EXE from the installation disk. Follow the on-screen prompts. Reboot when complete. Press F1 at any time for help.",
  },
  {
    v: "license",
    title: "LICENSE INFORMATION",
    body: 'This software is provided "as is". Not responsible for corrupted boot sectors, segmentation faults, or general protection faults.',
  },
  {
    v: "support",
    title: "TECHNICAL SUPPORT",
    body: "For assistance, contact your local BBS, post to USENET, or consult the printed manual. Average response time: 6-8 weeks.",
  },
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

const HEADING_SIZES: readonly [string, string][] = [
  ["h1", "24px"],
  ["h2", "20px"],
  ["h3", "17px"],
  ["h4", "15px"],
];

const STATUS_COLOR: Record<TableRow["status"], string> = {
  STABLE: "#55ff55",
  BETA: "#ffff55",
  ALPHA: "#ff5555",
};

// ── App ───────────────────────────────────────────────────────
export default function ExampleApp() {
  const [activeNav, setActiveNav] = useState<string>("Components");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [sliderVal, setSliderVal] = useState<number[]>([33]);
  const [progVal] = useState<number>(65);
  const [checked1, setChecked1] = useState<boolean>(true);
  const [checked2, setChecked2] = useState<boolean>(false);
  const [switched, setSwitched] = useState<boolean>(false);
  const [radioVal, setRadioVal] = useState<string>("vga256");
  const [numVal, setNumVal] = useState<number>(8);
  const [activeTab, setActiveTab] = useState<TabId>("buttons");
  const [selectVal, setSelectVal] = useState<string>("ega");

  return (
    <div style={S.page}>

      {/* ── NAVBAR ── */}
      <nav style={S.navbar}>
        <span style={S.navBrand}>Bootstrap</span>
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            style={{ ...S.navItem, ...(activeNav === link ? S.navItemActive : {}) }}
            onClick={() => setActiveNav(link)}
          >
            {link}
          </button>
        ))}
      </nav>

      {/* ── BREADCRUMB ── */}
      <div
        style={{
          background: "#000000",
          padding: "2px 16px",
          fontSize: "12px",
          color: "#aaaaaa",
          borderBottom: "1px solid #555555",
        }}
      >
        Overview of the project, its contents, and how to get started.
      </div>

      {/* ── BODY ── */}
      <div style={S.container}>
        <div style={S.row}>

          {/* ── SIDEBAR ── */}
          <div style={S.col3}>
            <div style={S.sidebar}>
              {SIDEBAR_ITEMS.map((item, i) => (
                <span key={item} style={i === 0 ? S.sidebarItemActive : S.sidebarItem}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div style={S.col9}>
            <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>

              <Tabs.List style={S.tabList}>
                {TABS.map(({ val, label }) => (
                  <Tabs.Tab key={val} value={val} style={activeTab === val ? S.tabActive : S.tab}>
                    {label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {/* ════ BUTTONS TAB ════ */}
              <Tabs.Panel value="buttons" style={S.tabPanel}>
                <Sect title="1. BUTTONS">
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ ...S.label, marginBottom: "6px" }}>Primary (gray filled):</div>
                    <Btn>Default</Btn>
                    <Btn color="#000000" style={{ background: "#55ffff", border: "1px solid #55ffff" }}>Primary</Btn>
                    <Btn color="#000000" style={{ background: "#55ff55", border: "1px solid #55ff55" }}>Success</Btn>
                    <Btn color="#000000" style={{ background: "#ffff55", border: "1px solid #ffff55" }}>Warning</Btn>
                    <Btn color="#000000" style={{ background: "#ff5555", border: "1px solid #ff5555" }}>Danger</Btn>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ ...S.label, marginBottom: "6px" }}>Secondary (blue outlined):</div>
                    <Btn active>Default</Btn>
                    <Btn active color="#55ffff">Primary</Btn>
                    <Btn active color="#55ff55">Success</Btn>
                    <Btn active color="#ffff55">Warning</Btn>
                    <Btn active color="#ff5555">Danger</Btn>
                  </div>
                  <div>
                    <div style={{ ...S.label, marginBottom: "6px" }}>Sizes:</div>
                    <button className="btn386" style={{ ...btnStyle("#55ffff"), padding: "8px 28px", fontSize: "15px" }}>
                      Large button
                    </button>
                    <button className="btn386" style={btnStyle("#aaaaaa")}>Default button</button>
                    <button className="btn386" style={{ ...btnStyle("#aaaaaa"), padding: "2px 10px", fontSize: "11px" }}>
                      &lt;Small button&gt;
                    </button>
                  </div>
                </Sect>

                <Sect title="2. TOOLTIPS">
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <Tooltip.Provider>
                      {(["top", "bottom", "left", "right"] as const).map((pos) => (
                        <Tooltip.Root key={pos}>
                          <Tooltip.Trigger
                            render={
                              <button className="btn386" style={btnStyle("#55ffff")}>
                                Tooltip {pos.charAt(0).toUpperCase() + pos.slice(1)}
                              </button>
                            }
                          />
                          <Tooltip.Portal>
                            <Tooltip.Positioner side={pos}>
                              <Tooltip.Popup style={S.tooltipPopup}>
                                Tooltip on {pos}
                              </Tooltip.Popup>
                            </Tooltip.Positioner>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      ))}
                    </Tooltip.Provider>
                  </div>
                </Sect>
              </Tabs.Panel>

              {/* ════ FORMS TAB ════ */}
              <Tabs.Panel value="forms" style={S.tabPanel}>
                <Sect title="3. FORM CONTROLS">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <span style={S.label}>Username:</span>
                      <input style={S.input} defaultValue="DOS_USER" />
                      <span style={S.label}>Password:</span>
                      <input style={S.input} type="password" defaultValue="*****" />
                      <span style={S.label}>Number field:</span>
                      <NumberField.Root
                        value={numVal}
                        onValueChange={(v) => setNumVal(v ?? 0)}
                        style={{ marginBottom: "8px" }}
                      >
                        <NumberField.Group style={S.numberRoot}>
                          <NumberField.Decrement
                            style={{ ...S.numberBtn, borderRight: "1px solid #00aaaa", borderLeft: "none" }}
                          >
                            -
                          </NumberField.Decrement>
                          <NumberField.Input style={S.numberInput} />
                          <NumberField.Increment
                            style={{ ...S.numberBtn, borderLeft: "1px solid #00aaaa", borderRight: "none" }}
                          >
                            +
                          </NumberField.Increment>
                        </NumberField.Group>
                      </NumberField.Root>
                    </div>

                    <div style={{ flex: 1 }}>
                      <span style={S.label}>Graphics adapter:</span>
                      <Select.Root value={selectVal} onValueChange={(v) => setSelectVal(v ?? "")}>
                        <Select.Trigger style={S.selectTrigger}>
                          <Select.Value />
                          <span>▾</span>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Positioner>
                            <Select.Popup style={S.selectPopup}>
                              <Select.List>
                                {SELECT_OPTIONS.map(({ v, l }) => (
                                  <Select.Item key={v} value={v} style={S.selectOption}>
                                    {selectVal === v ? "√ " : "  "}{l}
                                  </Select.Item>
                                ))}
                              </Select.List>
                            </Select.Popup>
                          </Select.Positioner>
                        </Select.Portal>
                      </Select.Root>

                      <div style={{ marginTop: "12px" }}>
                        <span style={S.label}>Checkboxes:</span>
                        <CheckboxRow label=" Save credentials" checked={checked1} onChange={setChecked1} />
                        <CheckboxRow label=" Verbose logging" checked={checked2} onChange={setChecked2} />
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <span style={S.label}>Toggle switch:</span>
                        <label style={{ display: "flex", alignItems: "center", cursor: "pointer", fontSize: "13px", color: "#ffffff" }}>
                          <Switch.Root
                            checked={switched}
                            onCheckedChange={setSwitched}
                            style={{ ...S.switchRoot, borderColor: switched ? "#55ffff" : "#00aaaa" }}
                          >
                            <Switch.Thumb
                              style={{
                                ...S.switchThumb,
                                transform: switched ? "translateX(26px)" : "translateX(0)",
                                background: switched ? "#55ffff" : "#555555",
                              }}
                            >
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
                  <div style={S.infoBox}>Select a graphics adapter from the choices below</div>
                  <RadioGroup value={radioVal} onValueChange={setRadioVal}>
                    {RADIO_OPTIONS.map(({ v, l }) => (
                      <Radio.Root
                        key={v}
                        value={v}
                        style={{ display: "flex", alignItems: "center", marginBottom: "5px", cursor: "pointer" }}
                      >
                        <span style={{ color: radioVal === v ? "#55ffff" : "#aaaaaa", marginRight: "6px", fontSize: "13px" }}>
                          {radioVal === v ? "√" : " "}
                        </span>
                        <Radio.Indicator keepMounted style={{ display: "none" }} />
                        <span style={{ color: radioVal === v ? "#55ffff" : "#ffffff", fontSize: "13px" }}>{l}</span>
                      </Radio.Root>
                    ))}
                  </RadioGroup>
                  <div style={{ marginTop: "8px", color: "#aaaaaa", fontSize: "12px" }}>
                    √ = supported by your system &nbsp;|&nbsp; Use ↑,↓ and ENTER to select. ESC to go back. F1 for help.
                  </div>
                </Sect>

                <Sect title="5. SLIDER + PROGRESS">
                  <span style={S.label}>CPU Clock: {sliderVal[0]} MHz</span>
                  <Slider.Root
                    value={sliderVal}
                    onValueChange={setSliderVal}
                    min={4}
                    max={40}
                    style={{ ...S.sliderRoot, marginBottom: "12px" }}
                  >
                    <Slider.Control style={{ width: "100%", position: "relative", height: "20px", display: "flex", alignItems: "center" }}>
                      <Slider.Track style={S.sliderTrack}>
                        <Slider.Indicator style={{ height: "100%", background: "#00aaaa" }} />
                        <Slider.Thumb style={S.sliderThumb} />
                      </Slider.Track>
                    </Slider.Control>
                  </Slider.Root>

                  <span style={S.label}>Memory: {progVal}% used</span>
                  <Progress.Root value={progVal} style={{ marginBottom: "8px" }}>
                    <Progress.Track style={S.progTrack}>
                      <Progress.Indicator style={{ ...S.progFill, width: `${progVal}%` }} />
                    </Progress.Track>
                  </Progress.Root>
                </Sect>
              </Tabs.Panel>

              {/* ════ ACCORDION TAB ════ */}
              <Tabs.Panel value="accordion" style={S.tabPanel}>
                <Sect title="6. ACCORDION">
                  <Accordion.Root defaultValue={["system"]}>
                    {ACCORDION_ITEMS.map(({ v, title, body }) => (
                      <Accordion.Item key={v} value={v} style={{ border: "1px solid #00aaaa", marginBottom: "-1px" }}>
                        <Accordion.Header>
                          <Accordion.Trigger style={S.accTrigger}>
                            <span>{title}</span>
                            <span style={{ color: "#aaaaaa" }}>▾</span>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel style={S.accPanel}>{body}</Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </Sect>
              </Tabs.Panel>

              {/* ════ DIALOG TAB ════ */}
              <Tabs.Panel value="dialog" style={S.tabPanel}>
                <Sect title="7. DIALOG / MODAL">
                  <div style={S.infoBox}>
                    Dialogs are windowed overlays. Click the button below to open one.
                  </div>
                  <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Dialog.Trigger render={<button className="btn386" style={btnStyle("#55ffff")}>Open Dialog</button>} />
                    <Dialog.Portal>
                      <Dialog.Backdrop style={S.dialogBackdrop} />
                      <Dialog.Popup style={S.dialogPopup}>
                        <div style={S.dialogTitleBar}>
                          <span>■ SIERRA ON-LINE — SETUP.EXE</span>
                          <Dialog.Close
                            render={
                              <button style={{ background: "#000066", border: "1px solid #555", borderRadius: 0, color: "#fff", cursor: "pointer", padding: "0 6px", fontFamily: BTN_FONT }}>
                                ✕
                              </button>
                            }
                          />
                        </div>
                        <div style={S.dialogBody}>
                          <Dialog.Title style={{ color: "#55ffff", fontSize: "14px", marginBottom: "8px", fontWeight: "bold" }}>
                            Select Configuration
                          </Dialog.Title>
                          <Dialog.Description style={{ color: "#aaaaaa", fontSize: "12px", marginBottom: "12px" }}>
                            Use ↑ ↓ and ENTER to select. ESC to go back.
                          </Dialog.Description>
                          <div style={S.infoBox}>
                            Copyright 1991-92<br />Sierra On-Line, Inc.<br />All rights reserved.
                          </div>
                        </div>
                        <div style={S.dialogFooter}>
                          <Dialog.Close render={<button className="btn386" style={btnStyle("#aaaaaa")}>Cancel</button>} />
                          <Dialog.Close render={<button className="btn386" style={btnActiveStyle("#000000", "#55ffff")}>OK</button>} />
                        </div>
                      </Dialog.Popup>
                    </Dialog.Portal>
                  </Dialog.Root>
                </Sect>

                <Sect title="8. DROPDOWN MENUS">
                  {(
                    [
                      { label: "File ▾", color: "#55ffff", items: ["New", "Open", "Save", "Save As"], danger: "Exit" },
                      { label: "Edit ▾", color: "#aaaaaa", items: ["Cut", "Copy", "Paste", "Select All"] },
                      { label: "Themes ▾", color: "#ffff55", items: ["Cerulean", "Default", "Slate", "Cyborg"] },
                    ] as Array<{ label: string; color: string; items: readonly string[]; danger?: string }>
                  ).map(({ label, color, items, danger }) => (
                    <Menu.Root key={label}>
                      <Menu.Trigger render={<button className="btn386" style={btnStyle(color)}>{label}</button>} />
                      <Menu.Portal>
                        <Menu.Positioner>
                          <Menu.Popup style={S.menuPopup}>
                            {items.map((item) => (
                              <Menu.Item key={item} style={S.menuItem}>{item}</Menu.Item>
                            ))}
                            {danger && (
                              <>
                                <Separator style={S.menuSep} />
                                <Menu.Item style={{ ...S.menuItem, color: "#ff5555" }}>{danger}</Menu.Item>
                              </>
                            )}
                          </Menu.Popup>
                        </Menu.Positioner>
                      </Menu.Portal>
                    </Menu.Root>
                  ))}
                </Sect>
              </Tabs.Panel>

              {/* ════ TABLE TAB ════ */}
              <Tabs.Panel value="table" style={S.tabPanel}>
                <Sect title="9. DATA TABLE — DIR C:\COMPONENTS\*.*">
                  <table style={S.table}>
                    <thead>
                      <tr>
                        {(["NAME", "TYPE", "SIZE", "STATUS"] as const).map((h) => (
                          <th key={h} style={S.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_DATA.map((row, i) => {
                        const isSelected = selectedRow === i;
                        const rowStyle: CSSProperties = isSelected ? S.trSelected : i % 2 === 0 ? S.trOdd : S.trEven;
                        return (
                          <tr key={row.name} style={rowStyle} onClick={() => setSelectedRow(i)}>
                            <td style={{ ...S.td, color: isSelected ? "#000000" : "#55ffff" }}>{row.name}</td>
                            <td style={{ ...S.td, color: isSelected ? "#000000" : "#ffffff" }}>{row.type}</td>
                            <td style={{ ...S.td, color: isSelected ? "#000000" : "#ffffff" }}>{row.size}</td>
                            <td style={{ ...S.td, color: isSelected ? "#000000" : STATUS_COLOR[row.status] }}>{row.status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Sect>
              </Tabs.Panel>

              {/* ════ MISC TAB ════ */}
              <Tabs.Panel value="misc" style={S.tabPanel}>
                <Sect title="10. TYPOGRAPHY">
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      {HEADING_SIZES.map(([tag, size]) => (
                        <div key={tag} style={{ background: "#00aaaa", color: "#ffffff", padding: "2px 8px", marginBottom: "5px", fontSize: size, fontWeight: "bold" }}>
                          {tag.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div style={{ flex: 2 }}>
                      <div style={S.infoBox}>Example body text</div>
                      <p style={{ color: "#ffffff", fontSize: "13px", marginBottom: "8px", lineHeight: 1.6 }}>
                        Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                      </p>
                      <p style={{ color: "#aaaaaa", fontSize: "12px", fontStyle: "italic" }}>
                        This line of text is meant to be treated as fine print.
                      </p>
                    </div>
                  </div>
                </Sect>

                <Sect title="11. SEPARATORS">
                  <p style={{ color: "#ffffff", fontSize: "13px", marginBottom: "8px" }}>Above the separator line.</p>
                  <Separator style={{ border: "none", borderTop: "1px solid #00aaaa", margin: "8px 0" }} />
                  <p style={{ color: "#aaaaaa", fontSize: "13px" }}>Below the separator line.</p>
                </Sect>

                <Sect title="12. CODE BLOCK">
                  <pre style={{ background: "#000000", border: "1px solid #00aaaa", color: "#55ffff", padding: "10px 12px", fontSize: "12px", overflowX: "auto", lineHeight: 1.5 }}>
                    {`C:\\BASE-UI> npm install @base-ui/react\n\nadded 1 package in 0.386s\n\nC:\\BASE-UI> type README.TXT\n\nINSTALLATION COMPLETE.\nPress any key to continue_`}
                  </pre>
                </Sect>
              </Tabs.Panel>

            </Tabs.Root>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: "#000000", borderTop: "1px solid #555555", padding: "4px 16px", fontSize: "11px", color: "#555555", textAlign: "center" }}>
        BASE UI / BOOTSTRA.386 THEME &nbsp;|&nbsp; Press F1 for help &nbsp;|&nbsp; ALT+F4 to quit &nbsp;|&nbsp; C:\BASE-UI&gt;_
      </div>
    </div>
  );
}