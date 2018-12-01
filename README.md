# URL Shortener service

Transforms an URL (send with a form via POST) into a shorter version that redirects to the initial website.

For instance :
- "http://www.google.fr" returns **{original_url= "http://www.google.fr", "short_url: 0}**


API : 
- "localhost:8080" : Form
- "localhost:8080/api/shorturl/<short_url> : Redirects to the website linked to that short_url


## Getting Started

* Clone the repository
* Go to "localhost:8080" and enter an url that matches the pattern "http(s)://(www.)example.com(/route)"
* Go to "localhost:8080/api/shorturl/<short_url returned previously>


## Built With

* [Node.js](https://nodejs.org/) - Server
* [Express.js](https://expressjs.com/) - Web Framework


## Authors

* **Nicolas AMBRY** - *Initial work* - [AmbryN](https://github.com/AmbryN)