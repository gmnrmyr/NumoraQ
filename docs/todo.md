ToDo List. (ignore the number sorting, i just throwed the todos here!

✅ 0) **purchase logic for degen purchases**: use purchase as degen, backend consider as time + when done, stop service or allow user with ads (freemium).
*COMPLETED: Full Stripe integration with time stacking, webhook automation, and freemium trial system working*

✅ 0.1) **Fix chat gpt api** (was leaked when we made the project public). Webhook Stripe secret was also exposed. (i didnt notice those where hardcoded)
*PARTIALLY DONE: Stripe secrets moved to environment variables, ChatGPT API still hardcoded in chatgptService.ts line 51* <--- not any longer, we fixed and added to supabase edge functions -> secrets.

✅ 0.2) **Environment keys management**: Not sure how to merge dev to prod and if that will work well with env keys (chatgpt,stripe,supabase).. same as supabase keys.)
*IN PROGRESS: Stripe keys properly configured for sandbox/prod, need vault setup for other services*
<----- Found out! just write them on supabase edge function -> secrets. and it has been working with proper linking.


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
<--- Honestly, if it works... i dont mind it being clunky>


✅ 3) **Fix admin panel functionality**: Most of the functionality are not working due to supabase rls restrictions. They work mostly for admins but thats most likely cause of the restrictions in place
*COMPLETED: RLS policies fixed, admin email whitelist working, admin can assign points and manage users*
<---- most are working now, apparently... after changes on supabase, frontend and stripe config>

🔄 4) **Fix our themes that has animations** (like the animations on landing also has) and we were not able to imlement in the same way up until today. (it never appears).
*TODO: Unicorn Studio animations working on landing but not in advanced dashboard - needs implementation*

✅ 5) **(partially done) Populate database** which we are in (dev) with seed data. (Supabase best pratices).
*PARTIALLY DONE: Using developnpm branch with main data, but could use more comprehensive seed data*
<----  Not needed any longer since we are using prod database on dev.... and that has been fine.


🔄 6) **Finalize simple dashboard** (will provide more info)
*TODO: Simple dashboard exists but needs finalization and polish*
<---- Yeah, that is a must. But we cant disrupt current user's experience so we will need a dummy user and prob a way to reset this dummy user`s onboarding to test multiple times....>

