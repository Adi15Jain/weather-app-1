const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Import models and utilities
const { landmarkToCity, getLandmarkCity } = require("./landmark");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database connection
mongoose
    .connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/weather-app",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Weather Record Schema
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
                url: String,
            },
        ],
        mapData: {
            address: String,
            coordinates: {
                lat: Number,
                lon: Number,
            },
            mapUrl: String,
        },
        photos: [
            {
                url: String,
                thumbnail: String,
                description: String,
            },
        ],
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

weatherRecordSchema.index({ location: 1 });
weatherRecordSchema.index({ createdAt: -1 });
weatherRecordSchema.index({ "dateRange.startDate": 1 });

const WeatherRecord = mongoose.model("WeatherRecord", weatherRecordSchema);

// Enhanced utility functions
async function getCoordinatesFromGeocode(location) {
    try {
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
        const response = await axios.get(
            `https://geocode.maps.co/search?q=${encodeURIComponent(
                location
            )}&api_key=${GEOCODE_API_KEY}&limit=1`
        );

        if (response.data && response.data.length > 0) {
            const place = response.data[0];
            return {
                lat: parseFloat(place.lat),
                lon: parseFloat(place.lon),
                address: place.display_name,
                place_id: place.place_id,
            };
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

// Free YouTube API integration
async function getYouTubeVideos(location) {
    try {
        const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
        if (!YOUTUBE_API_KEY) {
            console.log("YouTube API key not provided, skipping video search");
            return [];
        }

        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
                location + " travel weather guide"
            )}&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`
        );

        return response.data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
            thumbnail: item.snippet.thumbnails.medium.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));
    } catch (error) {
        console.error("YouTube API error:", error);
        return [];
    }
}

// Free map data using Nominatim (OpenStreetMap)
async function getMapDataFree(location) {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                location
            )}&limit=1&addressdetails=1`
        );

        if (response.data && response.data.length > 0) {
            const place = response.data[0];
            return {
                address: place.display_name,
                coordinates: {
                    lat: parseFloat(place.lat),
                    lon: parseFloat(place.lon),
                },
                mapUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${
                    place.lon - 0.01
                },${place.lat - 0.01},${place.lon + 0.01},${
                    place.lat + 0.01
                }&layer=mapnik&marker=${place.lat},${place.lon}`,
                osmId: place.osm_id,
            };
        }
        return null;
    } catch (error) {
        console.error("Map data error:", error);
        return null;
    }
}

// Free photos using Lorem Picsum (fallback for demonstration)
async function getLocationPhotos(location) {
    try {
        // Using Lorem Picsum for demo photos (completely free)
        const photos = [];
        for (let i = 1; i <= 3; i++) {
            photos.push({
                url: `https://picsum.photos/800/600?random=${Date.now() + i}`,
                thumbnail: `https://picsum.photos/200/150?random=${
                    Date.now() + i
                }`,
                description: `${location} landscape view ${i}`,
            });
        }
        return photos;
    } catch (error) {
        console.error("Photos error:", error);
        return [];
    }
}

// EXISTING ENDPOINTS (Enhanced)

