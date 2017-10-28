const router = require('express').Router();
const path = require('path');
const Location = require('./location');

router.route('/')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, 'asset', 'index.html'));
    });

router.route('/api/locations')
// Get location(s) near by me
    .get((req, res) => {
        let limit = req.query.limit || 50;

        // get the max distance or set it to 5 kilometers
        let maxDistance = req.query.distance || 5;

        // we need to convert the distance to radians
        // the raduis of Earth is approximately 6371 kilometers
        // Just to be more exact since I just researched for this and this can clearly help future visitors, the actual formula is : 1° latitude = 69.047 miles = 111.12 kilometers
        // https://stackoverflow.com/questions/5319988/how-is-maxdistance-measured-in-mongodb
        maxDistance /= 111.12;

        // get coordinates [ <longitude> , <latitude> ]
        let coords = [];
        coords[0] = req.query.lng || 0;
        coords[1] = req.query.lat || 0;

        let query = {
            loc: {
                $near: coords,
                $maxDistance: maxDistance
            }
        };
        if (req.query.category) {
            query.category = req.query.category;
        }
        // find location(s)
        Location
            .find(query)
            .limit(limit)
            .exec((err, locations) => {
                if (err) {
                    return res.status(400).json({message: err.message});
                }
                res.json({locations});
            });
    })
    // Create a location
    .post((req, res) => {
        let localtion = new Location({
            category: req.body.category || 'other',
            desc: req.body.desc,
            loc: [req.body.lng, req.body.lat]
        });
        localtion.save((err) => {
            if (err) {
                res.status(400).json({message: err.message});
                return;
            }
            res.json({message: 'Location created!'})
        })
    });

module.exports = router;
