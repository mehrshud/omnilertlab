# Commit and Push to GitHub (main branch)

Use this guide from the **repository root** (`A:\Github\omnilertlab`), not from the `v2` folder.

---

## 1. Open terminal at repo root

```powershell
cd A:\Github\omnilertlab
```

---

## 2. See what’s changed

```powershell
git status
```

- **Uncommitted changes** → follow step 3.
- **All committed, on a branch other than main** → go to step 4.

---

## 3. Commit your changes (if needed)

Stage everything (or only specific paths):

```powershell
# Stage all changes
git add .

# Or stage only v2 (if repo has v1 + v2)
# git add v2/
```

Commit with a clear message:

```powershell
git commit -m "Your short description, e.g.: Update README and fix dependencies"
```

---

## 4. Get your work onto `main` and push

You’re currently on `overhaul-glassmorphism`. To put that work on `main` and push:

**Option A — Merge into main locally, then push (simplest)**

```powershell
git checkout main
git pull origin main
git merge overhaul-glassmorphism -m "Merge overhaul-glassmorphism into main"
git push origin main
```

**Option B — Push your branch, then merge on GitHub**

```powershell
git push origin overhaul-glassmorphism
```

Then on GitHub: **Repository → Pull requests → New pull request**: base `main`, compare `overhaul-glassmorphism` → Create → Merge.

---

## 5. Confirm on GitHub

- Open: https://github.com/mehrshud/omnilertlab  
- Check that **main** has the latest commits.

---

## Quick reference

| Goal              | Command |
|-------------------|--------|
| See branch        | `git branch` |
| See status        | `git status` |
| Stage all         | `git add .` |
| Commit            | `git commit -m "message"` |
| Switch to main    | `git checkout main` |
| Update main       | `git pull origin main` |
| Merge branch      | `git merge overhaul-glassmorphism` |
| Push main         | `git push origin main` |

---

**Note:** Never commit `.env.local` or real API keys. Only commit `.env.example` (with placeholders).
