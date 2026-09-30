# Your first contribution

Add only `contributors/<your GitHub login>.yml`:

```yaml
github: your-login
session: the-session-uuid-from-your-issue
primary_language: Python
learning_goal: learn_open_source_workflow
```

Keep these four fields as strings. Do not change scripts, workflows, package files or other contributors' files. Include the exact session marker and `Closes #<issue>` in your PR description. After the maintainer requests changes, make `learning_goal` more specific (20–500 characters) and push to the same branch. Do not open a second PR.

CI parses YAML and checks the path, author and session. A maintainer verifies the revision before approval and squash merge. First-time fork workflows may require a repository maintainer to approve the individual run.
