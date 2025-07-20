ToDo List after we've properly implemented our tech branches & test database.

0) purchase logic for degen purchases: use purchase as degen, backend consider as time + when done, stop service or allow user with ads (freemium).

0.5) purchase logic for tier purchases:

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

12

--------

Don't break:

- Any other logic already implemented (there is really a LOT.)
- 