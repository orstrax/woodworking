export type ShopWord = {
  term: string;
  say: string;
  meaning: string;
  hint: string;
};

export const SHOP_WORDS: ShopWord[] = [
  {
    term: "Story stick",
    say: "STORE-ee stick",
    meaning: "A marked stick that holds every important measurement for a job, so you copy marks instead of reading the tape a hundred times.",
    hint: "This site is the digital version: pictures and numbers that stay put.",
  },
  {
    term: "Stile",
    say: "style",
    meaning: "The tall vertical piece of a door or face frame. There are two: left and right.",
    hint: "If it stands up, it is a stile.",
  },
  {
    term: "Rail",
    say: "rail",
    meaning: "The short horizontal piece of a door or face frame. Top and bottom.",
    hint: "If it runs sideways, it is a rail.",
  },
  {
    term: "Face frame",
    say: "face frame",
    meaning: "The wooden picture-frame on the front of a face-frame cabinet. Doors hang on it.",
    hint: "Opening is the hole inside the frame. Overall is outside to outside.",
  },
  {
    term: "Overlay",
    say: "OH-ver-lay",
    meaning: "How much the door covers the face frame. A ½″ overlay covers half an inch of stile.",
    hint: "More overlay = less frame showing.",
  },
  {
    term: "Reveal",
    say: "re-VEEL",
    meaning: "The strip of face frame you still see around the door. The leftover after overlay.",
    hint: "Reveal + overlay = stile width.",
  },
  {
    term: "Inset",
    say: "IN-set",
    meaning: "A door that sits inside the opening, flush with the frame, with a small gap all around.",
    hint: "Looks like furniture. Needs a even gap so it can swing.",
  },
  {
    term: "Opening",
    say: "opening",
    meaning: "The inside hole — between the stiles and rails. Not the outside of the cabinet.",
    hint: "Measure the opening unless the tool asks for overall.",
  },
  {
    term: "Board foot",
    say: "board foot",
    meaning: "How hardwood is sold. One board foot is 144 cubic inches: 1″ thick × 12″ wide × 12″ long.",
    hint: "4/4 means one inch rough. Thickness × width × length (inches) ÷ 144.",
  },
  {
    term: "4/4, 5/4, 8/4",
    say: "four-quarter, five-quarter, eight-quarter",
    meaning: "Rough lumber thickness. 4/4 is 1″ rough (finishes near 13/16″). 5/4 is 1¼″. 8/4 is 2″.",
    hint: "You pay for the rough size, then mill it flatter and thinner.",
  },
  {
    term: "On-center (O.C.)",
    say: "on center",
    meaning: "Distance from the middle of one hole or part to the middle of the next.",
    hint: "Shelf pins, slats, and studs are laid out on-center.",
  },
  {
    term: "Kerf",
    say: "curf",
    meaning: "The slot the saw blade cuts — wood that turns into sawdust. A table-saw blade is often about ⅛″.",
    hint: "Every rip steals a kerf. Plan extra stock.",
  },
  {
    term: "Miter",
    say: "MY-ter",
    meaning: "The saw angle for a corner. A square picture frame is 45° on the saw, not 90°.",
    hint: "Miter is half of the corner. Set the saw to the miter number.",
  },
  {
    term: "Pin and tail",
    say: "pin / tail",
    meaning: "The two halves of a dovetail. Tails are the flared wide parts. Pins fit between them.",
    hint: "Half-pins sit on both ends of the board.",
  },
  {
    term: "Flat-sawn / quarter-sawn",
    say: "flat-sawn / KWOR-ter sawn",
    meaning: "How the log was cut. Flat-sawn shows cathedral grain and moves more. Quarter-sawn is more stable.",
    hint: "Wood moves across the grain, not along it.",
  },
  {
    term: "Moisture content (MC)",
    say: "moisture content",
    meaning: "How wet the wood is, as a percent. Indoor furniture often lives around 6–8% MC.",
    hint: "A panel that dries in the house will shrink. Leave room in the frame.",
  },
  {
    term: "Cope-and-stick",
    say: "cope and stick",
    meaning: "A five-piece door: stiles and rails with a groove (stick) and matching end cuts (cope). The panel floats in the groove.",
    hint: "The panel is cut larger than what you see, so it can tuck in and move.",
  },
  {
    term: "Undermount slide",
    say: "under-mount",
    meaning: "Drawer hardware that hides under the box (Blum Tandem-style). The box is a little narrower than the opening.",
    hint: "Typical box width is the opening minus about ⅜″. Confirm with your brand.",
  },
  {
    term: "Cup hinge (35mm)",
    say: "cup hinge",
    meaning: "A European hinge. You bore a 35mm hole in the back of the door. The cup sits in that hole.",
    hint: "Usually 5mm in from the door edge. Two hinges up to 36″ tall.",
  },
  {
    term: "Square",
    say: "square",
    meaning: "A rectangle whose diagonals match. If the diagonals differ, the box is a parallelogram.",
    hint: "Pull the long diagonal until both match. 3-4-5 also proves a right angle.",
  },
  {
    term: "Carcass",
    say: "CAR-cuss",
    meaning: "The plywood box of a cabinet — sides, bottom, back — before doors or a face frame go on.",
    hint: "The pretty faces hang on the carcass. Square the box first.",
  },
  {
    term: "Dado",
    say: "DAY-doe",
    meaning: "A groove cut across the grain that another panel sits in. Cabinet bottoms often live in dados in the sides.",
    hint: "A rabbet is a dado on the edge. The back usually sits in a rabbet.",
  },
  {
    term: "Toe kick",
    say: "toe kick",
    meaning: "The notch at the floor so your toes can go under the cabinet. Often 4″ high and 3″ deep.",
    hint: "Cut it from both sides, same corner, mirrored.",
  },
];

