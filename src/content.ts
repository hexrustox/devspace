export type Skill = {
  name: string;
  icon: string;
  blurb: string;
  url: `https://${string}` | null;
  colors: [string, string, string, string];
};

export const skills: Skill[] = [
  {
    name: "TypeScript",
    icon: "devicon-typescript-plain",
    blurb: "Strongly typed superset of JavaScript",
    url: "https://www.typescriptlang.org",
    colors: ["#8ec5ff", "#3178c6", "#1e5aa8", "#123a6b"],
  },
  {
    name: "Astro",
    icon: "devicon-astro-plain",
    blurb: "Static-first web framework for content-driven sites",
    url: "https://astro.build",
    colors: ["#ffc091", "#ff5d01", "#b83d00", "#5c1f00"],
  },
  {
    name: "React",
    icon: "devicon-react-plain",
    blurb: "Component-based library for building user interfaces",
    url: "https://react.dev",
    colors: ["#b3ecff", "#61dafb", "#2aa8c7", "#135a6e"],
  },
  {
    name: "Rust",
    icon: "devicon-rust-plain",
    blurb: "Systems language focused on safety and performance",
    url: "https://www.rust-lang.org",
    colors: ["#ffb08f", "#ce422b", "#93301d", "#4a180e"],
  },
  {
    name: "Nix",
    icon: "devicon-nixos-plain",
    blurb: "Declarative package manager for reproducible environments",
    url: "https://nixos.org",
    colors: ["#a9cde8", "#7eb6e6", "#5277c3", "#2c4a75"],
  },
  {
    name: "Python",
    icon: "devicon-python-plain",
    blurb: "High-level language for automation and general-purpose development",
    url: "https://www.python.org",
    colors: ["#ffe28a", "#ffd343", "#4b8bbe", "#2b5b8c"],
  },
  {
    name: "C#",
    icon: "devicon-csharp-plain",
    blurb: "Modern object-oriented language for the .NET platform",
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/",
    colors: ["#a48af0", "#512bd4", "#38209c", "#1f1259"],
  },
  {
    name: "Angular",
    icon: "devicon-angular-plain",
    blurb: "Full-featured framework for large-scale single-page applications",
    url: "https://angular.dev",
    colors: ["#ff8fa8", "#dd0031", "#99001f", "#4d0010"],
  },
  {
    name: "Vue",
    icon: "devicon-vuejs-plain",
    blurb: "Progressive framework for building user interfaces",
    url: "https://vuejs.org",
    colors: ["#a5f0cf", "#42b883", "#2c8a61", "#175a41"],
  },
  {
    name: "PowerShell",
    icon: "devicon-powershell-plain",
    blurb: "Cross-platform shell and scripting language for automation",
    url: "https://learn.microsoft.com/en-us/powershell/",
    colors: ["#a9c9ff", "#5391fe", "#2b5fb8", "#122c5c"],
  },
  {
    name: "PostgreSQL",
    icon: "devicon-postgresql-plain",
    blurb: "Advanced open-source relational database",
    url: "https://www.postgresql.org",
    colors: ["#8fb6d9", "#336791", "#24496b", "#122a40"],
  },
  {
    name: "Azure",
    icon: "devicon-azure-plain",
    blurb: "Microsoft cloud platform for hosting, identity and infrastructure",
    url: "https://azure.microsoft.com",
    colors: ["#7cc2ff", "#0078d4", "#005ba1", "#00325a"],
  },
  {
    name: "Docker",
    icon: "devicon-docker-plain",
    blurb: "Platform for building and running containerized applications",
    url: "https://www.docker.com",
    colors: ["#8ec9ff", "#2496ed", "#1663a8", "#0b3a63"],
  },
  {
    name: "Linux",
    icon: "devicon-linux-plain",
    blurb: "Open-source Unix-like operating system kernel",
    url: "https://www.kernel.org",
    colors: ["#ffe07a", "#fdc500", "#c29200", "#614800"],
  },
  {
    name: "Ansible",
    icon: "devicon-ansible-plain",
    blurb: "Automation tool for configuration management and provisioning",
    url: "https://docs.ansible.com",
    colors: ["#ff9d9d", "#ee0000", "#a80000", "#540000"],
  },
];

export type Project = {
  name: string;
  readmeUrl: `https://${string}`;
};

export const projects: Project[] = [
  {
    name: "OctaDash",
    readmeUrl:
      "https://raw.githubusercontent.com/hexrustox/octadash/refs/heads/main/README.md",
  },
  {
    name: "Nix Capsule",
    readmeUrl:
      "https://raw.githubusercontent.com/hexrustox/nix-capsule/refs/heads/main/README.md",
  },
  {
    name: "Dotrift",
    readmeUrl:
      "https://raw.githubusercontent.com/hexrustox/dotrift/refs/heads/main/README.md",
  },
];

export type ContactLink = {
  label: string;
  url: `https://${string}` | `mailto:${string}`;
};

export const contactLinks: ContactLink[] = [
  { label: "Email", url: "mailto:hello@example.com" },
  { label: "GitHub", url: "https://github.com/hexrustox" },
  { label: "GitLab", url: "https://gitlab.com/codnixus" },
];

export const contactHeading = "Say hello.";
export const contactBlurb =
  "The fastest way to reach me is email — I'm also on GitHub and GitLab.";
export const contactAvailability = "Open to work";

export const footerNote = "© 2026";
