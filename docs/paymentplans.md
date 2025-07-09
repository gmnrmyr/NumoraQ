Payment Plans ---------------------------------------------

Payment plans are a way to allow users to pay for a subscription over a period of time. Those plans are called DEGEN plans in our app. It basically gives user acess to the app with premium features for a certain amount of time.

That feature is implemented in the app and is currently working. We manually, via Admin CMS (acessible via ctr+shift+e for admins) assign degen plans to user manually.

At the moment, we are trying to implement a way to recieve user payments via stripe and process them in our app, giving the user the correct acess he purchased for (degen amount of time). And also we need for this to trigger the timing of the degen plan in order to remenber the user to renew his plan when it's about to end.

Degen plans are: (payments page https://numoraq.online/payment)
(should be redirected to this page, when users click to "buy a plan")

(all usd)
- Monthly (9.99$)
- 3 Months (24.99$)
- 6 Months (44.99$)
- Yearly (79.99$)
- Lifetime (limited time) ($299)

Donation Tiers ---------------------------------------------

Donation tiers are a way to allow users to support the project, by donating a certain amount of money and recieve tiers (that users see on their profile inside dashboard, first thing there).

Donations are different than degen plans, because they are not access to the app or premium features, but a way to support the app and get tiers. Some tieres also give acess to certain visual features in the app, like backgrounds for example. Backgrounds are in implementation, some that only changes the basic visual (css) are working, the ones that add animations on the background are not working yet. These animations should be simmilar to the one displayed in the landing page. Although, we have spent some time on this, we have not been able to implement them yet.

Donation tiers are: (donateion page: https://numoraq.online/donate)
(should be redicrected to this page, when users click to "donate" or improve tiers)
Newcomer, supporter, friend, helper, contributor, donor, backer, supporter, champion, patron, legend, whale
When user buy a tier, it add the amount of points referred to that tier to his profile. So for example, users could buy multiple legend tiers and archieve whale tier.

--------------------------------------------------------------


We still have not properly implemented a way to recieve both of those payments.
This is one of our main goals.

To be able to recieve payments for degen plans and for donation tiers. Users needs to choose how to pay and we are implementing that. We need at least 1 payment method that works, and that's why we're implementing stripe for now.

The second would be to implement via Solana, since we are also connecting solana wallet to the app and Supabase seem to have a way to connect to solana wallet.

The third way would be via EVM wallets, like metamask, walletconnect, etc.

And the fourth way would be to fetch via ethereum transaction for example. (we have started). Where user saves his wallet adress and confirms he have sent the payment,  we fetch the eth transaction and the user gets credits where he can spend to buy degen plans or donation tiers.

--------------------------------------------------------------



