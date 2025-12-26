import {
  PiWallFill,
  PiPaintRollerFill,
  PiWrenchFill,
  PiUserGearFill,
} from "react-icons/pi";
import {
  RiFacebookFill,
  RiYoutubeFill,
  RiTwitterXFill,
  RiInstagramFill,
} from "react-icons/ri";

import { NavLink, Service, SocialLink, Statistic } from "@/lib/types";

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: RiFacebookFill,
    path: "https://facebook.com/urbanbuild",
    name: "Facebook",
    ariaLabel: "Follow UrbanBuild on Facebook",
  },
  {
    icon: RiYoutubeFill,
    path: "https://youtube.com/urbanbuild",
    name: "YouTube",
    ariaLabel: "Subscribe to our Project Showcases on YouTube",
  },
  {
    icon: RiTwitterXFill,
    path: "https://twitter.com/urbanbuild",
    name: "Twitter",
    ariaLabel: "Follow UrbanBuild on X for industry updates",
  },
  {
    icon: RiInstagramFill,
    path: "https://instagram.com/urbanbuild",
    name: "Instagram",
    ariaLabel: "View our portfolio on Instagram",
  },
] as const;

export const navLinks: NavLink[] = [
  { id: "home", label: "Home", path: "home" },
  { id: "about", label: "About Us", path: "about" },
  { id: "services", label: "Services", path: "services" },
  { id: "projects", label: "Portfolio", path: "projects" },
  { id: "contact", label: "Contact", path: "contact" },
] as const;

export const statistics: Statistic[] = [
  { value: 99, suffix: "%", label: "Safety Compliance Rate" },
  { value: 850, suffix: "+", label: "Industrial Projects" },
  { value: 12, suffix: "M", label: "Square Feet Built" },
  { value: 25, suffix: "+", label: "Years in Industry" },
] as const;

export const services: Service[] = [
  {
    name: "Construction",
    icon: PiWallFill,
    title: "General Contracting & Civil Engineering",
    description:
      "We deliver turnkey construction solutions for commercial and residential sectors. Our approach integrates BIM technology with lean construction principles to ensure structural excellence.",
    serviceList: [
      "Commercial Shell & Core",
      "High-Rise Residential Development",
      "Civil Infrastructure & Masonry",
      "Pre-Engineered Metal Buildings",
      "Sustainable LEED-Certified Building",
      "Post-Tensioned Concrete Work",
    ],
    images: [
      { url: "/assets/images/services/thumb-1.jpg" },
      { url: "/assets/images/services/thumb-2.jpg" },
    ],
  },
  {
    name: "Renovation",
    icon: PiPaintRollerFill,
    title: "Adaptive Reuse & Modernization",
    description:
      "Modernizing existing structures to meet contemporary standards of efficiency and design. We specialize in retrofitting commercial spaces and high-end residential remodeling.",
    serviceList: [
      "Tenant Improvement (TI) Fit-outs",
      "Structural Retrofitting",
      "Energy Efficiency Overhauls",
      "Facade Modernization",
      "Smart Building Integration",
      "MEP Systems Upgrades",
    ],
    images: [
      { url: "/assets/images/services/thumb-3.jpg" },
      { url: "/assets/images/services/thumb-4.jpg" },
    ],
  },
  {
    name: "Restoration",
    icon: PiWrenchFill,
    title: "Forensic Restoration & Repair",
    description:
      "Specialized services focused on structural recovery and historic preservation. We utilize advanced diagnostics to repair and protect properties against environmental degradation.",
    serviceList: [
      "Historic Landmark Preservation",
      "Structural Carbon Fiber Reinforcement",
      "Waterproofing & Envelope Repair",
      "Seismic Retrofitting",
      "Corrosion Mitigation",
      "Emergency Disaster Recovery",
    ],
    images: [
      { url: "/assets/images/services/thumb-4.jpg" },
      { url: "/assets/images/services/thumb-5.jpg" },
    ],
  },
  {
    name: "Consulting",
    icon: PiUserGearFill,
    title: "Project Management & Pre-Construction",
    description:
      "Strategic consulting to mitigate risk and optimize capital expenditure. From feasibility studies to regulatory compliance, we provide data-driven construction insights.",
    serviceList: [
      "Feasibility & Site Analysis",
      "Cost Estimation & VEC (Value Engineering)",
      "Zoning & Regulatory Compliance",
      "Project Lifecycle Scheduling",
      "Risk Mitigation & Safety Audits",
      "Procurement Strategy",
    ],
    images: [
      { url: "/assets/images/services/thumb-1.jpg" },
      { url: "/assets/images/services/thumb-3.jpg" },
    ],
  },
] as const;

export const WorkData = [
  {
    img: "/assets/images/work/restoration.jpg",
    name: "The Heritage Lofts",
    description: "Multi-million dollar restoration of a 1920s industrial landmark.",
    href: "#",
  },
  {
    img: "/assets/images/work/construction.jpg",
    name: "Skyline Corporate Center",
    description: "A 20-story LEED Platinum certified commercial office tower.",
    href: "#",
  },
  {
    img: "/assets/images/work/renovation.jpg",
    name: "TechHub Global HQ",
    description: "Adaptive reuse of warehouse space into high-tech modern offices.",
    href: "#",
  },
  {
    img: "/assets/images/work/consulting.jpg",
    name: "Harbor Development",
    description: "Pre-construction consulting and cost analysis for waterfront expansion.",
    href: "#",
  },
] as const;

export const testimonials = [
  {
    id: 1,
    text: "UrbanBuild's precision in structural engineering and adherence to the strict project timeline was impressive. They are true partners in development.",
    name: "Robert Sterling",
    image: "/assets/images/testimonials/avatar.jpg",
  },
  {
    id: 2,
    text: "Their value engineering saved us 15% on material costs without compromising the architectural integrity. A highly professional team.",
    name: "Sarah Chen",
    image: "/assets/images/testimonials/avatar.jpg",
  },
];

export const CONTACT_INFO = {
  phone: "+1 (212) 555-8900",
  email: "inquiries@urbanbuild.com",
  address: "750 Lexington Avenue, New York, NY 10022",
};

export const FAQ = [
  {
    question: "What is your approach to project safety and compliance?",
    answer:
      "We maintain a zero-incident safety culture. Every site is governed by OSHA-compliant safety plans and regular third-party audits to ensure total regulatory compliance.",
  },
  {
    question: "Do you offer Value Engineering (VE) during the pre-construction phase?",
    answer:
      "Yes. We analyze blueprints to identify cost-saving alternatives in materials and methods that maintain or enhance the original design intent.",
  },
  {
    question: "How do you handle site-specific environmental challenges?",
    answer:
      "Our team conducts comprehensive site surveys and soil testing early in the phase to mitigate risks related to drainage, grading, or environmental contamination.",
  },
  {
    question: "What is your experience with LEED and sustainable building?",
    answer:
      "We have extensive experience in sustainable construction, having completed multiple LEED-certified projects focusing on high-efficiency MEP systems and low-impact materials.",
  },
] as const;