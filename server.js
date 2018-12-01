const dns = require('dns')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost/fccamp")

const shortSchema = mongoose.Schema({
    original_url: {type: String, required: true},
    short_url: {type: Number}
})

// Returns the next shortUrl, which is the currently 
// highest existing number in the DB + 1
shortSchema.statics.newShortUrl =  function () {
    return new Promise (resolve => {
        // Look for the document with the highest short_url
        this.find({}).sort('-short_url').exec()
            .catch(err => {
                console.log(`NEWSHORTURL: Error ${err}`)
                resolve(0)
            })
            .then(res => {
                if (res[0]) {
                    console.log(`NEWSHORTURL : The number given is ${res[0].short_url + 1 || 0}`)
                    resolve(res[0].short_url + 1 || 0)
                } else resolve(0)
            })
    })
}

// Allows an instance to set its short_url
shortSchema.methods.setShortUrl =  async function () {
    this.short_url = await this.model('Short').newShortUrl()    
}

const Short = mongoose.model('Short', shortSchema)

const app = express()
app.use(bodyParser.urlencoded({extended: false}))

// ROUTES

// Serve the form
app.use("/", express.static("web"))

// Post a new link you want shortened
app.post("/api/shorturl/new", (req, res, next) => {
    const url = req.body.url   
    
    // Test if the url matches the pattern
    if(/^https?:\/\/([a-zA-z0-9]+\.){1,2}[a-z]{2,3}(\/\w+\/)*/.test(url)) {
        // Look for an existing record with that url
        Short.findOne({original_url: url})
            .catch(err => console.log(`FindOne: Error ${err}`))
            .then(short => {
                // If a record is found, return it
                if (short) {
                    res.json(short)
                }
                // Else create a new record
                else {
                    const newUrl = new Short({original_url: url})
                    newUrl.setShortUrl()
                        .then(() => {
                            newUrl.save()
                                .catch(err => {
                                    console.log(`SAVE: Error ${err}`)
                                    next()
                                })
                                .then(short => {
                                    res.json(short)
                                })
                        })
                }
            })
    } 
    // If the url doesn't match the pattern
    else {
        res.json({error: "Invalid URL"})
    }
})

// Access a shortened link
app.get('/api/shorturl/:short_url', (req, res, next) => {
    const url = req.params.short_url
    Short.findOne({short_url: url})
        .catch(err => {
            console.log(`FindOne: Error ${err}`)
            next()
        })
        .then (short => {
            res.redirect(short.original_url)
        })
})

app.listen(8080, console.log("App listening on 8080"))