export type Skill = {
  name: string;
  icon: string;
  blurb: string;
  url: `https://${string}` | null;
};

export const skills: Skill[] = [
  {
    name: "TypeScript",
    icon: "devicon-typescript-plain",
    blurb: "Strongly typed superset of JavaScript",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "Astro",
    icon: "devicon-astro-plain",
    blurb: "Static-first web framework for content-driven sites",
    url: "https://astro.build",
  },
  {
    name: "React",
    icon: "devicon-react-plain",
    blurb: "Component-based library for building user interfaces",
    url: "https://react.dev",
  },
  {
    name: "Rust",
    icon: "devicon-rust-plain",
    blurb: "Systems language focused on safety and performance",
    url: "https://www.rust-lang.org",
  },
  {
    name: "Nix",
    icon: "devicon-nixos-plain",
    blurb: "Declarative package manager for reproducible environments",
    url: "https://nixos.org",
  },
  {
    name: "Python",
    icon: "devicon-python-plain",
    blurb: "High-level language for automation and general-purpose development",
    url: "https://www.python.org",
  },
  {
    name: "C#",
    icon: "devicon-csharp-plain",
    blurb: "Modern object-oriented language for the .NET platform",
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/",
  },
  {
    name: "Angular",
    icon: "devicon-angular-plain",
    blurb: "Full-featured framework for large-scale single-page applications",
    url: "https://angular.dev",
  },
  {
    name: "Vue",
    icon: "devicon-vuejs-plain",
    blurb: "Progressive framework for building user interfaces",
    url: "https://vuejs.org",
  },
  {
    name: "PowerShell",
    icon: "devicon-powershell-plain",
    blurb: "Cross-platform shell and scripting language for automation",
    url: "https://learn.microsoft.com/en-us/powershell/",
  },
  {
    name: "PostgreSQL",
    icon: "devicon-postgresql-plain",
    blurb: "Advanced open-source relational database",
    url: "https://www.postgresql.org",
  },
  {
    name: "Azure",
    icon: "devicon-azure-plain",
    blurb: "Microsoft cloud platform for hosting, identity and infrastructure",
    url: "https://azure.microsoft.com",
  },
  {
    name: "Docker",
    icon: "devicon-docker-plain",
    blurb: "Platform for building and running containerized applications",
    url: "https://www.docker.com",
  },
  {
    name: "Linux",
    icon: "devicon-linux-plain",
    blurb: "Open-source Unix-like operating system kernel",
    url: "https://www.kernel.org",
  },
  {
    name: "Ansible",
    icon: "devicon-ansible-plain",
    blurb: "Automation tool for configuration management and provisioning",
    url: "https://docs.ansible.com",
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
