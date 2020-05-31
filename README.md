# wakingandsleeping

Tweets posted before going to bed or after waking up, mapped. Particularly in this intensely virtual, remote, and global time, this is a reflection on world interconnectedness and our daily waves of wakedness across the globe.

Inspired by Lin-Manuel Miranda's series of "gmorning, gnight" Tweets and his book with Jonny Sun, [Gmorning, Gnight!: Little Pep Talks for Me & You](https://bookshop.org/books/gmorning-gnight-little-pep-talks-for-me-you/9781984854278) :)

# Setup

Firstly, clone this repo and navigate into it, then do some setting up on Twitter and in Node:

## Twitter
The Twitter API lets us access data as developers through the use of these keys and tokens, which are unique to each developer account, and so shouldn't be shared or committed to a public repo. Here are steps to get your own keys and tokens!
1. Create a [Twitter Developer](https://developer.twitter.com/en/apply-for-access) account.
2. Create a new [app](https://developer.twitter.com/en/apps). You can call it whatever you want; I called mine "wakingandsleeping", from where you'll copy your own keys and tokens later.

## MapQuest
Same idea as Twitter, but more straightforward.
1. Head over to [MapQuest](https://developer.mapquest.com/plan_purchase/steps/business_edition/business_edition_free/register) to create an account if you don't have one already.
2. Click into [your keys](https://developer.mapquest.com/user/me/apps) and continue on to the final section.

## Development environment
1. Install [NPM](https://www.npmjs.com/) and [Node](https://nodejs.org/en/).
2. In the project folder, install the required Node modules by typing this into your command line:
```bash
npm install
```
3. In your project files, make a duplicate of the ".env.example" file and name this new file ".env". Paste in the four keys/tokens from Twitter and the one key from MapQuest.

# Run
```bash
npm start
```

# Acknowledgements
This project uses:
* [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/)
* [Twitter API](https://developer.twitter.com/)
* [MapQuest API](https://developer.mapquest.com/)
* [Leaflet](https://leafletjs.com/)
* [Mapbox](https://www.mapbox.com/)