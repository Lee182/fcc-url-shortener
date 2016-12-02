# fcc-url-shortener
  * Date Started: 2016-11-30
  * Date Completed: 2016-12-02
## Description
This microservice shortens urls and stores them within a mongodb database.

The number2str.js file converts a number (base 10), into a alphanumeric string (base 62), so will can take exponentially more options at a shorter length than using a number. The function can also be inversed ie convert a alphanumeric string to number so saves disk space.

## API
### POST / {url: 'http://blogjono.com'}
purpose: returns a shortened url for a given url, the shortened path is the `_id` in the response
```
{
  _id: "a",
  creationDate: "2016-12-02T12:47:21.164Z",
  url: "http://blogjono.com"
}
```
### POST / {url: 'notvalidurl.com'}
```
{ err: "invalid url" }
```

### GET /:short_url
`GET /a` will redirect with code 301 to 'http://blogjono.com'

`GET /aoPCz` isn't found in the database therefor will redirect to root

### GET /info/:short_url
`GET /info/a` will respond with
```
{
  _id: "a",
  creationDate: "2016-12-02T12:47:21.164Z",
  url: "http://blogjono.com"
}
```
`GET /info/aoPCz` will respond with `null`

## Setup
```
$ npm install
$ npm build
$ npm start
```
You will also have to make js file called keys and set up your mongodb database
```javascript
  module.exports = {
    "mongourl": "mongodb://user:pwd@domain.com:port/db"
  }
```
## Author & Licence
Author: **[Jonathan T L Lee](https://github.com/Lee182)**

Licence: MIT

Repo: https://github.com/Lee182/fcc-url-shortener