// FREE Geocoding Autocomplete API
app.get("/api/autocomplete/:query", async (req, res) => {
    try {
        const { query } = req.params;

        if (query.length < 2) {
            return res.json({ success: true, predictions: [] });
        }

        // Check if it's a known landmark first for faster response
        const landmarkCity = getLandmarkCity(query);
        if (landmarkCity) {
            const landmarkSuggestion = {
                description: `${query} (${landmarkCity})`,
                structured_formatting: {
                    main_text: query,
                    secondary_text: landmarkCity,
                },
                is_landmark: true,
                original_query: query,
            };

            // Also get geocoding suggestions
            const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
            if (GEOCODE_API_KEY) {
                try {
                    const response = await axios.get(
                        `https://geocode.maps.co/search?q=${encodeURIComponent(
                            query
                        )}&api_key=${GEOCODE_API_KEY}&limit=4`
                    );

                    const predictions = [landmarkSuggestion];

                    response.data.forEach((place) => {
                        predictions.push({
                            description: place.display_name,
                            structured_formatting: {
                                main_text:
                                    place.name ||
                                    place.display_name.split(",")[0],
                                secondary_text: place.display_name
                                    .split(",")
                                    .slice(1)
                                    .join(",")
                                    .trim(),
                            },
                            lat: parseFloat(place.lat),
                            lon: parseFloat(place.lon),
                            place_id: place.place_id,
                        });
                    });

                    return res.json({
                        success: true,
                        predictions: predictions.slice(0, 5),
                    });
                } catch (geocodeError) {
                    console.error("Geocode API error:", geocodeError);
                }
            }

            // Return just landmark if geocoding fails
            return res.json({
                success: true,
                predictions: [landmarkSuggestion],
            });
        }

        // Regular geocoding search
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
        if (!GEOCODE_API_KEY) {
            return res.json({
                success: false,
                message: "Geocoding API key not configured",
            });
        }

        const response = await axios.get(
            `https://geocode.maps.co/search?q=${encodeURIComponent(
                query
            )}&api_key=${GEOCODE_API_KEY}&limit=5`
        );

        const predictions = response.data.map((place) => ({
            description: place.display_name,
            structured_formatting: {
                main_text: place.name || place.display_name.split(",")[0],
                secondary_text: place.display_name
                    .split(",")
                    .slice(1)
                    .join(",")
                    .trim(),
            },
            lat: parseFloat(place.lat),
            lon: parseFloat(place.lon),
            place_id: place.place_id,
        }));

        res.json({
            success: true,
            predictions: predictions,
        });
    } catch (error) {
        console.error("Geocoding autocomplete error:", error);
        res.status(400).json({
            success: false,
            message: "Autocomplete service temporarily unavailable",
            error: error.message,
        });
    }
});

// Enhanced Current Weather Endpoint
app.get("/api/weather/current/:location", async (req, res) => {
    try {
        const { location } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(400).json({
                success: false,
                message: "Weather API key not configured",
            });
        }

        // Check landmark mapping first
        const landmarkCity = getLandmarkCity(location);
        if (landmarkCity) {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${landmarkCity}&appid=${API_KEY}&units=metric`
            );

            const weatherData = response.data;
            weatherData.is_landmark = true;
            weatherData.landmark_query = location;
            weatherData.resolved_to = landmarkCity;

            return res.json({
                success: true,
                data: weatherData,
                method: "landmark_mapping",
            });
        }

        // Try direct OpenWeatherMap search
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
            );

            return res.json({
                success: true,
                data: response.data,
                method: "direct_weather_api",
            });
        } catch (directError) {
            console.log("Direct weather search failed, trying geocoding...");

            // Fallback to geocoding
            const coordinates = await getCoordinatesFromGeocode(location);
            if (coordinates) {
                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
                );

                const weatherData = weatherResponse.data;
                weatherData.original_query = location;
                weatherData.resolved_address = coordinates.address;
                weatherData.is_geocoded = true;

                return res.json({
                    success: true,
                    data: weatherData,
                    method: "geocoded",
                });
            }

            throw new Error("Location not found through any method");
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: `Unable to find weather data for "${req.params.location}". Please check the location name.`,
            error: error.response?.data?.message || error.message,
        });
    }
});

// Enhanced Forecast Endpoint
app.get("/api/weather/forecast/:location", async (req, res) => {
    try {
        const { location } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(400).json({
                success: false,
                message: "Weather API key not configured",
            });
        }

        // Check landmark mapping first
        const landmarkCity = getLandmarkCity(location);
        if (landmarkCity) {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${landmarkCity}&appid=${API_KEY}&units=metric`
            );
            return res.json({ success: true, data: response.data });
        }

        // Try direct forecast search
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
            );
            return res.json({ success: true, data: response.data });
        } catch (directError) {
            // Fallback to geocoding
            const coordinates = await getCoordinatesFromGeocode(location);
            if (coordinates) {
                const forecastResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
                );
                return res.json({ success: true, data: forecastResponse.data });
            }
            throw new Error("Forecast not available");
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Forecast not available for this location",
            error: error.response?.data?.message || error.message,
        });
    }
});

// Existing coordinates endpoint
app.get("/api/weather/coordinates/:lat/:lon", async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;

        if (!API_KEY) {
            return res.status(400).json({
                success: false,
                message: "Weather API key not configured",
            });
        }

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        res.json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid coordinates or API error",
            error: error.response?.data?.message || "Unknown error",
        });
    }
});

// ASSESSMENT 2: CRUD OPERATIONS

