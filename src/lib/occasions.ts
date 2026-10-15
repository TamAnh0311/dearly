/**
 * SEO landing pages per occasion (/invitations/<type>). Wedding is the
 * flagship and listed first. Each page targets its own search intent with a
 * unique title, description, H1, feature list and FAQ (FAQPage JSON-LD).
 */

import type { EventType } from "@/types/database";

export interface OccasionPage {
  slug: string;
  /** Event types whose templates are showcased (empty = ask cards). */
  eventTypes: EventType[];
  navLabel: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  features: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  cta: { label: string; href: string };
}

export const OCCASIONS: OccasionPage[] = [
  {
    slug: "wedding",
    eventTypes: ["wedding", "engagement", "anniversary"],
    navLabel: "Wedding invitations",
    title: "Digital Wedding Invitations with RSVP & Photo Album",
    description:
      "Animated digital wedding invitations with curtain, wax-seal and garden openings, RSVP inside the invite, personal guest links, live blessings and a shared wedding photo album. Free.",
    h1: "Digital wedding invitations that open like a film",
    intro:
      "Send one beautiful link. Guests watch your invitation open, RSVP with their companions, leave blessings and — after the big day — share their photos into your memory book.",
    features: [
      { title: "Signature openings", body: "Velvet curtains, a cracking wax seal, garden gates, a stained-glass rose window, a sunset sky — every design has its own entrance." },
      { title: "RSVP & guest list", body: "Paste your guest list to create personal links. Track who's coming, with how many companions, and check guests in on the day." },
      { title: "Blessings & reactions", body: "Wishes appear on a blessing wall and drift behind your names as the page opens. Guests tap to send hearts and cheers." },
      { title: "Your memory book", body: "Guests upload photos from the invitation. You approve them, and the page becomes a keepsake album of your wedding." },
    ],
    faq: [
      { q: "Can guests RSVP inside the wedding invitation?", a: "Yes. Guests choose “I'll be there” or “Can't make it”, add their party size and an optional blessing. Replies appear in your dashboard instantly." },
      { q: "Can I send personalised invitations to each guest?", a: "Yes. Paste your guest list (one name per line, “+1” for companions) and Dearly creates a personal link for each guest that greets them by name and reserves their seats." },
      { q: "Do guests need to download an app?", a: "No. Your invitation is a mobile-first web page — guests open the link from WhatsApp, email or text." },
      { q: "What happens after the wedding?", a: "Your invitation turns into a memory book: RSVP closes and guests can keep adding photos and blessings." },
    ],
    cta: { label: "Create my wedding invitation", href: "/signup?event=wedding" },
  },
  {
    slug: "birthday",
    eventTypes: ["birthday", "baby-shower"],
    navLabel: "Birthday invitations",
    title: "Online Birthday Invitations with RSVP",
    description: "Fun animated birthday invitations with confetti, balloons and instant photos. Collect RSVPs, birthday wishes and party photos in one link.",
    h1: "Birthday invitations that pop",
    intro: "Confetti, balloons and a guest of honour in the spotlight. Share one link, collect RSVPs and wishes, then relive the party with everyone's photos.",
    features: [
      { title: "Party-ready designs", body: "Confetti Pop, Balloon Bash and more — bright, playful and made for phones." },
      { title: "RSVP with plus-ones", body: "Know exactly who's coming and how many friends they're bringing." },
      { title: "Birthday wishes wall", body: "Every wish shows up on the page — perfect to read back on the day." },
      { title: "Shared photo album", body: "Guests add their party photos straight from the invitation." },
    ],
    faq: [
      { q: "Can I make a birthday invitation for a kid's party?", a: "Absolutely — pick a playful design, add the party details and share the link with parents." },
      { q: "Is it free?", a: "Yes, birthday invitations with RSVP are free. Every design, the guest list and the photo album are included at no cost." },
    ],
    cta: { label: "Create a birthday invitation", href: "/signup?event=birthday" },
  },
  {
    slug: "party",
    eventTypes: ["party", "birthday", "social"],
    navLabel: "Party invitations",
    title: "Party Invitations Online — RSVP, Guest List & Photos",
    description: "Stylish online party invitations with RSVP tracking, a named guest list with check-in, and a shared photo wall. Neon nights to rooftop soirées.",
    h1: "Party invitations your guests will screenshot",
    intro: "From neon nights to rooftop soirées — invite with style, manage a named guest list, check people in at the door and collect the night's photos.",
    features: [
      { title: "Guest list & check-in", body: "Personal links for every guest, live RSVP counts and a one-tap check-in when they arrive." },
      { title: "After-dark designs", body: "Neon Night, Celestial and Velvet Curtain set the mood before the first song." },
      { title: "Background music", body: "A soundtrack matched to your design starts with the guest's first tap." },
      { title: "The guest wall", body: "Messages and reactions from everyone on the list." },
    ],
    faq: [
      { q: "Can I see who actually showed up?", a: "Yes. Use the check-in toggle in your guest list on the night to record arrivals and companions." },
      { q: "Can I export the guest list?", a: "Yes — download a CSV with every guest's status, companions and personal link." },
    ],
    cta: { label: "Create a party invitation", href: "/signup?event=party" },
  },
  {
    slug: "social-event",
    eventTypes: ["social", "party", "anniversary"],
    navLabel: "Event invitations",
    title: "Elegant Event Invitations — Dinners, Galas & Reunions",
    description: "Elegant digital invitations for dinners, galas, reunions and gatherings with RSVP, personalised guest links and a shared memories page.",
    h1: "Elegant invitations for every gathering",
    intro: "Dinners, galas, reunions and anniversaries deserve more than a group chat. Send a refined invitation, collect RSVPs and keep the memories together.",
    features: [
      { title: "Refined designs", body: "Soirée, Rose Window and Eternal bring timeless elegance to any occasion." },
      { title: "Personal invitations", body: "Address every guest by name and reserve their seats." },
      { title: "Schedule & venue", body: "Order of the evening, directions and add-to-calendar in one tap." },
      { title: "Memories page", body: "Photos and messages stay together after the event." },
    ],
    faq: [{ q: "Can I use Dearly for corporate events?", a: "Yes — galas, launches and team dinners work great with the Social event type and refined designs." }],
    cta: { label: "Create an event invitation", href: "/signup?event=social" },
  },
  {
    slug: "date-night",
    eventTypes: [],
    navLabel: "Date night & proposal cards",
    title: "Date Night & Proposal Ask Cards — The “No” Button Runs Away",
    description: "Ask someone out, plan a date night or pop the question with a playful card where the “No” button runs away. Free, instant, shareable.",
    h1: "Ask the question. They can only say yes.",
    intro: "Create a cute ask card for a date night, Valentine's, prom or a proposal. The “No” button dodges every tap — and “Yes” sets off a celebration.",
    features: [
      { title: "The runaway No", body: "It slides, shrinks and teleports away from the cursor or finger." },
      { title: "Themes for every mood", body: "Hearts, roses, stars, kawaii or classic — pick a vibe and colours." },
      { title: "Know when they said yes", body: "See the answer and the moment it happened in your dashboard." },
      { title: "Instant & free", body: "Write your question, share the link, wait for the yes." },
    ],
    faq: [
      { q: "Can they actually click No?", a: "Not really — the No button runs away every time they get close. That's the fun." },
      { q: "Can I use it for a proposal?", a: "Yes. Write “Will you marry me?”, choose the Roses or Classic theme and share the link at the perfect moment." },
    ],
    cta: { label: "Create an ask card", href: "/dashboard/questions" },
  },
];

/** Finds an occasion page by slug. */
export function getOccasion(slug: string): OccasionPage | undefined {
  return OCCASIONS.find((o) => o.slug === slug);
}
