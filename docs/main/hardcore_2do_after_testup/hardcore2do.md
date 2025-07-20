ToDo List after we've properly implemented our tech branches & test database.

1) Fix payment for both "Degen Plans" (Premium plans) and "Donation Tiers" via stripe. We need both of this payments to work via Stripe without breaking the other logic in place. (Admins should also be able to keep providing codes). Without breaking trials as well

2) Fix Admin Panel Design>
Currently, we have 3 admin panels being shown up when we hit ctr+shift+e. That's super undesireable, it has to be a proper admin panel with only 1 panel not 3. Of course, no functions can be broken during the process

3) Fix admin panel functionality:
Most of the functionality are not working due to supabase rls restrictions. They work mostly for admins but thats most likely cause of the restrictions in place

4) Fix our themes that has animations (like the animations on landing also has) and we were not able to imlement in the same way up until today. (it never appears).

5) Populate database which we are in (dev) with seed data. (Supabase best pratices).

6) Finalize simple dashboard (will provide more info)

7) Finalize onboarding with simple dashboard (will provide more info)

8) 