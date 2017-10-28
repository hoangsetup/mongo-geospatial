const mongoose = require('mongoose');

let LocationSchema = new mongoose.Schema({
    category: {
        type: String,
        index: true,
        unique: false,
        require: [true, 'Why no category? We have "Other" category.'],
    },
    desc: {
        type: String,
        require: false,
    },
    loc: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    }
}, {
    timestamps: true
});

// register the mongoose model
module.exports = mongoose.model('Location', LocationSchema);
