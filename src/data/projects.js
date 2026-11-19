import conceptBoard from "../../images/concept-board-mughal-era.jpg";
import presentationPlan from "../../images/drawing-presentation-plan.jpg";
import specificationPlan from "../../images/drawing-measurement-specification-plan.jpg";
import ceilingLayout from "../../images/drawing-ceiling-layout.jpg";
import flooringLayout from "../../images/drawing-flooring-layout.jpg";
import furnitureSectionsCCDD from "../../images/drawing-furniture-sections-cc-dd.jpg";
import furnitureSectionsAABB from "../../images/drawing-furniture-sections-aa-bb.jpg";
import receptionCounterDetail from "../../images/drawing-furniture-detail-reception-counter.jpg";
import mainDining from "../../images/render-main-dining-fountain.jpg";
import diningEvening from "../../images/render-dining-hall-evening.jpg";
import jaliSeating from "../../images/render-jali-booth-seating.jpg";
import receptionWaiting from "../../images/render-reception-waiting.jpg";
import entranceFacade from "../../images/render-entrance-facade.jpg";
import diningDay from "../../images/render-dining-hall-day.jpg";
import barWindow from "../../images/render-bar-window-seating.jpg";
import barCounter from "../../images/render-bar-counter.jpg";

const image = (src, title, alt, kind = "render") => ({ src, title, alt, kind });

const concept = image(
  conceptBoard,
  "The Mughal Era",
  "Concept and material board for The Mughal Era restaurant",
  "board",
);

const renders = [
  image(mainDining, "Main dining with fountain", "Main dining hall with a central fountain"),
  image(diningEvening, "Dining hall, evening", "Restaurant dining hall in evening light"),
  image(jaliSeating, "Jali booth seating", "Booth seating beside decorative jali screens"),
  image(receptionWaiting, "Reception waiting", "Reception counter and waiting area"),
  image(entranceFacade, "Entrance facade", "Restaurant entrance with arches and carved details"),
  image(diningDay, "Dining hall, day", "Restaurant dining hall in daylight"),
  image(barWindow, "Bar window seating", "Bar and window seating"),
  image(barCounter, "Bar counter", "Restaurant bar counter"),
];

const plans = [
  image(presentationPlan, "Presentation plan", "Presentation plan drawing", "drawing"),
  image(specificationPlan, "Measurement and specification plan", "Measurement and specification plan drawing", "drawing"),
];

const layouts = [
  image(ceilingLayout, "Ceiling layout", "Ceiling layout drawing", "drawing"),
  image(flooringLayout, "Flooring layout", "Flooring layout drawing", "drawing"),
];

const furnitureDrawings = [
  image(furnitureSectionsCCDD, "Furniture sections C-C and D-D", "Furniture sections C-C and D-D drawing", "drawing"),
  image(furnitureSectionsAABB, "Furniture sections A-A and B-B", "Furniture sections A-A and B-B drawing", "drawing"),
  image(receptionCounterDetail, "Reception counter furniture detail", "Reception counter furniture detail drawing", "drawing"),
];

const tourZones = [
  {
    id: "dining",
    label: "Main dining",
    position: { left: "39%", top: "40%" },
    views: [renders[0], renders[1], renders[2], renders[5]],
  },
  {
    id: "bar",
    label: "Bar",
    position: { left: "36%", top: "25%" },
    views: [renders[6], renders[7]],
  },
  {
    id: "reception",
    label: "Reception",
    position: { left: "23%", top: "62%" },
    views: [renders[3]],
  },
  {
    id: "entrance",
    label: "Entrance",
    position: { left: "29%", top: "72%" },
    views: [renders[4]],
  },
];

export const restaurantProject = {
  id: "mughal-inspired-restaurant",
  slug: "/projects/mughal-inspired-restaurant",
  title: "Mughal-Inspired Restaurant",
  category: "Thematic Restaurant",
  area: "5,000 sq. ft.",
  conceptName: "The Mughal Era",
  summary:
    "Designed as a Mughal-inspired restaurant blending traditional royal heritage with contemporary interior elements. The design focuses on creating a luxurious dining experience through intricate architectural details, elegant materials, warm lighting, and a rich colour palette.",
  conceptDescription:
    "Inspired by Mughal palaces, the concept brings together arches, rich textures, warm lighting, and contemporary comfort.",
  scope: [
    "Concept development and space planning",
    "Furniture layout and zoning",
    "Material and colour selection",
    "Ceiling and lighting design",
    "Kitchen planning",
    "Working drawings and 3D visualisation",
  ],
  materials: [
    "White marble",
    "Sandstone finish",
    "Dark wood — teak / walnut",
    "Brass and antique gold",
    "Velvet upholstery",
  ],
  direction: [
    "Mughal arches and jali details",
    "Floral motifs and carved panels",
    "Warm ambient lighting",
    "Persian-style rugs",
    "A central water feature",
  ],
  concept,
  renders,
  plans,
  layouts,
  furnitureDrawings,
  tourZones,
  lightboxItems: [concept, ...renders, ...plans, ...layouts, ...furnitureDrawings],
  heroRender: mainDining,
};

export const processStages = [
  {
    number: "01",
    title: "Concept",
    detail: "The Mughal Era concept board sets the visual direction.",
    image: concept,
  },
  {
    number: "02",
    title: "Space planning",
    detail: "Presentation and measurement plans map the restaurant layout.",
    image: plans[0],
  },
  {
    number: "03",
    title: "Furniture & finishes",
    detail: "Furniture, materials, and colour selection shape the interior.",
    image: furnitureDrawings[2],
  },
  {
    number: "04",
    title: "Ceiling & lighting",
    detail: "A dedicated ceiling layout supports the lighting design.",
    image: layouts[0],
  },
  {
    number: "05",
    title: "Technical drawings",
    detail: "Plans, layouts, sections, and furniture details document the work.",
    image: plans[1],
  },
  {
    number: "06",
    title: "3D visualisation",
    detail: "Rendered views show the designed restaurant spaces.",
    image: renders[0],
  },
];
