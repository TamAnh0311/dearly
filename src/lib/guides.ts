/**
 * Help & guide content — the single source of truth for the in-app Help Center
 * (`/help`) and its guide articles (`/help/[slug]`).
 *
 * Articles are plain data so the hub can search and filter them on the client
 * and the article pages can render statically on the server. Add a new guide by
 * appending to `GUIDES`; no route or database change is needed.
 */

/** Categories group guides in the help hub. */
export type GuideCategoryId = "start" | "design" | "guests" | "memories" | "sharing" | "occasions";

export interface GuideCategory {
  id: GuideCategoryId;
  label: string;
  description: string;
}

export interface GuideSection {
  heading: string;
  body?: string[];
  steps?: string[];
  note?: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  category: GuideCategoryId;
  /** Extra search words guests and hosts might type. */
  keywords: string[];
  /** Approximate read time in minutes. */
  minutes: number;
  sections: GuideSection[];
  faq?: GuideFaq[];
}

/** Ordered categories shown as filters in the help hub. */
export const GUIDE_CATEGORIES: GuideCategory[] = [
  { id: "start", label: "Getting started", description: "Create an account, pick a design and publish your first page." },
  { id: "design", label: "Design & content", description: "Colours, fonts, sections, story, schedule and music." },
  { id: "guests", label: "Guests & RSVP", description: "Personal links, replies, seat counts and check-in." },
  { id: "memories", label: "Photos & memories", description: "Guest uploads, moderation, albums and the memory book." },
  { id: "sharing", label: "Publishing & sharing", description: "Your link, privacy and what guests see." },
  { id: "occasions", label: "Cards & occasions", description: "Birthdays, parties, cards and date-night ask pages." },
];

