I'll dig into the admin content flow to answer this properly. Let me read the relevant files.
• Read apps/admin/src/pages/manage-content/ContentHub.jsx, apps/admin/src/pages/manage-content/ContentList.jsx, apps/admin/src/pages/manage-content/EditorForm.jsx, apps/server/src/models/Article.js
Now let me look at how the content pages define the category dropdowns — that's where the answer lies.
• Read apps/admin/src/pages/manage-content/ContentListPages.jsx
Let me find the editor form with the "Primary Category" and "Additional Category" dropdowns.
• Read apps/admin/src/pages/manage-content/Editors.jsx
Now let me check what  ARTICLE_CATEGORIES  actually contains — that's the list in the "Primary Category" dropdown.
Let me check the full RESOURCES config, the admin routes, and how the public site maps categories to sections.
• Read apps/admin/src/lib/constants.js, apps/admin/src/App.jsx
Let me confirm the route wiring and how the client site groups categories.
• Read apps/admin/src/routes/AdminRoutes.jsx, apps/client/src/pages/ArticlesSection.jsx
Let me quickly verify how the public site's Interviews/Podcasts pages query articles, to complete the picture.
The searcher had a hiccup with those paths — let me read the files directly.
• Read apps/client/src/pages/Interviews.jsx, apps/client/src/pages/ArticlesHub.jsx
I read through the whole content flow — here's the complete picture, straight from the code.
How content actually works
Everything — articles, research reports, success stories, interviews, podcasts — is stored in ONE database collection ( Article ). They are not separate content types. The only thing that separates them is the  category  field you set in the "Primary Category" dropdown.
1. Does the Primary Category dropdown contain all content types?
Yes. The dropdown ( ARTICLE_CATEGORIES  in  apps/admin/src/lib/constants.js ) has:
> General, Case Study, Research, Explainer, Interview, News, Opinion, Success Stories, Podcast
That covers every section the public site shows ( /articles , Research & Reports, Success Stories,  /interviews , Podcasts). So yes — one dropdown covers everything.
⚠️ One gap: the public site's Articles section also accepts two categories — "Impact Story" and "Policy Brief" — but they are NOT in the admin dropdown. You literally cannot select them right now.
2. Can everything be posted directly from here?
Yes — and this is the most powerful editor on the site. The Articles editor (with the Primary Category dropdown) has everything: rich text content, featured image, gallery, video/audio upload (for podcasts/interviews), tags, SEO analyzer, SEO properties panel, permalink editing, Featured toggle, date override, and autosave. Whatever category you pick, that's where it appears on the public site.
3. What about the "add from elsewhere" options?
Here's what the code revealed. The sidebar Research & Reports / Success Stories / Interviews / Podcasts sections each have their own "Add New" button, but those editors are simpler copies that:
- Hard-code the category ( defaultValues={{ category: 'Research' }}  etc.) so it can't be changed — that's their only advantage (category can't be wrong).
- Are missing features compared to the Articles editor: no SEO analyzer, no SEO properties, no tags, no permalink editing, no Featured toggle, no date override, no autosave.
- Post to the same  /articles  API — so there's zero difference in what gets created, only in which form you fill out.
My recommendation
Option A (cleanest): Remove the 4 dedicated editors and keep only Articles → Add New with the dropdown. One place to create all content, full features everywhere. Add "Impact Story" and "Policy Brief" to the dropdown list to close the gap. Risk: someone picks the wrong category (minor — easy to fix later in edit).
Option B (safest): Keep the dedicated buttons, but make them use the full Articles editor with the category pre-selected. You get category-locking and all features. Slightly more code, no redundancy.
Option C (current state): Keep as-is — it works, but you have two different-quality forms doing the same job, which is exactly the confusion you're feeling.
I've only read files — no changes made. Want me to implement Option A or B?