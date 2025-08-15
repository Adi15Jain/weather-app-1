const mongoose = require("mongoose");

const weatherRecordSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true,
    },
    resolvedLocation: {
        name: String,
        country: String,
        coordinates: {
            lat: Number,
            lon: Number,
        },
    },
    dateRange: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
    },
    weatherData: {
        current: {
            temperature: Number,
            feelsLike: Number,
            humidity: Number,
            pressure: Number,
            windSpeed: Number,
            description: String,
            icon: String,
        },
        forecast: [
            {
                date: Date,
                temperature: Number,
                description: String,
                icon: String,
            },
        ],
    },
    additionalData: {
        youtubeVideos: [
            {
                title: String,
                videoId: String,
                thumbnail: String,
            },
        ],
        mapData: {
            address: String,
            placeId: String,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    tags: [String],
    isPublic: {
        type: Boolean,
        default: true,
    },
});

// Add indexes for better query performance
weatherRecordSchema.index({ location: 1 });
weatherRecordSchema.index({ createdAt: -1 });
weatherRecordSchema.index({ "dateRange.startDate": 1 });

module.exports = mongoose.model("WeatherRecord", weatherRecordSchema);