/** Every help guide, in display order. */
export const GUIDES: Guide[] = [
  {
    slug: "create-your-invitation",
    title: "Create your first invitation",
    summary: "From a free account to a shareable link in four short steps — no design skills needed.",
    category: "start",
    keywords: ["signup", "sign up", "start", "new", "first", "onboarding", "account"],
    minutes: 4,
    sections: [
      {
        heading: "1. Create your free account",
        body: [
          "Sign up with email or a supported social account. A free account unlocks every design and every feature — there is no trial timer and no card required.",
        ],
      },
      {
        heading: "2. Choose the occasion",
        body: [
          "The same tools work for weddings, birthdays, dinner parties, engagements, anniversaries, baby showers and other celebrations.",
          "For a single-host event such as a birthday, leave the second name empty. Add an optional event title (for example “Mia turns 30”).",
        ],
      },
      {
        heading: "3. Pick a design",
        body: [
          "Browse the template gallery, search by mood or occasion, and open a live preview. You can try colour schemes and sections before choosing.",
          "Select “Use this design” to carry the template — and any scheme or section choices you made — into your new page.",
        ],
      },
      {
        heading: "4. Add the basics and publish",
        steps: [
          "Enter the host name (or both names for a couple).",
          "Choose a date, then set your page address (the slug).",
          "Create the page and land in the editor.",
          "Open Settings to switch on Published, then share the link.",
        ],
        note: "Your page stays private until you publish it. Use Preview at any time to see exactly what guests will see.",
      },
    ],
    faq: [
      { question: "Can I change the design later?", answer: "Yes. Open the editor and choose another template under Design. Your content, guests and RSVPs are kept." },
      { question: "Is it really free?", answer: "Every design and feature is currently available in early access. Abuse limits still apply: up to 2,000 photos and 1,000 named guests." },
    ],
  },
  {
    slug: "choose-a-template",
    title: "Choose a template and colour scheme",
    summary: "Search by mood, preview the real animation and try any colour scheme before you commit.",
    category: "start",
    keywords: ["template", "design", "theme", "style", "colour", "color", "scheme", "preview", "gallery"],
    minutes: 3,
    sections: [
      {
        heading: "Search and filter",
        body: [
          "The public template gallery at /templates can be browsed without an account. Filter by occasion or design family, or search for words like “garden”, “gold”, “stars”, “curtain” or “butterflies”.",
          "Search also understands how a design is built — its opening layout, ambient effect and ornaments — so “confetti” finds party designs even when the title does not mention confetti.",
        ],
      },
      {
        heading: "Open a live preview",
        body: [
          "Each card opens a real, animated demo, not a screenshot. Use the colour-scheme picker and the Sections popover in the preview to see how the design behaves with different palettes and content.",
        ],
        note: "Some openings need a photo or artwork and fall back to a simpler layout when it is missing. That fallback is intentional, not an error.",
      },
      {
        heading: "Apply the design",
        steps: [
          "Choose a colour scheme in the preview.",
          "Toggle any sections you want to hide.",
          "Select “Use this design”.",
          "Finish signup (or return to the dashboard) — your choice is carried through.",
        ],
      },
    ],
    faq: [
      { question: "Can I use my own colours?", answer: "Yes. In the editor, open Colours to set your own palette, and Fonts to choose a display and body font." },
    ],
  },
  {
    slug: "customise-your-design",
    title: "Customise colours, fonts and layout",
    summary: "Make the design yours with palette controls, fonts, template swaps, countdown style, dress code and gallery layout.",
    category: "design",
    keywords: ["editor", "colours", "colors", "fonts", "palette", "countdown", "timer", "rings", "dress code", "gallery layout", "template", "language"],
    minutes: 4,
    sections: [
      {
        heading: "The editor saves as you type",
        body: [
          "The dashboard editor updates your page as you edit. Changes are saved automatically; open Preview in the top bar to check the result on the real guest page.",
        ],
      },
      {
        heading: "Colours and fonts",
        body: [
          "Colours on the design tokens — background, surface, primary, accent and ink — are applied across every section. Text colour is derived from the background so it stays readable.",
          "Fonts can be changed for display headings and body copy. Keep script fonts for short accents such as names, never paragraphs.",
        ],
        note: "Test at least one light and one dark scheme. The preview picker is the quickest way to spot unreadable combinations.",
      },
      {
        heading: "Template, dress code and gallery",
        steps: [
          "Design → Template: switch the whole design language at any time.",
          "Countdown Style: choose classic number tiles or orbit progress rings.",
          "Dress Code: add a short note and up to five colour swatches.",
          "Families & Gifts: add parents’ names, gift accounts and payment QR links.",
          "Gallery Layout: choose masonry, carousel or timeline for the photo album.",
        ],
      },
      {
        heading: "Invitation language",
        body: [
          "Choose the language guests see under Families & Gifts. The invitation copy, labels and date formatting follow that choice while your typed content stays exactly as entered.",
        ],
      },
    ],
    faq: [
      { question: "Will changing the template erase my content?", answer: "No. Templates control layout and motion. Names, dates, story, guests, RSVPs and photos stay in place." },
    ],
  },
  {
    slug: "choose-sections",
    title: "Show only the sections you want",
    summary: "Hide the countdown, RSVP, blessings, music and more — section by section.",
    category: "design",
    keywords: ["sections", "hide", "show", "toggle", "countdown", "story", "timeline", "venue", "gallery", "rsvp", "blessings", "reactions", "music"],
    minutes: 3,
    sections: [
      {
        heading: "Turn parts of the page on or off",
        body: [
          "In the editor, open Sections. Each switch controls one part of the guest page. A section also hides itself when it has no content — an empty story or schedule never leaves a blank block.",
        ],
      },
      {
        heading: "What each switch controls",
        steps: [
          "Countdown — the countdown and add-to-calendar actions.",
          "Story — the Our Story section.",
          "Timeline — the schedule of events.",
          "Venue — the venue card and directions.",
          "Gallery — the Moments ribbon and the footer gallery link.",
          "RSVP — the RSVP section and the nav RSVP button.",
          "Blessings and reactions — the blessing wall and reaction bar.",
          "Blessing shower — the wishes shown when the page opens.",
          "Music — the background music player.",
          "Guest book — the footer guest-book link.",
          "Families and gift — parents’ names and gift details.",
        ],
      },
      {
        heading: "Blessing styles",
        body: [
          "Marquee: large, faint wishes run behind the hero only.",
          "Float: wishes drift up the whole screen, carried by the template motif.",
          "Feed: wishes pop up like a livestream chat, four at a time.",
        ],
        note: "Guests can hide the blessing shower themselves. That preference is remembered on their device.",
      },
    ],
    faq: [
      { question: "What happens after the event date?", answer: "The page becomes a memory book: RSVP is hidden automatically, while blessings and photos stay available." },
    ],
  },
  {
    slug: "content-story-venue-schedule",
    title: "Add your story, venue and schedule",
    summary: "Write the details guests need: your story, where to go, when things happen and dress code.",
    category: "design",
    keywords: ["story", "venue", "address", "map", "schedule", "timeline", "events", "date", "time", "timezone", "dress code", "calendar"],
    minutes: 4,
    sections: [
      {
        heading: "Story and venue",
        body: [
          "Add the story text in the editor under Our Story. For the venue, enter a name and address; guests get a directions link and add-to-calendar buttons where the template supports them.",
          "Use the optional place line for a short location label and the date note for arrival details or timing reminders.",
        ],
      },
      {
        heading: "Schedule",
        steps: [
          "Open Timeline in the dashboard.",
          "Add each event with a title, time and optional details.",
          "Reorder or edit entries at any time.",
          "Set the event timezone in Settings so times display correctly for guests.",
        ],
      },
      {
        heading: "Dress code",
        body: [
          "Under Dress Code, write a short note and add up to five labelled swatches. Swatches only appear when they have a label.",
        ],
      },
    ],
    faq: [
      { question: "Do times follow the guest’s timezone?", answer: "Schedule times are displayed in the event timezone you set in Settings, so every guest sees the same plan." },
    ],
  },
  {
    slug: "guest-list",
    title: "Build a guest list with personal links",
    summary: "Paste names, reserve seats and send every guest a link that greets them by name.",
    category: "guests",
    keywords: ["guest list", "invitees", "paste", "names", "personal link", "token", "seats", "party size", "groups", "csv", "export", "plus one"],
    minutes: 5,
    sections: [
      {
        heading: "Paste names, one per line",
        body: [
          "Open Guest list and paste names into the box. Each line becomes one invitation with its own random token.",
          "Use +1 to add a companion, or a comma and a number to reserve seats: “Anna +1”, “Minh Tran +1”, “The Nguyen family, 4”. You can also add a group such as Family or Colleagues for filtering.",
        ],
      },
      {
        heading: "Share personal links",
        body: [
          "Each guest’s link looks like /your-slug?i=their-token. The page greets them by name and pre-fills the RSVP, with the party size capped at the seats you reserved.",
          "Copy a single link, send all links by email or message, and watch the Sent count in the guest list.",
        ],
      },
      {
        heading: "Track replies and export",
        steps: [
          "Coming and Can’t make it update as guests reply.",
          "No reply yet shows who still needs a nudge.",
          "Showed up tracks arrivals on the day.",
          "Export CSV downloads names, groups, links and results.",
        ],
      },
      {
        heading: "Groups and filters",
        body: [
          "Filter by reply status, check-in state, group or a name search. Groups are optional; they are only for your own organisation and never shown to guests.",
        ],
        note: "Removing a guest stops their personal link from working. Their earlier RSVP is not kept in the guest list.",
      },
    ],
    faq: [
      { question: "How many guests can I add?", answer: "Under the current early-access limits, a page can hold up to 1,000 named guests." },
      { question: "Do guests need an account to reply?", answer: "No. The personal link opens the invitation and RSVP with no signup." },
    ],
  },
  {
    slug: "rsvps",
    title: "Understand RSVPs",
    summary: "Where replies land, what party size means and how guest replies stay private.",
    category: "guests",
    keywords: ["rsvp", "reply", "attending", "declined", "party size", "headcount", "guests coming", "results", "privacy"],
    minutes: 3,
    sections: [
      {
        heading: "The guest experience",
        body: [
          "Guests choose “I’ll be there” or “Can’t make it”, then add their name, party size (attending only) and an optional blessing. The success state celebrates the reply with a burst of confetti.",
          "Guests who opened a personal link already have their name and seat cap filled in.",
        ],
      },
      {
        heading: "Where to see replies",
        body: [
          "The RSVPs page lists every reply with the message and timestamp, and totals the number of guests coming. The dashboard home shows a quick overview.",
        ],
      },
      {
        heading: "Privacy",
        body: [
          "RSVPs are private: only the page owner can read them. Blessings are public guestbook entries tagged with the reply status, so they appear on the blessing wall.",
        ],
      },
    ],
    faq: [
      { question: "Can a guest change their reply?", answer: "Opening the invitation again lets them submit a new reply; the latest reply is shown in the dashboard." },
    ],
  },
  {
    slug: "day-of-check-in",
    title: "Check guests in on the day",
    summary: "Use the guest list as a door list and mark arrivals as people reach the venue.",
    category: "guests",
    keywords: ["check in", "check-in", "arrivals", "door", "day of", "showed up", "headcount", "welcome table"],
    minutes: 2,
    sections: [
      {
        heading: "Mark arrivals",
        steps: [
          "Open Guest list on your phone.",
          "Search for the guest by name.",
          "Tap check-in and record how many people arrived with them.",
          "Use the Showed up filter to see who is still expected.",
        ],
        note: "The counts are live, so several helpers can check guests in at the same time.",
      },
      {
        heading: "Keep a door list offline",
        body: [
          "Export the guest list as CSV before the event. It includes every name, group, personal link and reply, which makes a reliable backup at the welcome table.",
        ],
      },
    ],
  },
  {
    slug: "photos-and-memories",
    title: "Photos, guest uploads and memories",
    summary: "Collect photos before and after the event, moderate submissions and choose an album layout.",
    category: "memories",
    keywords: ["photos", "gallery", "uploads", "guest uploads", "moderation", "approve", "album", "memories", "masonry", "carousel", "timeline", "memory book"],
    minutes: 4,
    sections: [
      {
        heading: "Turn on guest photos",
        steps: [
          "Open Settings.",
          "Switch on Guest Photo Uploads.",
          "Save settings.",
          "Guests now see Share your photos in the Moments section, linking to the gallery upload form.",
        ],
      },
      {
        heading: "Moderate before they appear",
        body: [
          "Guest submissions arrive in the Moderation Queue on the Gallery page. Approve the ones you want, reject the rest, and delete or reorder approved photos at any time.",
          "Upload your own photos from the same page — they follow the same moderation flow.",
        ],
      },
      {
        heading: "Choose an album layout",
        body: [
          "The Gallery Layout setting controls how the album is presented: masonry, carousel or timeline. The layout is part of the design, so the same photos can feel completely different.",
        ],
        note: "The gallery stays available after the event date, which is what turns the invitation into your memory book.",
      },
    ],
    faq: [
      { question: "Is there a photo limit?", answer: "The current abuse cap is 2,000 photos per page. Normal albums are far below it." },
      { question: "Can guests see photos before approval?", answer: "No. Pending photos are only visible to you in the dashboard." },
    ],
  },
  {
    slug: "background-music",
    title: "Add background music",
    summary: "Pick a preset, a library track or your own song — and understand why music waits for a tap.",
    category: "design",
    keywords: ["music", "song", "audio", "sound", "piano", "acoustic", "orchestral", "ambient", "romantic", "music box", "autoplay"],
    minutes: 3,
    sections: [
      {
        heading: "Pick a track",
        body: [
          "Open Background Music in the editor or Settings. Choose a library track or paste a direct link to your own audio file.",
          "Each template has a default preset that matches its mood: piano, acoustic, orchestral, ambient, romantic or music box.",
        ],
      },
      {
        heading: "Why music starts on a tap",
        body: [
          "Browsers block autoplay with sound. The page shows “Tap anywhere for music” and starts the score on the guest’s first tap or key press.",
          "If a guest pauses the music, that choice is remembered on their device.",
        ],
      },
      {
        heading: "Custom songs",
        body: [
          "A custom music URL plays as a file first and falls back to the template preset if the file fails to load. Use a direct audio file link rather than a streaming page.",
        ],
      },
    ],
    faq: [
      { question: "Can I turn music off entirely?", answer: "Yes. Hide the Music section in the editor, which removes the player from the guest page." },
    ],
  },
  {
    slug: "publish-and-share",
    title: "Publish and share your invitation",
    summary: "Set your link, switch on publishing, and send the right link to every guest.",
    category: "sharing",
    keywords: ["publish", "share", "link", "slug", "url", "preview", "private", "draft", "seo", "search", "whatsapp"],
    minutes: 3,
    sections: [
      {
        heading: "Choose your page address",
        body: [
          "Your slug is the end of the link: /your-names. It must be 3–60 lowercase letters, numbers or hyphens, and it cannot match a built-in Dearly page.",
          "Change it in Settings. Old links stop working after a change, so update anything you have already sent.",
        ],
      },
      {
        heading: "Publish",
        body: [
          "New pages start as drafts. Switch Published on in Settings (or use the Publish button in the top bar) when you are ready for guests to open it.",
          "Use Preview to check the guest page at any time — it works even while the page is a draft.",
        ],
      },
      {
        heading: "Share",
        steps: [
          "Send the plain link to everyone: your-site/your-slug.",
          "Or send personal links from the Guest list so each guest is greeted by name.",
          "Keep the link in your save-the-date, message groups and QR code.",
        ],
        note: "Invitation pages are intentionally kept out of search results because they contain personal details. Only the marketing pages are indexed.",
      },
    ],
    faq: [
      { question: "Why does my page not show in Google?", answer: "Guest event pages are marked noindex on purpose. Share the direct link with guests instead." },
      { question: "Can I unpublish later?", answer: "Yes. Switch Published off in Settings to make the page private again without deleting anything." },
    ],
  },
  {
    slug: "after-the-event",
    title: "Turn the page into a memory book",
    summary: "After the date passes, RSVP steps aside and blessings and photos keep growing.",
    category: "memories",
    keywords: ["after", "memory book", "memories", "past", "archive", "keepsake", "photos", "blessings", "guestbook"],
    minutes: 2,
    sections: [
      {
        heading: "What changes after the date",
        body: [
          "Once the event date has passed, the invitation becomes a memory book. RSVP is hidden automatically; the story, schedule, photos and blessing wall remain.",
          "The same link keeps working, so guests can return to add photos and read the wishes.",
        ],
      },
      {
        heading: "Keep collecting",
        steps: [
          "Leave Guest Photo Uploads on if you want photos to keep arriving.",
          "Approved photos remain in the album under the chosen gallery layout.",
          "Blessings stay on the wall and in the guest book.",
        ],
      },
    ],
    faq: [
      { question: "Can I still edit the page after the event?", answer: "Yes. Names, story, photos and design remain editable from the dashboard." },
    ],
  },
  {
    slug: "other-occasions",
    title: "Weddings, birthdays, dinners and other occasions",
    summary: "One invitation engine for every celebration, with single-host support.",
    category: "occasions",
    keywords: ["wedding", "birthday", "party", "dinner", "social", "engagement", "anniversary", "baby shower", "single host", "event title", "occasion"],
    minutes: 3,
    sections: [
      {
        heading: "Choose the occasion",
        body: [
          "Onboarding shows every occasion as an equal choice — wedding, birthday, party, dinner and social, engagement, anniversary and baby shower. The occasion decides which templates are offered and the labels used across the page.",
        ],
      },
      {
        heading: "One host or two",
        body: [
          "Birthdays, parties and social events can have a single host — leave the second name empty. Couples’ occasions such as weddings, engagements and anniversaries ask for both names.",
          "Add an optional event title when the names alone do not tell the story, for example “Mia turns 30” or “Summer Rooftop Party”.",
        ],
      },
      {
        heading: "What stays the same",
        body: [
          "Every occasion gets the same features: RSVP, personal guest links, blessings, reactions, photos, music and the after-event memory book.",
        ],
      },
    ],
    faq: [
      { question: "Can I switch occasion later?", answer: "The occasion is chosen when the page is created. Create a new page if you need a different occasion type." },
    ],
  },
  {
    slug: "cards",
    title: "Create and share a card",
    summary: "Make a quick postcard, birthday, event, thank-you or holiday card and share its own link.",
    category: "occasions",
    keywords: ["card", "postcard", "birthday card", "thank you", "holiday", "greeting", "c/slug", "message", "sender", "recipient"],
    minutes: 3,
    sections: [
      {
        heading: "Create a card",
        steps: [
          "Open Cards in the dashboard.",
          "Choose a category: Postcard, Birthday, Event, Thank You or Holiday.",
          "Pick a template.",
          "Write the title, message and names, then choose the card address.",
          "Publish and copy the link.",
        ],
      },
      {
        heading: "Card details",
        body: [
          "Cards can include sender and recipient names, a date and a location where the template supports them. Each card gets its own /c/… link, separate from your invitation.",
        ],
        note: "Cards are independent of your event page. You can create as many as you like for different recipients.",
      },
    ],
    faq: [
      { question: "Do cards expire?", answer: "No. A published card keeps its link until you delete it." },
    ],
  },
  {
    slug: "ask-cards",
    title: "Make a date-night or proposal ask card",
    summary: "Create a playful question page with a runaway “No” button and a shareable link.",
    category: "occasions",
    keywords: ["ask card", "question", "proposal", "date night", "date", "runaway no", "cute", "q/slug"],
    minutes: 2,
    sections: [
      {
        heading: "Create a question",
        steps: [
          "Open Ask cards in the dashboard.",
          "Write the question or choose a preset.",
          "Add the names and choose the reaction style.",
          "Create the question and copy its /q/… link.",
          "Send it to the person you are asking.",
        ],
      },
      {
        heading: "How it behaves",
        body: [
          "The page shows a big “Yes” and a “No” that playfully runs away as the pointer approaches. The ask page is private and indexed separately from your invitation.",
        ],
      },
    ],
    faq: [
      { question: "Is an ask card the same as an invitation?", answer: "No. Ask cards live at /q/… and are a separate playful page; invitations are your main event page." },
    ],
  },
];

