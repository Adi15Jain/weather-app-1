const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const { landmarkToCity, getLandmarkCity } = require("./landmark");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

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
            // Return landmark as first suggestion
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
            const response = await axios.get(
                `https://geocode.maps.co/search?q=${encodeURIComponent(
                    query
                )}&api_key=${GEOCODE_API_KEY}&limit=4`
            );

            const predictions = [landmarkSuggestion]; // Landmark first

            response.data.forEach((place) => {
                predictions.push({
                    description: place.display_name,
                    structured_formatting: {
                        main_text:
                            place.name || place.display_name.split(",")[0],
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
        }

        // Regular geocoding search
        const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
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

// Enhanced geocoding function
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

// Enhanced Current Weather Endpoint
app.get("/api/weather/current/:location", async (req, res) => {
    try {
        const { location } = req.params;
        const API_KEY = process.env.WEATHER_API_KEY;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
