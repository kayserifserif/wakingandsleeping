# wakingandsleeping

"Good morning" and "good night" tweets, mapped.

**A bit of background**

Created during this intensely virtual, remote, and global time, this project is a reflection on world interconnectedness and our daily waves and flares of activity and wakedness across the globe. The hope is that you could open the webpage at any time during your day/night and see where in the world people are waking up and going to sleep. Inspired largely by Lin-Manuel Miranda's series of "gmorning, gnight" tweets and his book with Jonny Sun, [Gmorning, Gnight!: Little Pep Talks for Me & You](https://bookshop.org/books/gmorning-gnight-little-pep-talks-for-me-you/9781984854278) :)

**On geotagging**

This project relies on tweets that are geotagged, either with exact coordinates or with a "place". Coordinates, the most granular location type (as specific as a street intersection), are given by the phone's GPS as the place where someone is when they send the tweet. Place, a coarser location type, is a named location (business, city, country) around someone that they can choose before sending the tweet.

Geotagging is an incredible feature for researchers and data visualisers (not to mention, of course, business and advertisers). The "big data" method of data collection utilised prevalently on so many platforms—"collect anything and everything that might be remotely insightful"—allows a researcher to see detailed geospatial trends that are happening *right this moment* with just a few lines of code, whereas a pre-internet researcher may have had to ride on a bicycle around a region for years to be able to amass a largeish amount of data.

However, while just over 3.5% of tweets were geotagged in 2012 (three years after geotagging was introduced on Twitter), that percentage has dropped steadily to around 1.5% of tweets since 2017 ([Kalev Leetaru, Forbes](https://www.forbes.com/sites/kalevleetaru/2019/03/04/visualizing-seven-years-of-twitters-evolution-2012-2018/#404c0cb07ccf)—fascinating charts, by the way, if you're interested!). Our decreasing trust and interest in geotagging hints at the deep concerns we have about privacy today. There's a lack of transparency (we don't know when our location is being collected, how often, and how detailed) and a lack of agency (invisible defaults and slippery opt-outs instead of meaningful opt-ins can overwhelm and blindside). 

Is this project an ethical use of the data I'm able to access through Twitter? Without knowing whether all of the people are aware of and consenting to being geotagged (and rather suspecting many aren't), it's hard to say yes, but hopefully only showing truncated tweets without any personally revealing information provides enough anonymity for this to pass for the moment.

**Some limitations**

Owing to the limitations of both the standard plan and Twitter's own data parsing, there are a couple major factors that make the project less comprehensive and accurate than hoped.

- Languages

> Non-space separated languages, such as CJK are currently unsupported. —[Standard stream parameters](https://developer.twitter.com/en/docs/tweets/filter-realtime/guides/basic-stream-parameters)

This project uses Twitter's Streaming API, with the "statuses/filter" endpoint. This means that a connection is constantly open between the app and Twitter, through which Twitter sends tweets in realtime that match with the keywords I specify in the "track" parameter. The explanation hints at spaces being a challenging technical hurdle—Twitter's algorithm for breaking a tweet down into keywords doesn't know what to do with a tweet written in languages like Chinese, Japanese, or Korean, which may lack word-separating spaces. Unfortunately, by multiple metrics, this leaves out a large population of people and internet users. On total number of speakers: combined varieties of Chinese bring it to 1st on the list, Japanese is 13th, and Korean is 22nd ([2019 Ethnologue](https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers#Ethnologue_(2019,_23rd_edition))). On languages on the internet: Chinese is 2nd and Japanese is 8th ([Statista](https://www.statista.com/statistics/262946/share-of-the-most-common-languages-on-the-internet/)). On languages on Twitter: Japanese is 2nd, Thai (another non-space separated language) is 9th, and Korean is 10th ([Statista via Mashable](https://mashable.com/2013/12/17/twitter-popular-languages/)).

- Exact matching

> Exact matching of phrases (equivalent to quoted phrases in most search engines) is not supported. —[Standard stream parameters](https://developer.twitter.com/en/docs/tweets/filter-realtime/guides/basic-stream-parameters)

Twitter matches a tweet as long as the words in one of the key phrases exists in the tweet, regardless of order. This means that a key phrase "good night" might match with a tweet posted in the morning that says, "last night was good", resulting in some confusing or self-contradicting points in the viz.

**Resulting musings about Twitter**

- By looking at geolocation, the project is inherently biased towards people who are using their phones to tweet—the GPS capability of the phone makes it much easier, and in fact, I don't know if you can geotag your tweet from your laptop?

- I haven't looked too much into data/research for this, but Twitter seemed to me to have developed from a semi-private journal for one's everyday happenings into a constant deluge of a whole world's very-public-facing declarations. These simple "good morning"s and "good night"s are a different side of modern Twitter I don't experience much on my feed.

---

# Setup

Firstly, clone this repo and navigate into it, then do some setting up on Twitter and in Node:

**Twitter**

The Twitter API lets us access data as developers through the use of these keys and tokens, which are unique to each developer account, and so shouldn't be shared or committed to a public repo. Here are steps to get your own keys and tokens!
1. Create a [Twitter Developer](https://developer.twitter.com/en/apply-for-access) account.
2. Create a new [app](https://developer.twitter.com/en/apps). You can call it whatever you want; I called mine "wakingandsleeping", from where you'll copy your own keys and tokens later.

**MapQuest**

Same idea as Twitter, but more straightforward.
1. Head over to [MapQuest](https://developer.mapquest.com/plan_purchase/steps/business_edition/business_edition_free/register) to create an account if you don't have one already.
2. Click into [your keys](https://developer.mapquest.com/user/me/apps) and continue on to the final section.

**Development environment**

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
* [Mapbox](https://www.mapbox.com/) *(currently not in use due to me messing up the API rate limit whoops!!)*