- [X] Fix Stripe integration (degen plans and donation tiers) [seems to be working partially] [works for degen plans correctly! But not for donation tiers!] 

(oh, on degen plans... it should be triggering time after the payment confirmed. So if user purchased 1 month it adds that time... when its over, it should be showing that user is not degen anymore.) <-- for now. and add that functionality that ask him to pay. allow him to auto-assign himself 3 extra days (during beta) so add myself 3 extra days to continue during beta.> ((not working yet, not showing on user_ui_config panel... non-degen users should have this period of time being triggered and shown on user_ui config panel on advanced dashboard.))


- [ ] Fix Solana integration (degen plans and donation tiers) (still not working)

- [ ] Fix CMS functionality (degen code creation and degen points assignment for admins) [partially working for degen codes] <--- working partially, cause it doenst apply the degen status, despite being shown as applied on cms. and I'm worried to ask you to make this work cause i dont want it to break the stripe functionality. but would be really nice to have it. <--- stil working>

- [ ] User Management & UID System (for admins to assign points to users for tiers testing is not working)


----

- [ ] Make new users trigger 30 days free trial. <--- should also be showing on user_config_ui (panel on dashboard). And for now when the trial is over, it should be showing the user that the trial is over and that they need to pay to continue using the app. (of course, unless he adds a degen coupon or pay the app)
(basically, users that are not degen should have this time being triggered properly I think))

<---- for now we only would need to add trial status for those users, and whhen its over we will ask him to pay before continuing. Make user confirm and give him no-degen for 3 days. This is on beta only. After that users wont be ablle to assign them this 3 days ofc. And keep their data of course so when they want to pay, they can of course continue.


-----

- [ ] Finish all trasnlations, onboarding flow and simple dashboard.

- [ ] Fix the animations we are trying to implement on dashboard, like we have on landing page for specific users (Degen, and Specific Tiers).

- [ ] When we're done with all above, we will change the stripe key from test to prod.

- [ ] Make our test.numoraq.com work with proper documentation for me to actually work mainly on test and not on prod. but make me a way to update both backend,database and frontend to prod. also a way to backup everything on test. (last!!!)

--------

then we will add more functionality like wallet connection, nft fetching from opensea and more.