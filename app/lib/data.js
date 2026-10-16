export const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/dirghraj-giri', icon: 'Linkedin' },
  { name: 'Instagram', url: 'https://www.instagram.com/drj1zz', icon: 'Instagram' },
  { name: 'GitHub', url: 'https://github.com/drj7zz', icon: 'Github' },
  { name: 'X / Twitter', url: 'https://x.com/drj7zz', icon: 'Twitter' },
  { name: 'Reddit', url: 'https://www.reddit.com/user/Ok-Fox-4670', icon: 'Globe' },
  { name: 'Email', url: 'mailto:giridirghraj@gmail.com', icon: 'Mail' }
];

export const facts = [
  ['Location', ['Parsa, Madhesh', 'Nepal']],
  ['Education', ['Bachelor of Information', 'Technology (BIT)']],
  ['Discipline', ['Software Development', '& Engineering']],
  ['Approach', ['Methodical, reliable', '& performance-driven']]
];

export const heroSignals = [
  ['Smartphone', 'Responsive-first'],
  ['Accessibility', 'Accessible by design'],
  ['Users', 'Production-ready']
];

export const skills = [
  ['Code2', 'Modern JavaScript & TypeScript', 'Engineering interactive, type-safe, and maintainable architectures with strong browser fundamentals.', 'CORE'],
  ['Layout', 'Software Architecture & Interfaces', 'Building clear, responsive interfaces and maintainable software with accessible interaction patterns.', 'BUILD'],
  ['GitBranch', 'Open Source & Version Control', 'Driving reproducible builds, automated CI/CD workflows, collaborative pull requests, and peer reviews.', 'SCALE']
];

export const careerStrengths = [
  ['01', 'Product-Minded Architecture', 'Translating user requirements and product vision into resilient, high-performance interfaces that deliver immediate value.'],
  ['02', 'Precision & Standards', 'Accessibility (WCAG), responsive performance, semantic structure, and maintainable codebases are foundational to every release.'],
  ['03', 'Engineering Ownership', 'Committed to continuous delivery, open-source standards, and driving high-impact technical initiatives within cross-functional teams.']
];

export const projects = [
  {
    id: 'kaalyug-os',
    name: 'KAALYUG OS',
    description: 'An interactive desktop-inspired portfolio experience.',
    stack: 'JavaScript',
    code: 'https://github.com/drj7zz/giridirghraj',
    live: 'https://giridirghraj.vercel.app',
    order: 1
  },
  {
    id: 'kaalyug',
    name: 'KAALYUG',
    description: 'A TypeScript project exploring the KAALYUG web ecosystem.',
    stack: 'TypeScript',
    code: 'https://github.com/drj7zz/kaalyug',
    live: 'https://kaalyug.vercel.app',
    order: 2
  },
  {
    id: 'yugcoin',
    name: 'YugCoin',
    description: 'A transparent digital wallet interface with a double-entry ledger.',
    stack: 'JavaScript',
    code: 'https://github.com/drj7zz/yugcoin',
    live: 'https://yugcoin.vercel.app',
    order: 3
  },
  {
    id: 'quiz-game',
    name: 'Quiz Game',
    description: 'A focused browser quiz game built with JavaScript fundamentals.',
    stack: 'JavaScript',
    code: 'https://github.com/drj7zz/quiz-game',
    live: 'https://quiz-game-drj.vercel.app',
    order: 4
  }
];