/** Normalises one word for search: lowercase, accents stripped, plurals folded. */
function fold(word: string): string {
  const w = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (w.length > 4 && w.endsWith("ies")) return `${w.slice(0, -3)}y`;
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

/** Splits a query or article into folded search words. */
function words(text: string): string[] {
  return text
    .split(/[^a-z0-9\u00c0-\u024f]+/i)
    .filter(Boolean)
    .map(fold);
}

/** Builds the searchable text for a guide: title, summary, category and body. */
export function guideHaystack(guide: Guide): string {
  const category = GUIDE_CATEGORIES.find((c) => c.id === guide.category);
  const parts = [
    guide.title,
    guide.summary,
    category?.label ?? "",
    ...guide.keywords,
    ...guide.sections.flatMap((s) => [s.heading, ...(s.body ?? []), ...(s.steps ?? []), s.note ?? ""]),
    ...(guide.faq ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return words(parts.join(" ")).join(" ");
}

/** Finds a guide by its slug; returns undefined when it does not exist. */
export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Returns guides in one category, preserving display order. */
export function guidesInCategory(category: GuideCategoryId): Guide[] {
  return GUIDES.filter((g) => g.category === category);
}

/**
 * Filters guides by a free-text query. Every word must match the guide's
 * haystack (AND), so “guest link” narrows to personal invites. An empty query
 * returns every guide unchanged.
 */
export function searchGuides(guides: Guide[], query: string): Guide[] {
  const terms = words(query);
  if (terms.length === 0) return guides;
  return guides.filter((g) => {
    const hay = guideHaystack(g);
    return terms.every((term) => hay.includes(term));
  });
}

/**
 * Picks related guides: same category first, then any guide sharing keywords,
 * then display order. The current guide is always excluded.
 */
export function relatedGuides(guide: Guide, limit = 3): Guide[] {
  const keywords = new Set(guide.keywords.map(fold));
  return GUIDES.filter((g) => g.slug !== guide.slug)
    .map((g, index) => {
      const shared = g.keywords.map(fold).filter((k) => keywords.has(k)).length;
      const score = (g.category === guide.category ? 2 : 0) + shared;
      return { guide: g, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.guide);
}