// CREATE - Store weather search with date range
app.post("/api/weather-records", async (req, res) => {
    try {
        const {
            location,
            dateRange,
            includeAdditionalData = false,
            tags = [],
        } = req.body;

        // Validate inputs
        if (
            !location ||
            !dateRange ||
            !dateRange.startDate ||
            !dateRange.endDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Location and date range are required",
            });
        }

        // Validate date range
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);

        if (startDate > endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date must be before end date",
            });
        }

        // Check if location exists by trying to get weather data
        const API_KEY = process.env.WEATHER_API_KEY;
        if (!API_KEY) {
            return res.status(400).json({
                success: false,
                message: "Weather API key not configured",
            });
        }

        let weatherData = {};
        let resolvedLocation = {};

        // Get weather data using existing logic
        const landmarkCity = getLandmarkCity(location);
        const searchLocation = landmarkCity || location;

        try {
            // Get current weather and forecast
            const [currentResponse, forecastResponse] = await Promise.all([
                axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${API_KEY}&units=metric`
                ),
                axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${searchLocation}&appid=${API_KEY}&units=metric`
                ),
            ]);

            const current = currentResponse.data;
            const forecast = forecastResponse.data;

            weatherData = {
                current: {
                    temperature: current.main.temp,
                    feelsLike: current.main.feels_like,
                    humidity: current.main.humidity,
                    pressure: current.main.pressure,
                    windSpeed: current.wind.speed,
                    description: current.weather[0].description,
                    icon: current.weather[0].icon,
                },
                forecast: forecast.list.slice(0, 5).map((item) => ({
                    date: new Date(item.dt * 1000),
                    temperature: item.main.temp,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                })),
            };

            resolvedLocation = {
                name: current.name,
                country: current.sys.country,
                coordinates: {
                    lat: current.coord.lat,
                    lon: current.coord.lon,
                },
            };
        } catch (weatherError) {
            // Fallback to geocoding
            const coordinates = await getCoordinatesFromGeocode(location);
            if (!coordinates) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Could not find weather data for this location. Please check the location name.",
                });
            }

            const weatherResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
            );

            const current = weatherResponse.data;
            weatherData = {
                current: {
                    temperature: current.main.temp,
                    feelsLike: current.main.feels_like,
                    humidity: current.main.humidity,
                    pressure: current.main.pressure,
                    windSpeed: current.wind.speed,
                    description: current.weather[0].description,
                    icon: current.weather[0].icon,
                },
                forecast: [],
            };

            resolvedLocation = {
                name: current.name,
                country: current.sys.country,
                coordinates: {
                    lat: current.coord.lat,
                    lon: current.coord.lon,
                },
            };
        }

        // Get additional data if requested
        let additionalData = {
            youtubeVideos: [],
            mapData: null,
            photos: [],
        };

        if (includeAdditionalData) {
            console.log("Fetching additional data for:", resolvedLocation.name);

            const [youtubeVideos, mapData, photos] = await Promise.all([
                getYouTubeVideos(resolvedLocation.name),
                getMapDataFree(resolvedLocation.name),
                getLocationPhotos(resolvedLocation.name),
            ]);

            additionalData = {
                youtubeVideos,
                mapData,
                photos,
            };
        }

        // Create weather record
        const weatherRecord = new WeatherRecord({
            location,
            resolvedLocation,
            dateRange: { startDate, endDate },
            weatherData,
            additionalData,
            tags,
        });

        await weatherRecord.save();

        res.json({
            success: true,
            message: "Weather record saved successfully",
            data: weatherRecord,
        });
    } catch (error) {
        console.error("Create weather record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save weather record",
            error: error.message,
        });
    }
});

// READ - Get all weather records with pagination and filters
app.get("/api/weather-records", async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            location,
            startDate,
            endDate,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        // Build query
        let query = {};

        if (location) {
            query.$or = [
                { location: { $regex: location, $options: "i" } },
                {
                    "resolvedLocation.name": {
                        $regex: location,
                        $options: "i",
                    },
                },
            ];
        }

        if (startDate || endDate) {
            query["dateRange.startDate"] = {};
            if (startDate)
                query["dateRange.startDate"].$gte = new Date(startDate);
            if (endDate) query["dateRange.startDate"].$lte = new Date(endDate);
        }

        // Execute query with pagination
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
        };

        const skip = (options.page - 1) * options.limit;
        const records = await WeatherRecord.find(query)
            .sort(options.sort)
            .skip(skip)
            .limit(options.limit);

        const total = await WeatherRecord.countDocuments(query);
        const totalPages = Math.ceil(total / options.limit);

        res.json({
            success: true,
            data: records,
            pagination: {
                currentPage: options.page,
                totalPages,
                totalRecords: total,
                hasNext: options.page < totalPages,
                hasPrev: options.page > 1,
            },
        });
    } catch (error) {
        console.error("Get weather records error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve weather records",
            error: error.message,
        });
    }
});

