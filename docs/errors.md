when tryinig to improve the app, by implementing the stripe payment integration on month degen and lifetime degen, i lost the following: (we broke backend on supabase probably..)

- admin hability to create degen codes
- users lost their degen status (lifetime, etc)
- user lost their donation tags (whale, champion, etc.)
- degen users are now seeing ads (cause they`re no longer degen)
- stripe still doesnt work, we broke trying to make it work and we actually lost a lot of the app (above)
- ai chatbot no longer work (because users lost degen status, and AI was only for degen statuses.) (which means that if we can tackle the hability to create degen codes and assign points, we can also tackle the ai chatbot)

------------------------

The functionality stays the same, but we lost it on backend. So instead of restoring it, we just keep as it is and continue from here.

when we manage to make stripe and solana payments work for both degen plans and donation tiers, then we can restore the following:

- admin hability to create degen codes and assign points (two different things on admin panel)
- then we will see if ai chatbot and no ads work back again.

----> Then, we will be able to continue with the app, adding functionality from system-architecture.md.

