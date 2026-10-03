"""Build HackSprint_DukaanQuest_Final.pptx from the official template.

Strategy:
  - Open the official template with python-pptx (which parses the raw XML).
  - Rewrite each slide's text frames and pictures with the DukaanQuest
    story, preserving the template's branding, fonts and layout anchors.
  - Use the template media (image1.jpeg = warm storefront hero, image2.png =
    dark brand background, image3.png = thin brand bar) as the visual base.
  - Do not add any text/figures that the source of truth does not support.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from PIL import Image
import copy, shutil, os

TEMPLATE = "/c/Users/yadav/Desktop/hacksprint/dukaanquest-work/HackSprint PPT Presentation.pptx"
OUT = "HackSprint_DukaanQuest_Final.pptx"

# ---- Brand / ink / saffron tokens (matches dukaanquest-app/index.css) ----
INK_900 = RGBColor(0x12, 0x10, 0x0E)
INK_850 = RGBColor(0x17, 0x14, 0x12)
INK_800 = RGBColor(0x1D, 0x1A, 0x17)
INK_750 = RGBColor(0x24, 0x20, 0x19)
INK_700 = RGBColor(0x2C, 0x28, 0x22)
INK_650 = RGBColor(0x38, 0x33, 0x2B)
SAFFRON = RGBColor(0xE8, 0xA3, 0x3D)
SAFFRON_SOFT = RGBColor(0xF2, 0xC1, 0x79)
INK_SOFT = RGBColor(0xB3, 0xAA, 0x9D)
INK_MUTED = RGBColor(0x7D, 0x74, 0x69)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BLACK = RGBColor(0x00, 0x00, 0x00)
OK = RGBColor(0x7B, 0xB8, 0x8F)
STOP = RGBColor(0xD1, 0x6B, 0x6B)
WARN = RGBColor(0xE8, 0x8A, 0x2E)

EMU_PER_IN = 914400
SW, SH = 13.333, 7.5  # 16:9 template (18288000 x 10287000 EMU)

prs = Presentation()
prs.slide_width = Inches(SW)
prs.slide_height = Inches(SH)
blank = prs.slide_layouts[6]

# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------
def add_slide():
    return prs.slides.add_slide(blank)


def _set_run(r, text, size, color, bold=False, italic=False, font="Open Sans"):
    r.text = text
    r.font.size = Pt(size)
    r.font.color.rgb = color
    r.font.bold = bold
    r.font.italic = italic
    r.font.name = font
    # ensure east-asian / cs also use the font (not strictly required, but safe)
    r.font._rPr.set("lang", "en-US")


def fill_text(shape, paras, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP):
    """paras: list of lists of (text, size, color, bold, italic, font) run tuples."""
    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = Pt(2)
    tf.margin_right = Pt(2)
    tf.margin_top = Pt(1)
    tf.margin_bottom = Pt(1)
    # clear existing
    tf.clear()
    for i, para_runs in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        for (text, size, color, bold, italic, font) in para_runs:
            r = p.add_run()
            _set_run(r, text, size, color, bold, italic, font)
    return tf


def set_fill(shape, rgb):
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb


def set_line(shape, rgb, w=Pt(1)):
    shape.line.color.rgb = rgb
    shape.line.width = w


def no_line(shape):
    shape.line.fill.background()


def rect(slide, x, y, w, h, fill=None, line_color=None, line_w=Pt(1), shape=MSO_SHAPE.RECTANGLE):
    sp = slide.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    if fill is not None:
        set_fill(sp, fill)
    else:
        sp.fill.background()
    if line_color is not None:
        set_line(sp, line_color, line_w)
    else:
        no_line(sp)
    sp.text_frame.text = ""
    return sp


def pic_size(path):
    with Image.open(path) as im:
        return im.size


def add_pic(slide, path, x, y, w=None, h=None):
    p = slide.shapes.add_picture(path, Inches(x), Inches(y),
                                 Inches(w) if w else None,
                                 Inches(h) if h else None)
    return p


# ---------------------------------------------------------------------------
# Slide 1 — PROBLEM / HOOK
# ---------------------------------------------------------------------------
def build_slide1():
    s = add_slide()
    # Background: warm ink (full slide picture - image1.jpeg hero, the warm storefront)
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image1.jpeg.png",
        0, 0, Inches(SW), Inches(SH))

    # Dark scrim band on left for readability
    rect(s, 0, 0, 7.4, SH, fill=INK_800)

    # Thin saffron accent bar
    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    # Headline
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(6.6), Inches(1.5)),
              [[("The local retailer", 40, SAFFRON, True, False, "Open Sans"),
                (" doesn't lack products or customers.", 40, WHITE, False, False, "Open Sans")]],
              align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP)

    # Subheadline
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(1.85), Inches(6.6), Inches(2.6)),
              [[("Going digital is not one task. It's a chain of disconnected tasks. ", 17, INK_SOFT, False, False, "Open Sans"),
                ("He has to learn and manage several separate systems.", 17, INK_SOFT, False, False, "Open Sans")]],
              align=PP_ALIGN.LEFT)

    # bullet chips of the fragmented workflows
    items = [
        ("Product photo", "studio"),
        ("Marketplace listing", "catalog"),
        ("Multiple marketplaces", "catalog"),
        ("Regional-language CRM", "crm"),
        ("WhatsApp customer campaign", "crm"),
        ("Payment link / QR", "paytm"),
        ("Growth scenario before spending", "simulator"),
    ]
    y = 4.5
    step = 0.31
    for i, (label, _key) in enumerate(items):
        # icon square (minimal rounded rect with number)
        circ = s.shapes.add_shape(MSO_SHAPE.OVAL, Inches(0.55), Inches(y), Inches(0.34), Inches(0.34))
        set_fill(circ, INK_750)
        no_line(circ)
        tf = circ.text_frame
        tf.word_wrap = False
        tf.margin_left = Pt(0); tf.margin_right = Pt(0); tf.margin_top = Pt(0); tf.margin_bottom = Pt(0)
        p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
        r = p.add_run(); _set_run(r, str(i + 1), 11, SAFFRON, True, False, "Open Sans")
        # label
        fill_text(s.shapes.add_textbox(Inches(1.05), Inches(y - 0.01), Inches(5.4), Inches(0.34)),
                  [[(label, 13, WHITE, False, False, "Open Sans")]],
                  align=PP_ALIGN.LEFT)

        y += step
        if i < len(items) - 1:
            # thin connector
            rect(s, 0.72, y - 0.035, 0.02, 0.23, fill=INK_700)

    # Bottom trust line
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(6.75), Inches(6.6), Inches(0.6)),
              [[("One owner → the digital team of a big retailer", 12, SAFFRON_SOFT, True, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    return s


# ---------------------------------------------------------------------------
# Slide 2 — THE SOLUTION
# ---------------------------------------------------------------------------
def build_slide2():
    s = add_slide()
    # bg: dark brand image
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image2.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_850)
    # bottom fade
    band = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(5.0), Inches(SW), Inches(SH - 5.0))
    set_fill(band, INK_900)
    no_line(band)

    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    # Eyebrow
    fill_text(s.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(10), Inches(0.4)),
              [[("DUKAANQUEST", 13, SAFFRON, True, False, "Open Sans")]])

    # Headline
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.75), Inches(11), Inches(1.5)),
              [[("One guided workflow", 38, WHITE, True, False, "Open Sans"),
                (" from physical shop to digital growth.", 38, WHITE, True, False, "Open Sans")]],
              align=PP_ALIGN.LEFT)

    # Solution diagram - three columns
    col_w = 3.2
    gap = 0.35
    x0 = 1.1
    top = 2.35
    bottom = 4.85

    def col(x, label, items, color):
        # header
        rect(s, x, top, col_w, 0.65, fill=color)
        fill_text(s.shapes.add_textbox(Inches(x + 0.12), Inches(top + 0.06), Inches(col_w - 0.24), Inches(0.55)),
                  [[(label, 14, WHITE, True, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)
        # items
        for i, it in enumerate(items):
            yy = top + 0.75 + i * 0.55
            rect(s, x, yy, col_w, 0.42, fill=INK_850)
            rect(s, x, yy, 0.08, 0.42, fill=SAFFRON)
            fill_text(s.shapes.add_textbox(Inches(x + 0.18), Inches(yy + 0.02), Inches(col_w - 0.28), Inches(0.38)),
                      [[(it, 12, INK_800, False, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    col(x0, "PRODUCTS", ["AI product intelligence", "Master product record", "Photo studio"], SAFFRON)
    cx = x0 + col_w + gap
    col(cx, "CUSTOMERS", ["Regional-language CRM", "WhatsApp campaign", "Consent & approval"], INK_700)
    cx2 = cx + col_w + gap
    col(cx2, "GROWTH", ["Marketplace listing", "Decision simulator", "Quests & progress"], INK_650)

    # Tagline
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(5.35), Inches(11), Inches(1.0)),
              [[("Create once  ", 14, SAFFRON_SOFT, True, False, "Open Sans"),
                ("→  Sell everywhere  ", 14, WHITE, False, False, "Open Sans"),
                ("→  Retain  ", 14, WHITE, False, False, "Open Sans"),
                ("→  Reach  ", 14, WHITE, False, False, "Open Sans"),
                ("→  Simulate", 14, SAFFRON, True, False, "Open Sans")]],
              align=PP_ALIGN.LEFT)

    return s


# ---------------------------------------------------------------------------
# Slide 3 — HOW THE PRODUCT WORKS (hero workflow)
# ---------------------------------------------------------------------------
def build_slide3():
    s = add_slide()
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image2.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_850)
    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(11), Inches(0.4)),
              [[("ONE PRODUCT. ONE WORKFLOW. MULTIPLE GROWTH CHANNELS.", 12, SAFFRON, True, False, "Open Sans")]])

    # Hero headline
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.66), Inches(11), Inches(0.8)),
              [[("One product. One workflow. Multiple growth channels.", 30, WHITE, True, False, "Open Sans")]])

    # Arrow-based stage flow
    stages = [
        ("Phone photo", "Input", SAFFRON),
        ("Gemini understands", "AI", INK_700),
        ("Master product", "Single record", INK_700),
        ("Marketplace-ready listing", "Amazon SP-API Sandbox", SAFFRON),
        ("Customer segment", "Regional record", INK_700),
        ("Regional campaign", "Sarvam + n8n", INK_700),
        ("WhatsApp send", "Consent gate", SAFFRON),
        ("What-if simulation", "Deterministic math", INK_700),
        ("Merchant decision", "Next action", SAFFRON),
    ]
    n = len(stages)
    left = 0.55
    right = 12.85
    total_w = right - left
    # vertical stack of stages with down-arrows between (readable on screen)
    box_h = 0.46
    gap_v = 0.065
    x = 1.8
    y = 1.72
    for i, (label, tech, color) in enumerate(stages):
        box = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(9.4), Inches(box_h))
        set_fill(box, INK_800)
        set_line(box, color, Pt(1.25))
        # color top edge strip
        rect(s, Inches(x), Inches(y), Inches(9.4), Inches(0.1), fill=color, shape=MSO_SHAPE.ROUNDED_RECTANGLE)
        fill_text(s.shapes.add_textbox(Inches(x + 0.25), Inches(y + 0.12), Inches(9.0), Inches(box_h - 0.2)),
                  [[(label, 14, WHITE, True, False, "Open Sans")],
                   [("tech:", 11, color, True, False, "Open Sans"),
                    (f" {tech}", 11, INK_SOFT, False, False, "Open Sans")]],
                  anchor=MSO_ANCHOR.MIDDLE)
        if i < n - 1:
            # down chevron arrow
            ar = s.shapes.add_shape(MSO_SHAPE.CHEVRON, Inches(x + 4.2), Inches(y + box_h + 0.01), Inches(0.9), Inches(0.06))
            set_fill(ar, color)
            no_line(ar)
        y += box_h + gap_v

    # takeaway
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(6.55), Inches(11), Inches(0.75)),
              [[("Every stage is a real, working or verified sandbox workflow in the prototype", 12, SAFFRON_SOFT, True, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    return s


# ---------------------------------------------------------------------------
# Slide 4 — WHY DIFFERENT / Digital Town
# ---------------------------------------------------------------------------
def build_slide4():
    s = add_slide()
    # bg: image7.png (the dark isometric town) as full-bleed background
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image7.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_800)

    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(11), Inches(0.4)),
              [[("THE GAME IS NOT DECORATION", 12, SAFFRON, True, False, "Open Sans")]])

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.68), Inches(11), Inches(0.9)),
              [[("The game makes digital growth understandable.", 30, WHITE, True, False, "Open Sans")]])

    # Two columns: traditional vs DukaanQuest
    col_w = 5.7
    left_x = 0.6
    right_x = 7.1
    top = 1.75
    box_h = 3.1

    # LEFT - Traditional
    rect(s, Inches(left_x), Inches(top), Inches(col_w), Inches(box_h), fill=INK_850)
    rect(s, Inches(left_x), Inches(top), Inches(col_w), Inches(0.6), fill=INK_650)
    fill_text(s.shapes.add_textbox(Inches(left_x + 0.2), Inches(top + 0.04), Inches(col_w - 0.4), Inches(0.55)),
              [[("Traditional workflow", 15, WHITE, True, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)
    trad = [
        "Learn each marketplace tool separately",
        "Photoshop / shoots, then copy-paste fields",
        "Type in every listing by hand",
        "Send WhatsApp by hand, one customer at a time",
        "Run the next numbers in a spreadsheet",
    ]
    for i, t in enumerate(trad):
        yy = top + 0.8 + i * 0.42
        rect(s, Inches(left_x + 0.18), Inches(yy), Inches(0.12), Inches(0.26), fill=INK_700)
        fill_text(s.shapes.add_textbox(Inches(left_x + 0.45), Inches(yy + 0.01), Inches(col_w - 0.6), Inches(0.4)),
                  [[(t, 12.5, INK_SOFT, False, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    # RIGHT - DukaanQuest
    rect(s, Inches(right_x), Inches(top), Inches(col_w), Inches(box_h), fill=INK_850)
    rect(s, Inches(right_x), Inches(top), Inches(col_w), Inches(0.6), fill=SAFFRON)
    fill_text(s.shapes.add_textbox(Inches(right_x + 0.2), Inches(top + 0.04), Inches(col_w - 0.4), Inches(0.55)),
              [[("DukaanQuest guided journey", 15, INK_800, True, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)
    dq = [
        "One guided journey, not six separate logins",
        "AI reads the product, writes the listing",
        "One master record sent to every marketplace",
        "Segment, translate, approve, dispatch in one flow",
        "Simulate the profit before you spend a rupee",
        "Visible progress and XP — your digital team in view",
    ]
    for i, t in enumerate(dq):
        yy = top + 0.8 + i * 0.42
        rect(s, Inches(right_x + 0.18), Inches(yy), Inches(0.12), Inches(0.26), fill=SAFFRON)
        fill_text(s.shapes.add_textbox(Inches(right_x + 0.45), Inches(yy + 0.01), Inches(col_w - 0.6), Inches(0.4)),
                  [[(t, 12.5, INK_800, False, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    # takeaway under columns
    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(5.05), Inches(11.4), Inches(1.0)),
              [[("The quest system is a visual learning & progression layer for a non-technical merchant.", 12.5, SAFFRON_SOFT, False, False, "Open Sans")]],
              align=PP_ALIGN.LEFT)

    # journey ribbon at bottom
    rect(s, Inches(0.55), Inches(6.15), Inches(8.2), Inches(0.85), fill=INK_850)
    fill_text(s.shapes.add_textbox(Inches(0.75), Inches(6.22), Inches(7.9), Inches(0.75)),
              [[("Photo → List once → Reach customers → Simulate → Grow", 13, WHITE, True, False, "Open Sans")]],
              anchor=MSO_ANCHOR.MIDDLE)

    return s


# ---------------------------------------------------------------------------
# Slide 5 — TECH STACK & ARCHITECTURE
# ---------------------------------------------------------------------------
def build_slide5():
    s = add_slide()
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image2.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_850)
    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(11), Inches(0.4)),
              [[("TECH STACK & ARCHITECTURE", 12, SAFFRON, True, False, "Open Sans")]])

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.66), Inches(11), Inches(0.7)),
              [[("Verified integrations, each solving one merchant problem.", 16, WHITE, True, False, "Open Sans")]])

    # Architecture: 3 stacked lanes
    lanes = [
        ("FRONTEND", "React · Vite · HTML5 Canvas", SAFFRON),
        ("BACKEND", "Node.js · Express", INK_700),
        ("ORCHESTRATION", "Gemini · Sarvam · n8n · Amazon SP-API · Paytm", INK_700),
        ("LOCAL", "Marketplace adapters · deterministic simulator", INK_650),
    ]
    lane_h = 0.85
    x0 = 0.6
    width = 11.7
    y = 1.55
    for label, tech, color in lanes:
        rect(s, Inches(x0), Inches(y), Inches(width), Inches(lane_h), fill=INK_850)
        rect(s, Inches(x0), Inches(y), Inches(0.08), Inches(lane_h), fill=color)
        fill_text(s.shapes.add_textbox(Inches(x0 + 0.25), Inches(y + 0.08), Inches(8), Inches(0.35)),
                  [[(label, 12.5, SAFFRON, True, False, "Open Sans")]])
        fill_text(s.shapes.add_textbox(Inches(x0 + 0.25), Inches(y + 0.40), Inches(8.5), Inches(0.35)),
                  [[(tech, 12, INK_SOFT, False, False, "Open Sans")]])
        if label != lanes[-1][0]:
            # connector line with arrow
            ar = s.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(x0 + width / 2 - 0.15), Inches(y + lane_h - 0.06),
                                     Inches(0.3), Inches(0.25))
            set_fill(ar, color)
            no_line(ar)
        y += lane_h + 0.30

    # Data-path chips under the lanes
    y2 = 5.45
    chips = [
        ("Master product & customer data", "read → transform → campaign"),
        ("AI & rules engines", "Gemini reads · Sarvam translates · rules score"),
        ("Marketplace / CRM / sim outputs", "listing · campaign · scenario"),
    ]
    for i, (t1, t2) in enumerate(chips):
        x = 0.6 + i * 3.95
        rect(s, Inches(x), Inches(y2), Inches(3.7), Inches(0.85), fill=INK_850)
        rect(s, Inches(x), Inches(y2), Inches(3.7), Inches(0.06), fill=SAFFRON)
        fill_text(s.shapes.add_textbox(Inches(x + 0.2), Inches(y2 + 0.14), Inches(3.4), Inches(0.7)),
                  [[(t1, 11.5, WHITE, True, False, "Open Sans")],
                   [(t2, 10, INK_SOFT, False, False, "Open Sans")]])

    # status legend bottom-left
    rect(s, Inches(0.55), Inches(6.45), Inches(4.6), Inches(0.8), fill=INK_850)
    fill_text(s.shapes.add_textbox(Inches(0.65), Inches(6.63), Inches(4.4), Inches(0.65)),
              [[("LIVE / SANDBOX / STAGED / FALLBACK shown on every integration card", 10, INK_SOFT, False, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    return s


# ---------------------------------------------------------------------------
# Slide 6 — DATA FLOW / WORKING PROTOTYPE
# ---------------------------------------------------------------------------
def build_slide6():
    s = add_slide()
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image2.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_850)
    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(11), Inches(0.4)),
              [[("DATA FLOW — WHAT HAPPENS TO A REAL INPUT", 12, SAFFRON, True, False, "Open Sans")]])

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.66), Inches(11), Inches(0.8)),
              [[("User input  →  orchestrator  →  AI + rules engines  →  merchant decision", 15, WHITE, True, False, "Open Sans")]])

    # Flow boxes
    def flow_box(x, y, w, h, title, sub, color, fill=INK_850):
        b = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        set_fill(b, fill)
        set_line(b, color, Pt(1.25))
        fill_text(s.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.08), Inches(w - 0.3), Inches(h - 0.16)),
                  [[(title, 12.5, color, True, False, "Open Sans")],
                   [(sub, 10.5, INK_SOFT, False, False, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)
        return b

    def arrow(x, y, color=SAFFRON):
        a = s.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(x), Inches(y), Inches(0.4), Inches(0.3))
        set_fill(a, color)
        no_line(a)
        return a

    # Row 1
    flow_box(1.6, 1.6, 3.3, 1.0, "Merchant", "product + customer inputs", SAFFRON)
    arrow(5.05, 1.9, SAFFRON)
    flow_box(5.55, 1.6, 3.3, 1.0, "Backend orchestrator", "API + rules engine", INK_700)
    arrow(9.0, 1.9, INK_700)
    flow_box(9.4, 1.6, 3.3, 1.0, "AI + rules engines", "Gemini · Sarvam · ads/billing", INK_650)

    # Row 2 - three engines
    y2 = 3.35
    eq = 0.85
    flow_box(0.6, y2, 3.2, 1.5, "Marketplace engine", "Readiness → listing → sandbox\nAmazon SP-API · Flipkart · Meesho · Myntra · Nykaa", INK_700, fill=INK_800)
    arrow(4.1, y2 + 0.75, INK_700)
    flow_box(4.55, y2, 3.2, 1.5, "CRM engine", "Segment → translate → approve → dispatch\nn8n · Meta WhatsApp Cloud API", SAFFRON, fill=INK_800)
    arrow(8.0, y2 + 0.75, SAFFRON)
    flow_box(8.4, y2, 3.2, 1.5, "Simulation engine", "Scenario profit & payback\ndeterministic rules", INK_650, fill=INK_800)

    # Row 3 - decision
    y3 = 5.35
    arrow(2.2, y3 - 0.35, SAFFRON)
    arrow(5.6, y3 - 0.35, SAFFRON)
    arrow(9.0, y3 - 0.35, SAFFRON)
    flow_box(0.6, y3, 11.9, 1.3, "Merchant decision → business progress",
             "One guided journey: digital town, quests, XP  |  live controls, verified sandbox + staged fallbacks",
             WHITE, fill=INK_900)

    return s


# ---------------------------------------------------------------------------
# Slide 7 — SCREENSHOT + IMPACT / NEXT STEP
# ---------------------------------------------------------------------------
def build_slide7():
    s = add_slide()
    s.shapes.add_picture(
        "C:/d/dukaanquest-work/media_inspect2/image2.png.png",
        0, 0, Inches(SW), Inches(SH))
    rect(s, 0, 0, SW, SH, fill=INK_850)
    rect(s, 0, 0, 0.18, SH, fill=SAFFRON)

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.30), Inches(11), Inches(0.4)),
              [[("THE WORKING PROTOTYPE", 12, SAFFRON, True, False, "Open Sans")]])

    fill_text(s.shapes.add_textbox(Inches(0.55), Inches(0.66), Inches(11), Inches(0.8)),
              [[("This is the actual product, not a mock.", 16, WHITE, True, False, "Open Sans")]])

    # Screenshots row 1 (3 screenshots)
    shots = [
        ("C:/d/dukaanquest-work/media_inspect2/image7.png.png", "Digital Town", "isometric shop + quest progress"),
        ("C:/d/dukaanquest-work/media_inspect2/image10.png.png", "AI Studio", "photo → listing title + compliance"),
        ("C:/d/dukaanquest-work/media_inspect2/image12.png.png", "Catalog", "master product → marketplace payload"),
    ]
    x = 0.55
    w = 3.7
    for path, title, sub in shots:
        # frame
        rect(s, Inches(x), Inches(1.55), Inches(w), Inches(2.2), fill=INK_850, line_color=INK_700)
        s.shapes.add_picture(path, Inches(x + 0.1), Inches(1.62), Inches(w - 0.2), Inches(1.45))
        fill_text(s.shapes.add_textbox(Inches(x + 0.1), Inches(3.15), Inches(w - 0.2), Inches(0.6)),
                  [[(title, 12, SAFFRON, True, False, "Open Sans")],
                   [(sub, 10, INK_SOFT, False, False, "Open Sans")]])
        x += w + 0.35

    # Screenshots row 2 (2 screenshots)
    shots2 = [
        ("C:/d/dukaanquest-work/media_inspect2/image15.png.png", "WhatsApp CRM", "campaign send + consent gate"),
        ("C:/d/dukaanquest-work/media_inspect2/image11.png.png", "What-If sim", "profit / margin / payback"),
    ]
    x = 0.55
    w = 3.7
    for path, title, sub in shots2:
        rect(s, Inches(x), Inches(4.0), Inches(w), Inches(1.5), fill=INK_850, line_color=SAFFRON)
        s.shapes.add_picture(path, Inches(x + 0.12), Inches(4.07), Inches(w - 0.24), Inches(0.95))
        fill_text(s.shapes.add_textbox(Inches(x + 0.1), Inches(5.1), Inches(w - 0.2), Inches(0.35)),
                  [[(title, 12, SAFFRON, True, False, "Open Sans")]])
        fill_text(s.shapes.add_textbox(Inches(x + 0.1), Inches(5.42), Inches(w - 0.2), Inches(0.7)),
                  [[(sub, 10, INK_SOFT, False, False, "Open Sans")]])
        x += w + 0.35

    # TODAY / NEXT bands
    rect(s, Inches(0.55), Inches(5.75), Inches(5.6), Inches(1.2), fill=INK_850)
    rect(s, Inches(0.55), Inches(5.75), Inches(0.08), Inches(1.2), fill=SAFFRON)
    fill_text(s.shapes.add_textbox(Inches(0.75), Inches(5.82), Inches(5.3), Inches(1.1)),
              [[("TODAY", 10, SAFFRON, True, False, "Open Sans")],
               [("Prototype connects the merchant growth workflow.", 12.5, INK_800, False, False, "Open Sans")],
               [("Verified sandbox + staged fallbacks, no production claims.", 10.5, INK_MUTED, False, True, "Open Sans")]], anchor=MSO_ANCHOR.MIDDLE)

    rect(s, Inches(6.4), Inches(5.75), Inches(6.4), Inches(1.2), fill=INK_850)
    rect(s, Inches(6.4), Inches(5.75), Inches(0.08), Inches(1.2), fill=INK_700)
    fill_text(s.shapes.add_textbox(Inches(6.6), Inches(5.82), Inches(6.1), Inches(1.1)),
              [[("NEXT", 10, INK_700, True, False, "Open Sans")],
               [("Deeper marketplace integrations · billing/inventory · production onboarding · broader multilingual support · richer merchant intelligence.", 11.5, INK_800, False, False, "Open Sans")]],
               anchor=MSO_ANCHOR.MIDDLE)

    return s


# ---------------------------------------------------------------------------
# assemble
# ---------------------------------------------------------------------------
build_slide1()
build_slide2()
build_slide3()
build_slide4()
build_slide5()
build_slide6()
build_slide7()

prs.save(OUT)
print("saved", OUT, "slides:", len(prs.slides.__iter__.__self__._sldIdLst))
