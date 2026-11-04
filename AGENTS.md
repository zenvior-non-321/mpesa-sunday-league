<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep public league appointments in `public/league-officials.js`, separate from portal access records, so public titles never grant permissions.

- Mirror authorized league_shared_state writes into dedicated league record tables with a transactional database trigger; this keeps managed records consistent without granting viewers write access.
- Keep player contact and admission details in a private table; public player records contain sporting fields only.
- All browser-saved `mpesa_*` records sync through `public/cloud-sync.js` to `app_data_store` via the portal `store` action; `classifyStoreKey` decides access, and a trigger mirrors each record into its dedicated table — one sync path keeps every page consistent across devices.
