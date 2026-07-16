
# Encryptd

- All commits must follow [Conventional Commits](https://www.conventionalcommits.org/).
- One conceptual change per commit.
- Body is a bullet list explaining each specific change.

```bash
<type>(<scope>): <short summary>

<body (bullet list preferred)>
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `ci`, `perf`

- Never use npm as a package manager within this project, use pnpm instead, for everything.
- Never use emojies within this project at all. Both in our frontend setup or within console logs.
- Never delete any changes, whenever you are told to commit changes, just commit changes from where you are.
- Never create unnecessary md files without the users consent.
- Avoid using `---` within our documentation md files to split the sections.
- When creating GitHub issues, or Pull Requests use clean descriptions without checkboxes, task lists, or markdown todo items.
- Incase the user asks u to commit a certain number of commits, implement exactly those numbers of commits, don't do commits that are way less than what the user explicitly requested, and ensure that those commits has actual data within them of even changes that will be committed, and not just empty blank commits.
- Follow YAGNI Principles and one-liner solutions