🔄 7) **Finalize onboarding with simple dashboard** (will provide more info)  
*TODO: Onboarding flow exists but currently disabled, needs integration with simple dashboard*
<----- yep, that has to be done without breaking of course current user`s flow and some ppl already using without the onboarding.>

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
<--- really want this one. I need to generate the debank api key first...>

🔄 8.6) **nft category** (for our ai chatbot to also consider) and nft floor prices with opensea api.
*TODO: NFT category exists in asset management but needs OpenSea API integration for floor prices*
<-- tried to add new edge function and using opensea api correctly placed on env and also on supabase edge function secrets... stil wasnt able to suceed.>
  
🔄 9) **solana working to pay for tiers and degen plans**
*PARTIALLY DONE: Solana payment function exists with UPSERT logic, but needs wallet integration testing*
<---- havent tested to be honest. But we made stripe work and also codes and admin able to assign, so I think this is really for after MVP...>

🔄 10) **evm working to pay for tiers and plans**
*PARTIALLY DONE: EVM crypto monitoring exists, needs full wallet connect integration*
<--- same as solana. since we made stripe and admin able to give acces, we good for now... maybe after MVP.>

🔄 11) **dbeaver migration** -> we will go to dbeaver at some point cause its cheaper and we can host ourselves and backup ourselves, but before we need all auth related done cause superbase is amazing with it.
*TODO: Future optimization after all core functionality complete* 
<---- i really dont think that is needed, free supabase is working fine for now>

✅ 12) **RLS supabase rules** that allow admin codes to work and admins to acess and manage data. Also users to use leaderboard.
*COMPLETED: RLS policies working, admin codes functional, admin data access working, leaderboard accessible*

✅ 13) **leaderboard xp track + something displayed** (less rls rules shoudl allow)
*COMPLETED: Leaderboard working with XP tracking, user stats, rankings, and proper RLS permissions*

🔄 14) **External admin panel**: get ready to create and or sync with external admin panel (make our ctr+shift+e panel to be external on other domain like cms.numoraq)
*TODO: Current admin panel functional but needs migration to external CMS domain*
<---- i really dont think we will be able to do this... just improve our current one when needed.>

🔄 15) **Translation system**: translation scripts or full app translation to portuguese at least. we need at least 2 languages portuguese and english
*PARTIALLY DONE: Translation infrastructure exists, Portuguese translations partially implemented*
<---- yeah partially done, this is more for for after MVP I think>

🔄 16) **Multi-currency support**: currencies (not only usd brl) on main adv. dashboard
*TODO: Currently supports USD/BRL, needs expansion to other major currencies* <--- Yeah, I would really like that! Same as users allow to have BTC or ETH as their main currency (some ppl like that)>

🔄 17) **NFT minting integration**: Allow our users to mint nft that we make and give them points or degen time.
*TODO: Future feature for user engagement and additional monetization*
<--- i would really like that after the MVP but not mandatory now>

🔄 18) **(should be before) unicorn studio animations fix**: Degen users and some tier based as well will have (and already have) different themes via "dev. menu". we need to make SOME of this themes with animation (like we have on landing). we have been trying that for a long time and still have not succeeded. the exact thing we want to make work perfectly on landing but we can't manage to make it in our advanced dashboard.
*TODO: Critical UI enhancement - animations work on landing but not in dashboard*
<---- Yeah tbh I would really like this but has been super hard.>

🔄 18.5) **Vault integration**: use vault to store not only this keys but keys for other webapps we are building. (both prod and dev)
*TODO: Security enhancement for multi-project key management*
<---- I dont really think we will need this since we are using supabase -> edge functions -> secrets and it has been working just fine.

🔄 19) **Banner management**: banner space on admin panel (we should be able to easily upload a png for dashboard users)
*TODO: CMS feature for dynamic dashboard banners*
<---- really for the future... not needed b4 mvp I think>

🔄 20) **Enhanced charts**: more charts, more detail on charts (we love the charts) we have on projection.
*TODO: Expand projection charts with more data visualization options*
<---- I really like the chart as it is now! Maybe improve the iliquid chart... that is still odd =P>

🔄 21) **Mobile app**: (it already works, but either way)
*PARTIALLY DONE: PWA functionality exists, native app development pending*
<--- totally functional currently... we dont need it on the app store tbh or google play... at least not any where b4 mvp>

🔄 22) **Documentation improvement**: awesome documentation better than the one we have.
*PARTIALLY DONE: Comprehensive docs exist, could use better organization and examples*
<--- fine for now...>

🔄 23) **Remove debugging features**: when EVERYTHING is tested and correct -> remove visual debugging features (leave CMS of COURSE.). (I will specify when and which ones)
*TODO: Clean up diagnostic tools and dev features for production*
<--- for sure this will be the last thing.... or we can maybe only display them for admin users.... maybe, but for now its ok lets keep until its fully ready for MVP>

🔄 24) **Portfolio history charts**:
  - Daily value snapshots
  - Growth/loss visualization  
  - AI spending advice based on trends
  (below projection maybe)
*TODO: Historical data tracking and visualization system*
<---- no idea  how we gonna do this... prob good for after mvp>


🔄 25) **Polish UI**:  A lot of redundant info. A lot to be improved, a lot of things not clear enough for users to find, although I can find them easily. Not all users can. And a lot of debugging features to be removed later. Maybe we can leave them as toggable for now until we fully debug everything.
*ONGOING: Continuous UI/UX improvements*
<--- yeah, ongoing atm>

🔄 26) **Open banking sync**: paypal, pix, etc.
*TODO: Integration with external financial services*
<--- def not amywhere before mvp... should be after>

✅ 27) **(should be before) trial timer is working**: we need to make sure when trial is done either charge or allow more days for free while in beta
*COMPLETED: Trial system working with 30-day trials, beta grace period functional, trial expiration handling working*
<--- last tests: Trial ended after user had 30 days, but 3 days grace button isn not working ATM which is fine tbh>

🔄 28) **Expense insights**: check if user pays health insurance and etc, otherwise advise to.
*TODO: AI-powered expense analysis and recommendations*
<--- yeah, that would be nice. and make our chat ui better, it doesnt auto roll when chat gpt sent msgs , and some other improvements. i also saw the chat not sending the full msg (like he sent cut) not sure if thats on our end.>

🔄 29) **Age-based AI insights**: ask for age.. for ai to have more data (user set born day). and influence on ai insights... if person is young age, medium age or old ai has different insights i think..
*TODO: Demographic data collection for personalized AI advice*
<---- totally after MVP I think... or maybe when we do the onboarding.>

🔄 30) **Asset change tracking**: when user updates an asset, system needs to understand and track what happened, example it should ask if user is changing the price because it has appreciation or depreciation of that money he had, and that should trigger a log on that asset... or if he wants to remove the assets, cause he sold it.. it can also trigger maybe as an info on the long run. example: system would understand he sold an nft to buy an apartment and over time will have tools to see if that was a good decision or not. (that also syncs when we add charts for PAST history as well... not only for future.)
*TODO: Advanced asset lifecycle tracking and decision analysis system*
<---- I think this will be fkng hard to do.....>

✅ 31) **Enhanced projection chart dates and balance indicators**: Date to be shown on projection chart. (not only month x like month 12... but the real month of real year it will be)
*COMPLETED: Chart now shows "M3 (Mar 2025)" format with color-coded dots (green for positive balance, red for negative balance), enhanced tooltips, and visual legend*

✅ 31) Automatically sort expenses by date. ((done))


32) link expense to achievement (iliquid asset to have value assigned upon said variable expense is paied - after this expense is triggered, user`s iliquid asset should have grown - schedule this asset to have value upon that maybe. or the asset to be CREATED with VALUE opon that event). <---  And, if the date for this EXPENSE that is linked is changed by user, the iliquid asset value assign or creation should follow. (and then, we will have a really good Liquid and Iliquid Assets charts that makes sense considering that some users will be setting expenses there to purchase real estate and stuff like that.)

