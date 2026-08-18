# Google Search Console — Setup & Indexing Guide

> Target: get every **new article** on ravivarvichar.in discovered and indexed by
> Google automatically, and let the old-website results fade out.
>
> The technical SEO work is already done in the repo (dynamic sitemap.xml +
> robots.txt, real 404s for old URLs, canonical tags, Article schema). This
> guide covers the Google-side steps only. Do them once, in order.

---

## Step 0 — Deploy the SEO changes first

Nothing on this guide works until the new code + nginx config are live:

```bash
# LOCAL (this machine):
git add -A && git commit -m "SEO: dynamic sitemap + robots, canonical/schema fixes, real 404s"
git push origin main

# ON THE DROPLET:
cd /var/www/RavivarVichar
bash scripts/deploy.sh                          # pull → build → restart API
bash scripts/apply-seo-nginx.sh                 # nginx: proxy robots/sitemap + real 404s
```

Then verify from your local machine:

```bash
curl -s https://ravivarvichar.in/robots.txt     # ends with "Sitemap: ..." line
curl -s https://ravivarvichar.in/sitemap.xml    # real XML with <url> entries, not HTML
curl -s -o /dev/null -w "%{http_code}\n" https://ravivarvichar.in/bank-sakhi   # expect 404
curl -s -o /dev/null -w "%{http_code}\n" https://ravivarvichar.in/articles     # expect 200
```

---

## Step 1 — Add the property to Search Console

1. Go to <https://search.google.com/search-console> and sign in with the Google
   account that should own the site (use the Ravivar Vichar account).
2. Click **Add property** → choose **Domain** (not "URL prefix").
3. Type: `ravivarvichar.in` → **Continue**.
4. Google gives you a **DNS TXT record**, e.g.:

   ```
   Name:  _dnsauth
   Value: google-site-verification=xxxxxxxxxxxxxxxx
   ```

5. Open Cloudflare → **ravivarvichar.in** → **DNS → Records → Add record**:
   - **Type:** TXT
   - **Name:** `_dnsauth` (leave off the `.ravivarvichar.in` part)
   - **Content:** paste the full `google-site-verification=...` value
   - **TTL:** Auto
6. Back in Search Console, click **Verify**. It propagates in minutes (Cloudflare DNS is instant).

> Domain property covers `www`, `admin`, and every subdomain under one roof —
> this is the recommended setup and what the sitemap URLs (non-www) will match.

---

## Step 2 — Submit the sitemap

1. In Search Console → **Sitemaps** (left menu).
2. Enter: `sitemap.xml` → **Submit**.
3. Within a day you should see "Success" with the discovered URL count
   (currently ~15 entries: 13 pages + every published article).

> The sitemap is generated live from the database — every article you publish
> as **Published** (status) appears in it automatically within seconds. Drafts
> are never included.

---

## Step 3 — Request indexing for the articles that already exist

1. In Search Console, click **URL Inspection** (top search bar).
2. Paste the exact article URL, e.g.:
   `https://ravivarvichar.in/articles/sarthak`
3. Wait for the check → if it says *"URL is on Google"* or *"URL is not on
   Google"*, click **Request indexing**.
4. Repeat for the other published article. **Do this only for 1–2 key URLs** —
   for everything else let the sitemap + internal links do the work.

> "Request indexing" is not instant — expect hours to a few days for the first
> crawl. The sitemap submission is what keeps *future* articles flowing in
> automatically.

---

## Step 4 — Let the old-website results drop

The old URLs (`/bank-sakhi`, `/lijjat-papad`, `/Tags/...`, `/kahaniyan`, ...)
now return **real 404s** instead of a fake 200 page. Google will gradually
remove them from results on its own — usually within a few weeks to a couple of
months after re-crawling.

To speed it up (optional):

1. In Search Console → **Removals → Temporary removals → New request**.
2. Paste the old URLs one by one (they disappear from results for ~6 months —
   the permanent fix is the 404, which is already in place).
3. Do **not** use "Removals" on any current pages, and do not redirect old URLs
   to the homepage — leave them 404ing.

---

## Step 5 — Enable Cloudflare Crawler Hints (free, helps indexing)

1. Cloudflare → **ravivarvichar.in** → **Caching → Configuration**.
2. Turn on **Crawler Hints**.

This tells search engines when content changes on your site, so newly published
articles get picked up faster.

---

## Step 6 — What "working" looks like

After 1–2 weeks:

- **Pages → Indexing** in Search Console shows the article URLs as *Indexed*.
- Searching the exact title of a new article finds the new page.
- New articles you publish **now** need no manual steps — they appear in the
  sitemap instantly, get crawled, and get indexed.

### If an article still isn't indexed after ~3 weeks

1. **URL Inspection** on that URL → check for coverage issues (it will tell you
   the exact reason).
2. Make sure the article is **Published** (not Draft) in the admin.
3. Make sure **SEO Properties → "Exclude from search engines"** is **off** for
   it.
4. Request indexing once more. If it persists, the page may just be low-priority
   for Google — add a couple of internal links to it (related-articles links
   already help) and wait.

---

## Notes

- The site is a React SPA. Google **can** render it, but rendering is a second,
  slower step. The sitemap + real 404s + canonical tags remove the reasons
  Google might ignore it. If you ever want *faster/more guaranteed* indexing,
  the next step would be server-side pre-rendering of article pages for
  crawlers — say the word and it can be added.
- Old indexed pages are **not** deleted or redirected by this setup — they
  simply stop being re-validated as live pages.
