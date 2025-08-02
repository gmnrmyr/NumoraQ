ToDo List after we've properly implemented our tech branches & test database.

0) purchase logic for degen purchases: use purchase as degen, backend consider as time + when done, stop service or allow user with ads (freemium).

0.1) Fix chat gpt api (was leaked when we made the project public). Webhook Stripe secret was also exposed.

0.5) purchase logic for tier purchases:

0.6) need login flow on dev (google, etc...)

0.7) need more data on dev (or way to add.. tiers, trial time if acc was not on database... etc)

1) Fix payment for both "Degen Plans" (Premium plans) and "Donation Tiers" via stripe. We need both of this payments to work via Stripe without breaking the other logic in place. (Admins should also be able to keep providing codes). Without breaking trials as well

2) Fix Admin Panel Design>
Currently, we have 3 admin panels being shown up when we hit ctr+shift+e. That's super undesireable, it has to be a proper admin panel with only 1 panel not 3. Of course, no functions can be broken during the process

3) Fix admin panel functionality:
Most of the functionality are not working due to supabase rls restrictions. They work mostly for admins but thats most likely cause of the restrictions in place

4) Fix our themes that has animations (like the animations on landing also has) and we were not able to imlement in the same way up until today. (it never appears).

5) (partially done) Populate database which we are in (dev) with seed data. (Supabase best pratices).

6) Finalize simple dashboard (will provide more info)

7) Finalize onboarding with simple dashboard (will provide more info)

8) (DONE!) admin acces, ok via sql script runned on supabase!

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

8.5) evm wallet fetch (debank like api or debank api itself)

8.6) nft category (for our ai chatbot to also consider) and nft floor prices with opensea api.
  
9) solana working to pay for tiers and degen plans

10) evm working to pay for tiers and plans

11) dbeaver migration -> we will go to dbeaver at some point cause its cheaper and we can host ourselves and backup ourselves, but before we need all auth related done cause superbase is amazing with it.

12) RLS supabase rules that allow admin codes to work and admins to acess and manage data. Also users to use leaderboard.

13) leaderboard xp track + something displayed (less rls rules shoudl allow)

14)get ready to create and or sync with external admin panel (make our ctr+shift+e panel to be external on other dmain like cms.numoraq)

15) translation scripts or full app translation to portuguese at least. we need at least 2 languages portuguese and english

16) currencies (not only usd brl) on main adv. dashboard

17) mint process integration. Alow our users to mint nft that we make and give them points or degen time.

18) (should be before) <- unicorn studio animatios fix. Degen users and some tier based as well will have (and already have) different themes via "dev. menu". we need to make SOME of this tehemes with animation (like we have on landing). we have been trying that for a long time and still have not suceeded. the exact thing we want to make work perfectly on landing but we can't manage to make it in our advanced dashboard.

18.5) use vault to store not only this keys but keys for other webapps we are building. (both prod and dev)

19) banner space on adin panel (we should be able to easily upload a png for dashboard users)

20) more charts, more detail on charts (we love the charts) we have on projection.

21) app (it already works, but either way)

22) awesome documentation better than the one we have.

23) when EVERYTHING is tested and correct -> remove visual debugging features (leave CMS of COURSE.). (I will specify when and which ones)

24) ->>> - Portfolio history charts:
  - Daily value snapshots
  - Growth/loss visualization
  - AI spending advice based on trends
  (below projection maybe)

25) polish UI.

26) openbank sync... paypal, pix, etc.

27) (shoould be before) <-- trial timer is working, we need to make sure when trial is done either charge or allow more days for free while in beta>

28) insights on expenses... check ... see if user pays health insurance and etc, otherwise advise to.

29) ask for age.. for ai to have more data (user set born day). and inflluence on ais insights... if person is young age, medium age or old ai has different insights i think..

30) when user updates an asset, system needs to understand and track what happend, example it should ask if user is changing the price because it has appreciattion or depretiation of that money he had, and that should trigger a log on that asset... or if he wants to remove the assets, cause he sold it.. it can also trigger maybe as an info on the long run. example: system would understand he sold an nft to buy an apartment and over time will have tools to see if that was a good decision or not. (that also syncs when we add charts for PAST history as well... not only for future.)

--------

Don't break:

- Any other logic already implemented (there is really a LOT.)
- 