33) add a way for users to track what he spent on a month, then we can use this to make an average or allow the user to see it raw in order to have info to fill his recurring expenses. Maybe our ai can auto fetch and fill as well. <- This would be nice to be implemented on onboarding as well in the future.
<--- I think: Expenses Inputter or somehting should be on hamburger menu, when user clicks, open a new page (that is not on dashboard) where users can go adding what he spent on this month and then there will be a live result below showing how much total and categorizing it for him and there should be a button like -> import to recurring expenses" option.<<--- >>

34) I think the Openai secret that is glitched can be linked to supabase edge function secrets? <-- double check that...> (i think supabase edge functions SECRETS are the equivalent to project .env right?) <------ FIXED> working, made it following the notes on the left (working on dev.)

35) Debt and User when goes negative. -> For example, debt should be ticking %fees. when user goes negative, usualy pays %fees daily or monthly for bank. This should be in place for DEBT and when certain amount of expenses are triggering a debt on the projection as well. 
<---- would be reallly nice to have that, don't really know how to.>

36) PROFILE PAGE. let's build a profile page that is outside the dashboard. We will build it from scratch, adding functionalities we have on user_info_config_ui (panel on advanced dashboard).

37) better categories for better reports and for our ai chat to understand everything. On all places: expenses, portfolio (liquid and iliquid) both needs to have nft, real estate (commercial) - real estate (residential) and stuff like that.

38) visual gallery of your assets & all you got... stuff like that. So if its a NFT, dislpay the nft. If it's a real estate, users get to add either a nice google street view or input picture, something like that. Stuff like that to the future. 
->> second idea would be a 3d version of the assets... for premium user... toggleable, maybe. made on spline, easy to upload on frontend.. but on a gallery view or something, cause would take a lot of gpu from user like our main page anim. does.

39) income breakdown (at advanced dashboard) seems to be wrong, look:

Income Breakdown
Passive Income
R$ 4,118.005
Active Income
R$ 600
Recurring Expenses
R$ 9,495
Net Monthly
R$ -18,816

--> I think it's taking in consideration the one-time expense which isn't good to be displayed o this panel. Maybe we can remove it and put something else, or proper calculations in there.
(((( FIXED!!!))))

40) "assets" tab? we have centralized everything on portfolio -> liquid and iliquid assets, we MIGHT remove this one. but it's gonna be a decision for later. Or sync both... and also sync passive income... but not sure if it's needed.

41) Iliquid assets to accept a list (csv or json from excel). Keep the list inside a Title. allow a ">" to open the list and edit each item, see category (will input excel for example) - good for my "notforsale goods" list. And also in order for the title not to get too big. Cause some users are putitng on title the items they have inside a "not for sale goods" list like notebook, car, electronis, etc. but they still want to keep track of those items, category and value.

42) info toolbox on panels --> a small i for users to hover or click and understand best pratices on using such panel on advanced dashboard mostly..

--------

Don't break:
- Any other logic already implemented (there is really a LOT.)

Keep using free APIs.

small