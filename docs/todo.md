ToDo List after we've properly implemented our tech branches & test database.

✅ 0) **purchase logic for degen purchases**: use purchase as degen, backend consider as time + when done, stop service or allow user with ads (freemium).
*COMPLETED: Full Stripe integration with time stacking, webhook automation, and freemium trial system working*

⚠️ 0.1) **Fix chat gpt api** (was leaked when we made the project public). Webhook Stripe secret was also exposed. (i didnt notice those where hardcoded)
*PARTIALLY DONE: Stripe secrets moved to environment variables, ChatGPT API still hardcoded in chatgptService.ts line 51*

🔄 0.2) **Environment keys management**: Not sure how to merge dev to prod and if that will work well with env keys (chatgpt,stripe,supabase).. same as supabase keys.)
*IN PROGRESS: Stripe keys properly configured for sandbox/prod, need vault setup for other services*

✅ 0.5) **purchase logic for tier purchases**: 
*COMPLETED: Donation tier system fully working with point accumulation and tier recognition*

✅ 0.6) **need login flow on dev** (google, etc...)
*COMPLETED: Google OAuth working, email/password login functional*

✅ 0.7) **need more data on dev** (or way to add.. tiers, trial time if acc was not on database... etc)
*COMPLETED: Admin panel can add points, premium codes working, trial system functional*

✅ 1) **Fix payment for both "Degen Plans" (Premium plans) and "Donation Tiers"** via stripe. We need both of this payments to work via Stripe without breaking the other logic in place. (Admins should also be able to keep providing codes). Without breaking trials as well
*COMPLETED: Both payment types working via Stripe webhooks, admin codes functional, trials preserved*

🔄 2) **Fix Admin Panel Design**: Currently, we have 3 admin panels being shown up when we hit ctr+shift+e. That's super undesireable, it has to be a proper admin panel with only 1 panel not 3. Of course, no functions can be broken during the process
*PARTIALLY DONE: SecureAdminPanel is the main one, but multiple panels may still appear - needs consolidation*

✅ 3) **Fix admin panel functionality**: Most of the functionality are not working due to supabase rls restrictions. They work mostly for admins but thats most likely cause of the restrictions in place
*COMPLETED: RLS policies fixed, admin email whitelist working, admin can assign points and manage users*

🔄 4) **Fix our themes that has animations** (like the animations on landing also has) and we were not able to imlement in the same way up until today. (it never appears).
*TODO: Unicorn Studio animations working on landing but not in advanced dashboard - needs implementation*

🔄 5) **(partially done) Populate database** which we are in (dev) with seed data. (Supabase best pratices).
*PARTIALLY DONE: Using developnpm branch with main data, but could use more comprehensive seed data*

🔄 6) **Finalize simple dashboard** (will provide more info)
*TODO: Simple dashboard exists but needs finalization and polish*

🔄 7) **Finalize onboarding with simple dashboard** (will provide more info)  
*TODO: Onboarding flow exists but currently disabled, needs integration with simple dashboard*

✅ 8) **admin access** - ok via sql script runned on supabase!
*COMPLETED: Admin role working, manera@gmail.com has super admin access*

```sql
-- Step 2: Insert or update the profile  
INSERT INTO public.profiles (id, name, admin_role, admin_level)
SELECT id, 'Admin User', true, 'super'
FROM auth.users
WHERE email = 'admin@admin.com'
ON CONFLICT (id) 
DO UPDATE SET 
  admin_role = true,
  admin_level = 'super',
  updated_at = now();
```

🔄 8.5) **evm wallet fetch** (debank like api or debank api itself)
*TODO: Wallet integration exists but needs DeFiLlama/DeBank API for comprehensive portfolio tracking*

🔄 8.6) **nft category** (for our ai chatbot to also consider) and nft floor prices with opensea api.
*TODO: NFT category exists in asset management but needs OpenSea API integration for floor prices*
  
🔄 9) **solana working to pay for tiers and degen plans**
*PARTIALLY DONE: Solana payment function exists with UPSERT logic, but needs wallet integration testing*

🔄 10) **evm working to pay for tiers and plans**
*PARTIALLY DONE: EVM crypto monitoring exists, needs full wallet connect integration*

🔄 11) **dbeaver migration** -> we will go to dbeaver at some point cause its cheaper and we can host ourselves and backup ourselves, but before we need all auth related done cause superbase is amazing with it.
*TODO: Future optimization after all core functionality complete*

✅ 12) **RLS supabase rules** that allow admin codes to work and admins to acess and manage data. Also users to use leaderboard.
*COMPLETED: RLS policies working, admin codes functional, admin data access working, leaderboard accessible*

