# First Contribution Sandbox

Public training repository for the First Contribution Loop platform.

1. Sign in to the platform with GitHub and create your personal Issue.
2. Read the Issue, Fork this repository, Clone your Fork and create a branch.
3. Add only `contributors/<your-username>.yml` using the two lines in your Issue.
4. Check `git status`, `git diff`, stage with `git add`, inspect `git diff --cached`, commit and push.
5. Open a PR against the upstream default branch. Include the session marker and `Closes #<issue-number>` from the platform.
6. Wait for GitHub Actions and the Sandbox Maintainer Bot's Request Changes.
7. Add or update `learning:` with a 20–500 character explanation of commit vs. push. Commit and push to the same branch.
8. After CI and Bot approval, the Bot merges and closes the Issue. Return to the platform for reflection.

Do not add personal details or secrets. This repository and all contributions are public.

First-time fork workflows may require maintainer approval in GitHub. Student code is never executed: CI reads the submitted text via API using the trusted validator from the base revision.
