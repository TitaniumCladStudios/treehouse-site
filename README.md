# Hyperspace CMS
They're jumping to lightspeed!

Hyperspace CMS is a simple to use, embedded CMS that is meant to be deployed to a single hosting platform such as Netlify or Vercel. The project serves as a template that can be cloned so that custom frontend components can be built using Sveltkit, while the endpoints already exist to fetch custom CMS data that is created via the admin interface. Think of it as a headful CMS like WordPress, but the content is stored in JSON files in the project itself and versioned via GIT.

## But Why?
I didn't want to host a database, and most of my smaller clients don't need anything larger than this. I needed something minimal in terms of admin functionality that they could log into to edit content, and I wanted to enjoy cheap, single service hosting on Netlify.But

## Doesn't this Exist
Not in my preferred stack of Sveltekit. TinaCMS got close, but configuring it to work with Sveltekit can be a headache, and you can't host it on Netlify. All the endpoints on this project are on netlify as cloud functions, and the frontend is a built static site. It's quite simple.But

## What's the full stack?
Good question. Several pieces of tech went into this, most of which I chose to get better at using:

- Sveltekit
- Typescript
- Tailwind
- Storybook
- The github API for production updates

If I add any more or think of any more, I'll add them here.