// READ - Get single weather record
app.get("/api/weather-records/:id", async (req, res) => {
    try {
        const record = await WeatherRecord.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Weather record not found",
            });
        }

        res.json({
            success: true,
            data: record,
        });
    } catch (error) {
        console.error("Get weather record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve weather record",
            error: error.message,
        });
    }
});

// UPDATE - Update weather record
app.put("/api/weather-records/:id", async (req, res) => {
    try {
        const { location, dateRange, tags, isPublic } = req.body;

        const updateData = {
            updatedAt: new Date(),
        };

        if (location) updateData.location = location;
        if (dateRange) {
            if (dateRange.startDate)
                updateData["dateRange.startDate"] = new Date(
                    dateRange.startDate
                );
            if (dateRange.endDate)
                updateData["dateRange.endDate"] = new Date(dateRange.endDate);

            // Validate date range
            if (
                updateData["dateRange.startDate"] &&
                updateData["dateRange.endDate"]
            ) {
                if (
                    updateData["dateRange.startDate"] >
                    updateData["dateRange.endDate"]
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Start date must be before end date",
                    });
                }
            }
        }
        if (tags !== undefined) updateData.tags = tags;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        const record = await WeatherRecord.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Weather record not found",
            });
        }

        res.json({
            success: true,
            message: "Weather record updated successfully",
            data: record,
        });
    } catch (error) {
        console.error("Update weather record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update weather record",
            error: error.message,
        });
    }
});

// DELETE - Delete weather record
app.delete("/api/weather-records/:id", async (req, res) => {
    try {
        const record = await WeatherRecord.findByIdAndDelete(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Weather record not found",
            });
        }

        res.json({
            success: true,
            message: "Weather record deleted successfully",
            data: { deletedId: req.params.id },
        });
    } catch (error) {
        console.error("Delete weather record error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete weather record",
            error: error.message,
        });
    }
});

// DATA EXPORT ENDPOINTS

// Export records as JSON
app.get("/api/weather-records/export/json", async (req, res) => {
    try {
        const records = await WeatherRecord.find({}).sort({ createdAt: -1 });

        res.setHeader("Content-Type", "application/json");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=weather-records.json"
        );
        res.json({
            exportDate: new Date().toISOString(),
            totalRecords: records.length,
            records: records,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Export failed",
            error: error.message,
        });
    }
});

// Export records as CSV
app.get("/api/weather-records/export/csv", async (req, res) => {
    try {
        const records = await WeatherRecord.find({}).sort({ createdAt: -1 });

        let csv =
            "Location,Resolved Location,Start Date,End Date,Temperature,Description,Humidity,Pressure,Created At\n";

        records.forEach((record) => {
            csv += `"${record.location}",`;
            csv += `"${record.resolvedLocation.name}, ${record.resolvedLocation.country}",`;
            csv += `"${record.dateRange.startDate}",`;
            csv += `"${record.dateRange.endDate}",`;
            csv += `"${record.weatherData.current.temperature}°C",`;
            csv += `"${record.weatherData.current.description}",`;
            csv += `"${record.weatherData.current.humidity}%",`;
            csv += `"${record.weatherData.current.pressure} hPa",`;
            csv += `"${record.createdAt}"\n`;
        });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=weather-records.csv"
        );
        res.send(csv);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "CSV export failed",
            error: error.message,
        });
    }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Weather App API is running",
        timestamp: new Date().toISOString(),
        database:
            mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        features: {
            weather: !!process.env.WEATHER_API_KEY,
            geocoding: !!process.env.GEOCODE_API_KEY,
            youtube: !!process.env.YOUTUBE_API_KEY,
            database: mongoose.connection.readyState === 1,
        },
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(
        `🗄️  Database: ${
            process.env.MONGODB_URI || "mongodb://localhost:27017/weather-app"
        }`
    );
});