✅ 13) **leaderboard xp track + something displayed** (less rls rules shoudl allow)
*COMPLETED: Leaderboard working with XP tracking, user stats, rankings, and proper RLS permissions*

🔄 14) **External admin panel**: get ready to create and or sync with external admin panel (make our ctr+shift+e panel to be external on other domain like cms.numoraq)
*TODO: Current admin panel functional but needs migration to external CMS domain*

🔄 15) **Translation system**: translation scripts or full app translation to portuguese at least. we need at least 2 languages portuguese and english
*PARTIALLY DONE: Translation infrastructure exists, Portuguese translations partially implemented*

🔄 16) **Multi-currency support**: currencies (not only usd brl) on main adv. dashboard
*TODO: Currently supports USD/BRL, needs expansion to other major currencies*

🔄 17) **NFT minting integration**: Allow our users to mint nft that we make and give them points or degen time.
*TODO: Future feature for user engagement and additional monetization*

🔄 18) **(should be before) unicorn studio animations fix**: Degen users and some tier based as well will have (and already have) different themes via "dev. menu". we need to make SOME of this themes with animation (like we have on landing). we have been trying that for a long time and still have not succeeded. the exact thing we want to make work perfectly on landing but we can't manage to make it in our advanced dashboard.
*TODO: Critical UI enhancement - animations work on landing but not in dashboard*

🔄 18.5) **Vault integration**: use vault to store not only this keys but keys for other webapps we are building. (both prod and dev)
*TODO: Security enhancement for multi-project key management*

🔄 19) **Banner management**: banner space on admin panel (we should be able to easily upload a png for dashboard users)
*TODO: CMS feature for dynamic dashboard banners*

🔄 20) **Enhanced charts**: more charts, more detail on charts (we love the charts) we have on projection.
*TODO: Expand projection charts with more data visualization options*

🔄 21) **Mobile app**: (it already works, but either way)
*PARTIALLY DONE: PWA functionality exists, native app development pending*

🔄 22) **Documentation improvement**: awesome documentation better than the one we have.
*PARTIALLY DONE: Comprehensive docs exist, could use better organization and examples*

🔄 23) **Remove debugging features**: when EVERYTHING is tested and correct -> remove visual debugging features (leave CMS of COURSE.). (I will specify when and which ones)
*TODO: Clean up diagnostic tools and dev features for production*

🔄 24) **Portfolio history charts**:
  - Daily value snapshots
  - Growth/loss visualization  
  - AI spending advice based on trends
  (below projection maybe)
*TODO: Historical data tracking and visualization system*

🔄 25) **Polish UI**:  A lot of redundant info. A lot to be improved, a lot of things not clear enough for users to find, although I can find them easily. Not all users can. And a lot of debugging features to be removed later. Maybe we can leave them as toggable for now until we fully debug everything.
*ONGOING: Continuous UI/UX improvements*

🔄 26) **Open banking sync**: paypal, pix, etc.
*TODO: Integration with external financial services*

✅ 27) **(should be before) trial timer is working**: we need to make sure when trial is done either charge or allow more days for free while in beta
*COMPLETED: Trial system working with 30-day trials, beta grace period functional, trial expiration handling working*

🔄 28) **Expense insights**: check if user pays health insurance and etc, otherwise advise to.
*TODO: AI-powered expense analysis and recommendations*

🔄 29) **Age-based AI insights**: ask for age.. for ai to have more data (user set born day). and influence on ai insights... if person is young age, medium age or old ai has different insights i think..
*TODO: Demographic data collection for personalized AI advice*

🔄 30) **Asset change tracking**: when user updates an asset, system needs to understand and track what happened, example it should ask if user is changing the price because it has appreciation or depreciation of that money he had, and that should trigger a log on that asset... or if he wants to remove the assets, cause he sold it.. it can also trigger maybe as an info on the long run. example: system would understand he sold an nft to buy an apartment and over time will have tools to see if that was a good decision or not. (that also syncs when we add charts for PAST history as well... not only for future.)
*TODO: Advanced asset lifecycle tracking and decision analysis system*

✅ 31) **Enhanced projection chart dates and balance indicators**: Date to be shown on projection chart. (not only month x like month 12... but the real month of real year it will be)
*COMPLETED: Chart now shows "M3 (Mar 2025)" format with color-coded dots (green for positive balance, red for negative balance), enhanced tooltips, and visual legend*

🔄 31) Automatically sort expenses by date.

--------

Don't break:
- Any other logic already implemented (there is really a LOT.)

Keep using free APIs.