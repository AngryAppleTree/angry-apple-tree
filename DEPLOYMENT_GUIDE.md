# Angry Apple Tree - Deployment Pipeline

## 🌍 Environments

| Environment | Purpose | URL | Source Branch |
| :--- | :--- | :--- | :--- |
| **Local** | Development | `http://localhost:8000` | Local Files |
| **Preview** | **Test / Staging** | [Vercel Preview URL] | `develop` |
| **Production** | **Live** | `https://angryappletree.com` | `main` |

---

## 🚀 Workflow & Commands

### 1. Start Local Dev
Run this to view changes on your machine before pushing.

```bash
cd "App dummy/angry-apple-tree"
python3 -m http.server 8000
```
*   **Result**: Site available at `http://localhost:8000`

### 2. Deploy to Test (Preview)
Push changes to the `develop` branch to update the staging environment.

```bash
# 1. Stage and Commit Changes
git add .
git commit -m "Description of changes"

# 2. Push to GitHub (Triggers Vercel Deploy)
git push origin develop
```
*   **Result**: Vercel updates the **Preview** URL.

### 3. Deploy to Live (Production)
Merge tested code from `develop` into `main` to update the public website.

```bash
# 1. Switch to Main Branch
git checkout main

# 2. Merge Changes from Develop
git merge develop

# 3. Push to Live (Triggers Vercel Deploy)
git push origin main

# 4. Return to Develop for Future Work
git checkout develop
```
*   **Result**: Vercel updates `https://angryappletree.com`

---

## 🛠 Configuration Details

*   **Hosting**: Vercel
*   **Repository**: GitHub (`AngryAppleTree/angry-apple-tree`)
*   **Domain**: IONOS (DNS) → Vercel