export type ToolGuide = {
  slug: string;
  firstTime: string;
  shopHabit: string;
  finePoint: string;
  mistakes: string[];
  words: string[];
  related: string[];
};

export const TOOL_GUIDES: ToolGuide[] = [
  {
    slug: "kitchen-plan",
    firstTime:
      "Tap typical cabinets onto the wall — a 36″ drawer base, a sink, an upper. Then open a cabinet to change its width or doors. Print the shop summary and gang matching stile lengths.",
    shopHabit:
      "Same overlay on every door so the kitchen reads as one. Pair doors need a mid-gap. Print the shop summary and gang matching stile lengths, then cut cabinet by cabinet so parts do not wander.",
    finePoint:
      "Applied-miter frames: long-point length is the finished door width or height. Cope-and-stick rails are shorter — they sit between the stiles. Do not mix those two lists.",
    mistakes: [
      "Measuring the outside of the box instead of the opening.",
      "Putting doors and a drawer stack in one height without a separate drawer-stack measurement.",
      "Cutting every stile to the first door on the list.",
    ],
    words: ["Opening", "Face frame", "Overlay", "Reveal", "Stile", "Rail", "Story stick"],
    related: ["cabinet-box", "cabinet-doors", "drawers"],
  },
  {
    slug: "cabinet-box",
    firstTime:
      "A cabinet is a plywood box with a face on the front. Pick a typical layout (36″ drawer base, sink, upper), type the overall width, and read the sides, bottom, back, and doors from the pictures.",
    shopHabit:
      "Cut both sides together so the dados line up. Glue the box square, then the back — the back is what keeps it from racking. Face frame last, overhanging each side the same amount.",
    finePoint:
      "Face-frame boxes are usually ½″ narrower than the frame (¼″ overhang each side). Frameless boxes ARE the overall width; doors overlay the side thickness. Confirm slide specs before you cut drawer boxes.",
    mistakes: [
      "Using the opening width as the overall cabinet width.",
      "Forgetting the toe-kick notch, so the sides sit 4″ too tall on the floor.",
      "Cutting the back to the inside of the dados instead of the rabbet width.",
    ],
    words: ["Face frame", "Opening", "Stile", "Rail", "Square", "Story stick", "Carcass", "Dado", "Toe kick"],
    related: ["kitchen-plan", "cabinet-doors", "drawers", "square"],
  },
  {
    slug: "cabinet-doors",
    firstTime:
      "Measure the hole inside the face frame (opening), not the whole cabinet. Then pick how the door should sit: covering the frame (overlay), showing a strip of frame (reveal), or tucked in the hole (inset). If it is a shaker, pick a frame width — micro is ¾″, classic is about 2¼″.",
    shopHabit:
      "A ⅛″ reveal is a friendly American face-frame look. Inset needs an even gap all around or the door rubs. Pair doors need a ⅛″ gap. Applied miters on a slab are faster than cope-and-stick and still look right from the front.",
    finePoint:
      "Euro 35mm cups: 3–6mm from the door edge, 13.5mm deep. Two hinges to 36″, three to 60″. Face-frame cabinets want a face-frame plate. A floating shaker panel must have groove + float — do not glue the panel in.",
    mistakes: [
      "Measuring overall instead of the opening (or the other way around).",
      "Forgetting the mid-gap on a pair, so the two doors overlap.",
      "Ordering frameless hinges for a face-frame cabinet.",
      "Cutting a shaker panel to the visible size, then wondering why it rattles out of the groove.",
    ],
    words: ["Opening", "Face frame", "Overlay", "Reveal", "Inset", "Cup hinge (35mm)", "Stile", "Rail", "Cope-and-stick"],
    related: ["kitchen-plan", "cabinet-box", "drawers", "square", "movement"],
  },
  {
    slug: "drawers",
    firstTime:
      "The pretty front is what you see. The box behind it is what rides on the slides. They are different sizes on purpose.",
    shopHabit:
      "Match the door overlay so the kitchen reads as one. Stacked drawers share the opening height with even gaps. Undermount slides hide; side-mount shows a little metal.",
    finePoint:
      "Blum Tandem-style undermount: box width is usually opening minus ⅜″, and the back notch / locking devices are brand-specific. Always check the slide spec sheet before you cut the box.",
    mistakes: [
      "Making the box the same size as the front.",
      "Forgetting slide clearance, so the drawer will not go in.",
      "Numbering stacked fronts from the bottom. This site numbers top as 1.",
    ],
    words: ["Overlay", "Reveal", "Inset", "Undermount slide", "Opening"],
    related: ["kitchen-plan", "cabinet-box", "cabinet-doors", "square", "spacing"],
  },
  {
    slug: "board-feet",
    firstTime:
      "Hardwood is sold by the board foot, not by the piece. A board foot is a chunk 1″ × 12″ × 12″. Thickness × width × length in inches, divide by 144.",
    shopHabit:
      "Buy extra. 15% waste is a starting point for kerf, defects, and milling 4/4 down to finished thickness. Figure cost on the waste number, not the net.",
    finePoint:
      "You pay for rough thickness. A 4/4 board that finishes 13/16″ still billed as 1″. Wide, long, or figured boards often carry a premium on top of the board-foot price.",
    mistakes: [
      "Using finished thickness when the yard priced rough.",
      "Forgetting quantity — one tabletop may be several boards.",
      "No waste factor, then coming up a board short.",
    ],
    words: ["Board foot", "4/4, 5/4, 8/4", "Kerf"],
    related: ["weight", "glue-up", "kerf"],
  },
  {
    slug: "measure",
    firstTime:
      "A tape is just inches split into halves, quarters, eighths, sixteenths. The longer the mark, the bigger the fraction. Type what you see: 1 7/16, or 19mm.",
    shopHabit:
      "Put a space in mixed fractions: 3 1/2 not 31/2. Add mm if it is metric. 4/4 and 8/4 are lumber thicknesses, not math puzzles.",
    finePoint:
      "Cabinets often live in 16ths. Furniture joinery sometimes wants 32nds or 64ths. When in doubt, cut a hair long and sneak up with a plane or a sanding block.",
    mistakes: [
      "Reading the 1/8 mark as 1/16 (the 1/8 marks are longer).",
      "Typing 31/2 when you meant three and a half.",
      "Mixing mm and inches in the same cut list.",
    ],
    words: ["Story stick", "4/4, 5/4, 8/4"],
    related: ["board-feet", "spacing", "kerf"],
  },
  {
    slug: "spacing",
    firstTime:
      "You want holes (or slats, or pegs) evenly across a board, with the same leftover on each end. That leftover is the inset. The step from hole to hole is on-center.",
    shopHabit:
      "Shelf pins are often 1¼″ or 1½″ from the ends, then on-center down the row. Measure from the left edge as zero — that is how the picture is drawn.",
    finePoint:
      "If the on-center comes out as an ugly number, change the inset a hair or the count by one. Pretty layouts beat perfect math you cannot mark.",
    mistakes: [
      "Laying out from both ends and meeting in the middle with a different gap.",
      "Measuring to the edge of the hole instead of the center.",
      "Forgetting the last hole should land the same inset from the right.",
    ],
    words: ["On-center (O.C.)", "Story stick"],
    related: ["measure", "square", "drawers"],
  },
  {
    slug: "miter",
    firstTime:
      "A square picture frame is four 45° cuts, not 90°. The miter is the saw setting. The included corner is the angle of the finished frame.",
    shopHabit:
      "Cut one test pair and dry-fit. Small errors multiply around the frame. A shooting board or a good stop on the saw keeps lengths identical.",
    finePoint:
      "For N sides the miter is 180°/N. A hexagon is 30°. If you bevel instead of miter, use the complement (90° minus the miter).",
    mistakes: [
      "Setting the saw to 90° for a square frame.",
      "Cutting inside length when you needed outside, or the reverse.",
      "One rail a hair long — the last corner will not close.",
    ],
    words: ["Miter"],
    related: ["circle", "square", "measure"],
  },
  {
    slug: "dovetail",
    firstTime:
      "Tails are the wide flared shapes. Pins fit between them. Half-pins sit on both ends so the joint does not start with a skinny sliver.",
    shopHabit:
      "Hardwood often uses 1:8 slope; softwood 1:6. Saw the tails first, then transfer to the pin board with a knife. A sharp line beats a pencil.",
    finePoint:
      "This layout is even tails with half-pins. Half-blind drawers hide the tails on the front. Through dovetails show on both faces — chests, boxes, carcases.",
    mistakes: [
      "Starting with a full pin on the end, which looks weak and chips.",
      "Cutting pins first and then guessing at the tails.",
      "A slope so steep the tails look like sawteeth.",
    ],
    words: ["Pin and tail"],
    related: ["measure", "square", "drawers"],
  },
  {
    slug: "movement",
    firstTime:
      "Wood is a sponge. It grows across the grain when the air is wet and shrinks when the house is dry. Along the grain it barely moves.",
    shopHabit:
      "Never glue a wide panel tight in a frame. Breadboard ends, tabletop fasteners, and floating panels all leave this much play. Quarter-sawn moves less than flat-sawn.",
    finePoint:
      "Numbers follow USDA Wood Handbook shrinkage from green to oven-dry, scaled to your moisture change. Real shops vary with finish, pith, and how the board was cut.",
    mistakes: [
      "A tabletop screwed down tight on all four edges — it will split.",
      "A door panel glued in the groove — it will crack the frame or itself.",
      "Using outdoor wet wood in a heated house.",
    ],
    words: ["Moisture content (MC)", "Flat-sawn / quarter-sawn"],
    related: ["cabinet-doors", "glue-up", "weight"],
  },
  {
    slug: "circle",
    firstTime:
      "A glued-up ring is just straight boards with matching miters. The chord is the inside face length of one piece. Cut that many, all the same.",
    shopHabit:
      "More segments look rounder and are more work. Eight is a friendly table ring. Dry-fit the whole circle before glue — one short piece opens a gap opposite.",
    finePoint:
      "Radius from rise is for arches: if you know the width (chord) and how tall the arch is, you can find the radius to swing.",
    mistakes: [
      "Cutting the outside arc length as the board length.",
      "Mitering only one end.",
      "An odd number of slightly different lengths — the ring will not close.",
    ],
    words: ["Miter"],
    related: ["miter", "glue-up", "measure"],
  },
  {
    slug: "weight",
    firstTime:
      "Wood has different densities. Oak is heavy. Pine and cedar are light. Weight is volume times that density — useful for shipping, bases, and hardware.",
    shopHabit:
      "A 1½″ walnut tabletop the size of a dining table is already a two-person lift. Plan apron joinery and tabletop fasteners for the real mass, not the drawing.",
    finePoint:
      "Densities here are air-dry averages. Heartwood, moisture, and species lots vary. Treat the number as a shipping estimate, not a scale.",
    mistakes: [
      "Ordering one-person hardware for a three-person top.",
      "Using green density for kiln-dried stock (or the reverse).",
    ],
    words: ["Board foot", "Moisture content (MC)"],
    related: ["board-feet", "movement", "glue-up"],
  },
  {
    slug: "square",
    firstTime:
      "A box is square when both diagonals are the same length. Measure corner to opposite corner, then the other pair. If they match, the corners are 90°.",
    shopHabit:
      "The 3-4-5 trick: 3 units one way, 4 the other, the diagonal should be 5. A tape across a cabinet carcass before the glue sets will save the doors later.",
    finePoint:
      "Pull the long diagonal with a clamp until both match. Doors and drawers will not fit a parallelogram, even if every side is the right length.",
    mistakes: [
      "Checking only one corner with a plastic square, then assembling the rest by eye.",
      "Measuring sides but never the diagonals.",
      "Squaring the face frame after the box has already dried out of square.",
    ],
    words: ["Square", "Opening"],
    related: ["cabinet-doors", "drawers", "miter"],
  },
  {
    slug: "glue-up",
    firstTime:
      "A wide top is several boards glued edge to edge. Joint the edges straight, alternate the grain so it stays flat, and leave extra width to cut down after the clamps come off.",
    shopHabit:
      "Aim for boards 3–5″ wide after jointing — wide enough to look calm, narrow enough to stay put. Alternate end-grain smile / frown to fight cupping.",
    finePoint:
      "Glue lines should be almost invisible. Cauls keep the panel flat. Wait for a full cure before you flatten; scraping too early dishes the soft glue.",
    mistakes: [
      "Forcing a bowed edge into the joint — it will open later.",
      "All cathedral grain running the same way, so the whole top cups as one.",
      "Cutting to finished width before flattening, then going undersize.",
    ],
    words: ["Flat-sawn / quarter-sawn", "Board foot"],
    related: ["board-feet", "movement", "kerf"],
  },
  {
    slug: "kerf",
    firstTime:
      "The blade eats a little wood every cut. That missing strip is the kerf. If you ignore it, the last piece comes out skinny.",
    shopHabit:
      "A typical table-saw full-kerf blade is about ⅛″. Thin-kerf is about ³⁄₃₂″. Count the rips, then add that many kerfs to the stock you buy.",
    finePoint:
      "Crosscuts waste (pieces − 1) × kerf on a single stick. A stop block is more accurate than marking every piece, but still plan the kerf when you share one board.",
    mistakes: [
      "Ripping four 2″ strips from an 8″ board and wondering why the last one is 1⅝″.",
      "Using a thin-kerf blade math on a full-kerf blade.",
      "No extra for a jointed edge or a skip-planed face.",
    ],
    words: ["Kerf", "Board foot"],
    related: ["board-feet", "glue-up", "measure"],
  },
];

export function getGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES.find((item) => item.slug === slug);
}

export function getWord(term: string): ShopWord | undefined {
  return SHOP_WORDS.find((item) => item.term === term);
}