export const blogPosts = [
  {
    id: 'building-accessible-web',
    title: 'Building Accessible Web Interfaces from Day One',
    date: '2026-07-28',
    readTime: '4 min read',
    tags: ['Accessibility', 'HTML', 'UX'],
    excerpt: 'Accessibility is not a feature you bolt on at the end — it is the foundation of thoughtful software development. Here is how I approach it.',
    content: 'When I started building websites, I thought accessibility meant adding alt tags to images and calling it a day. The more I built, the more I realized that true accessibility is about architecture, not an afterthought checklist.\n\n**Semantic HTML is 80% of the battle.** Using <button> for actions and <a> for navigation seems obvious, but you\'d be surprised how often <div> with an onClick handler replaces proper elements. Screen readers rely on semantic tags to convey meaning, hierarchy, and interactive states.\n\n**Keyboard navigation is non-negotiable.** If a user can\'t tab through your interface and interact with every element, you\'ve locked people out. I test every component I build by putting my mouse away and using only the keyboard.\n\n**ARIA labels are your friend, not a crutch.** Use them when native semantics aren\'t enough, but don\'t over-use them. A <button> with clear text content doesn\'t need an aria-label — that\'s redundant and can actually confuse assistive technologies.\n\nThe beauty of building with accessibility in mind from the start is that it usually results in cleaner, more semantic code. It forces you to think about structure before style, which is exactly the right order.\n\nI\'m still learning, but I\'ve made it a rule: if it\'s not accessible, it\'s not done.'
  },
  {
    id: 'first-pr',
    title: 'Lessons from My First Open Source PR',
    date: '2026-08-05',
    readTime: '6 min read',
    tags: ['Open Source', 'Git'],
    excerpt: 'Contributing to open source for the first time taught me more about collaboration, git, and code review than any tutorial ever could.',
    content: 'I remember the anxiety of opening my first pull request on a public repository. What if my code is terrible? What if I break something? What if the maintainers think I\'m wasting their time?\n\nNone of those things happened. Here\'s what actually happened, and what I learned.\n\n**Reading code is a skill.** Before writing a single line, I spent hours reading the existing codebase. Understanding the patterns, conventions, and architecture of a project taught me more than building my own projects from scratch ever did. You start to see why experienced developers make certain choices.\n\n**Git hygiene matters.** My first attempt had messy commit messages and too many changes in one commit. I learned to write clear, descriptive commit messages and to keep each commit focused on a single logical change. git rebase -i became my best friend.\n\n**The review process is where growth happens.** The maintainer\'s feedback on my PR was detailed and kind. They pointed out edge cases I hadn\'t considered, suggested a more idiomatic way to write a particular function, and explained their reasoning. That single code review was worth weeks of self-study.\n\n**Small contributions have big impact.** My PR wasn\'t a massive feature addition — it was a documentation improvement and a small bug fix. But it mattered. It made the project slightly better, and it gave me the confidence to contribute again.\n\n**The community is welcoming.** The open source community, at its best, is remarkably generous with knowledge and encouragement. Most maintainers genuinely appreciate contributions, even from newcomers.'
  },
  {
    id: 'event-delegation',
    title: 'Understanding JavaScript Event Delegation',
    date: '2026-08-12',
    readTime: '5 min read',
    tags: ['JavaScript', 'Performance'],
    excerpt: 'Event delegation is one of those JavaScript patterns that seems simple on the surface but reveals deep truths about how the DOM actually works.',
    content: 'One of the most elegant patterns in JavaScript is event delegation, and understanding it well can transform how you write frontend code.\n\n**The problem it solves.** Imagine a list with 500 items, each needing a click handler. Attaching 500 individual event listeners is expensive — it consumes memory, slows down rendering, and makes dynamic content (adding/removing items) painful to manage.\n\n**How it works.** Instead of attaching a listener to each item, you attach a single listener to the parent container. When an event fires on a child element, it \'bubbles\' up through the DOM tree. The parent catches it and uses event.target to determine which child triggered it.\n\n```javascript\ndocument.querySelector(\'.item-list\').addEventListener(\'click\', (event) => {\n  const item = event.target.closest(\'.item\');\n  if (!item) return;\n  handleItemClick(item);\n});\n```\n\n**Why closest() matters.** The event.target might be a nested element inside your item (like a span or icon). Using event.target.closest(\'.item\') traverses up the DOM to find the actual element you care about, making the pattern robust regardless of internal markup.\n\n**Performance benefits are real.** With delegation, you have one listener instead of hundreds. This matters especially in single-page applications where DOM nodes are frequently created and destroyed. No need to manually add and remove listeners as content changes.'
  },
  {
    id: 'design-tokens-darkmode',
    title: 'Designing Cohesive Color Tokens for Light & Dark Themes',
    date: '2026-08-19',
    readTime: '5 min read',
    tags: ['CSS', 'Design Systems', 'Dark Mode'],
    excerpt: 'How to structure semantic CSS custom properties so dark mode feels natural, readable, and perfectly balanced rather than an inverted afterthought.',
    content: 'Building dark mode is not simply inverting background and text colors. True dark theme design requires rethinking contrast ratios, perceived elevation, and color psychology.\n\n**Avoid Pure Black (#000000).** Pure black creates harsh, eye-straining contrast against bright text. Deep navy blues (like #0b1220) and rich charcoals provide a softer, more modern canvas that feels intentional.\n\n**Semantic Token Architecture.** Instead of hardcoding hex colors throughout components, define semantic roles:\n\n```css\n:root {\n  --bg: #f7f5f0;\n  --ink: #1b2420;\n  --muted: #5e6b63;\n  --line: #d1cbbe;\n  --accent: #ba412d;\n}\n\n[data-theme=\'dark\'] {\n  --bg: #0b1220;\n  --ink: #dbe7f5;\n  --muted: #8aa0bd;\n  --line: #1e2c44;\n  --accent: #6aa5ff;\n}\n```\n\n**Adjust Accent Vibrancy.** High-saturation accents that look great on light backgrounds often vibrate harshly against dark surfaces. Increasing lightness and slightly desaturating accents for dark mode keeps them readable and elegant.\n\n**Smooth Transitions.** Add a brief transition on background-color and color to ensure the theme switch feels silky and polished across the whole viewport.'
  },
  {
    id: 'design-process',
    title: 'From Idea to Interface: My Design Process',
    date: '2026-08-24',
    readTime: '4 min read',
    tags: ['Design', 'Workflow'],
    excerpt: 'How I go from a vague idea to a polished interface — a structured process that keeps projects focused and prevents scope creep.',
    content: 'Every project starts the same way for me: a vague idea and a blank screen. Over time, I\'ve developed a process that turns that blank screen into a working interface without getting lost along the way.\n\n**Step 1: Define the core interaction.** Before any design or code, I ask: what is the ONE thing a user should be able to do? For YugCoin, it was \'check a wallet balance.\' For the Quiz Game, it was \'answer a question and see if you\'re right.\' Everything else is secondary.\n\n**Step 2: Paper sketch first.** I sketch layouts on paper — rough boxes, arrows, basic flow. This takes 10 minutes and saves hours of rework. Paper doesn\'t let you get distracted by colors or fonts. It forces you to think about structure and flow.\n\n**Step 3: Build the skeleton in HTML.** Semantic HTML first, no styling. Just the structure. If the page makes sense when you read the raw HTML, you\'ve got a solid foundation.\n\n**Step 4: Layer in styles systematically.** I start with typography and spacing — the two elements that do 80% of the visual work. Then colors and borders. Then interactive states (hover, focus, active). Finally, animations and transitions. This order prevents the common mistake of making something \'look nice\' before it \'works well.\'\n\n**Step 5: Test with real content.** Placeholder text and dummy data hide problems. I use real content as early as possible. Real headlines are different lengths. Real descriptions break layouts. Real data reveals edge cases that \'Lorem ipsum\' never will.\n\n**Step 6: Get feedback, then iterate.** I show the work to someone who hasn\'t been staring at it for hours. Fresh eyes catch things I\'ve become blind to — confusing labels, unclear navigation, interactions that feel wrong.'
  }
];
