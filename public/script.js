class WeatherApp {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
        this.autocompleteTimeout = null;
        this.currentSuggestions = [];
        this.selectedIndex = -1;
    }

    initializeElements() {
        this.locationInput = document.getElementById("locationInput");
        this.searchBtn = document.getElementById("searchBtn");
        this.locationBtn = document.getElementById("locationBtn");
        this.loading = document.getElementById("loading");
        this.error = document.getElementById("error");
        this.weatherDisplay = document.getElementById("weatherDisplay");
        this.autocompleteDropdown = document.getElementById(
            "autocompleteDropdown"
        );
    }

    addEventListeners() {
        this.searchBtn.addEventListener("click", () => this.searchWeather());
        this.locationBtn.addEventListener("click", () =>
            this.getCurrentLocationWeather()
        );

        // Enhanced input listeners
        this.locationInput.addEventListener("keydown", (e) =>
            this.handleKeydown(e)
        );
        this.locationInput.addEventListener("input", (e) =>
            this.handleAutocompleteInput(e.target.value)
        );
        this.locationInput.addEventListener("focus", () => {
            if (this.currentSuggestions.length > 0) {
                this.showAutocomplete();
            }
        });

        // Hide autocomplete when clicking outside
        document.addEventListener("click", (e) => {
            if (
                !this.locationInput.contains(e.target) &&
                !this.autocompleteDropdown.contains(e.target)
            ) {
                this.hideAutocomplete();
            }
        });
    }

    handleKeydown(e) {
        const items =
            this.autocompleteDropdown.querySelectorAll(".autocomplete-item");

        switch (e.key) {
            case "Enter":
                e.preventDefault();
                if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
                    // Select highlighted item
                    const selectedData =
                        this.currentSuggestions[this.selectedIndex];
                    this.selectAutocompleteItem(selectedData);
                } else {
                    // Search with current input
                    this.hideAutocomplete();
                    this.searchWeather();
                }
                break;

            case "ArrowDown":
                e.preventDefault();
                this.selectedIndex = Math.min(
                    this.selectedIndex + 1,
                    items.length - 1
                );
                this.updateHighlight(items);
                break;

            case "ArrowUp":
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateHighlight(items);
                break;

            case "Escape":
                this.hideAutocomplete();
                break;
        }
    }

    updateHighlight(items) {
        items.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.style.backgroundColor = "#e3f2fd";
            } else {
                item.style.backgroundColor = "";
            }
        });
    }

    async handleAutocompleteInput(query) {
        // Reset selection when typing
        this.selectedIndex = -1;

        // Clear existing timeout
        if (this.autocompleteTimeout) {
            clearTimeout(this.autocompleteTimeout);
        }

        if (query.length < 2) {
            this.hideAutocomplete();
            return;
        }

        // Show loading state
        this.showAutocompleteLoading();

        // Debounce API call
        this.autocompleteTimeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/autocomplete/${encodeURIComponent(query)}`
                );
                const data = await response.json();

                if (data.success && data.predictions.length > 0) {
                    this.currentSuggestions = data.predictions;
                    this.displayAutocomplete(data.predictions);
                } else {
                    this.hideAutocomplete();
                }
            } catch (error) {
                console.error("Autocomplete error:", error);
                this.hideAutocomplete();
            }
        }, 300);
    }

    showAutocompleteLoading() {
        this.autocompleteDropdown.innerHTML =
            '<div class="autocomplete-item">🔍 Searching locations...</div>';
        this.showAutocomplete();
    }

    displayAutocomplete(predictions) {
        this.autocompleteDropdown.innerHTML = "";

        predictions.forEach((prediction, index) => {
            const item = document.createElement("div");
            item.className = "autocomplete-item";

            const mainText = prediction.structured_formatting.main_text;
            const secondaryText =
                prediction.structured_formatting.secondary_text || "";
            const isLandmark = prediction.is_landmark;

            item.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div style="flex: 1;">
                        <div class="autocomplete-main-text">${mainText}</div>
                        ${
                            secondaryText
                                ? `<div class="autocomplete-secondary-text">${secondaryText}</div>`
                                : ""
                        }
                    </div>
                    ${
                        isLandmark
                            ? '<span class="landmark-indicator">🏛️ LANDMARK</span>'
                            : ""
                    }
                </div>
            `;

            item.addEventListener("click", () => {
                this.selectAutocompleteItem(prediction);
            });

            item.addEventListener("mouseenter", () => {
                this.selectedIndex = index;
                this.updateHighlight([item]);
            });

            this.autocompleteDropdown.appendChild(item);
        });

        this.showAutocomplete();
    }

    selectAutocompleteItem(prediction) {
        // Use the full description for search
        this.locationInput.value = prediction.is_landmark
            ? prediction.original_query
            : prediction.structured_formatting.main_text;

        this.hideAutocomplete();
        this.searchWeather();
    }

    showAutocomplete() {
        this.autocompleteDropdown.classList.remove("hidden");
    }

    hideAutocomplete() {
        this.autocompleteDropdown.classList.add("hidden");
        this.currentSuggestions = [];
        this.selectedIndex = -1;
    }

    async searchWeather() {
        const location = this.locationInput.value.trim();
        if (!location) {
            this.showError("Please enter a location");
            return;
        }

        this.hideAutocomplete();
        this.showLoading();

        try {
            if (this.isCoordinates(location)) {
                const [lat, lon] = location
                    .split(",")
                    .map((coord) => coord.trim());
                await this.fetchWeatherByCoordinates(lat, lon);
            } else {
                await this.fetchWeatherByLocation(location);
            }
        } catch (error) {
            this.showError(
                "Failed to fetch weather data. Please check your input."
            );
        }
    }

    // Your existing methods remain the same...
    isCoordinates(input) {
        const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
        return coordPattern.test(input.replace(/\s/g, ""));
    }

    async getCurrentLocationWeather() {
        console.log("Attempting to get current location...");

        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            this.showError("Geolocation is not supported by this browser");
            return;
        }

        if (!window.isSecureContext && location.hostname !== "localhost") {
            this.showError("Geolocation requires HTTPS connection");
            return;
        }

        this.showLoading();

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
        };

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                console.log("Location obtained:", position.coords);
                const { latitude, longitude } = position.coords;
                console.log(`Fetching weather for: ${latitude}, ${longitude}`);
                await this.fetchWeatherByCoordinates(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                let errorMessage = "Unable to get your location. ";

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage +=
                            "Please enable location permissions in your browser.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "Location request timed out.";
                        break;
                    default:
                        errorMessage += "An unknown error occurred.";
                        break;
                }

                this.showError(errorMessage);
                this.hideLoading();
            },
            options
        );
    }

    async fetchWeatherByLocation(location) {
        try {
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`/api/weather/current/${encodeURIComponent(location)}`),
                fetch(`/api/weather/forecast/${encodeURIComponent(location)}`),
            ]);

            const currentData = await currentResponse.json();
            const forecastData = await forecastResponse.json();

            if (currentData.success && forecastData.success) {
                this.displayWeather(currentData.data, forecastData.data);
            } else {
                this.showError(
                    currentData.message || "Weather data not available"
                );
            }
        } catch (error) {
            this.showError("Network error. Please try again.");
        }
    }

    async fetchWeatherByCoordinates(lat, lon) {
        try {
            const currentResponse = await fetch(
                `/api/weather/coordinates/${lat}/${lon}`
            );
            const currentData = await currentResponse.json();

            if (!currentData.success) {
                this.showError(currentData.message || "Invalid coordinates");
                return;
            }

            const cityName = currentData.data.name;
            const forecastResponse = await fetch(
                `/api/weather/forecast/${encodeURIComponent(cityName)}`
            );
            const forecastData = await forecastResponse.json();

            this.displayWeather(
                currentData.data,
                forecastData.success ? forecastData.data : null
            );
        } catch (error) {
            console.error("Geolocation weather error:", error);
            this.showError("Network error. Please try again.");
            this.hideLoading();
        }
    }

    displayWeather(currentWeather, forecastWeather) {
        // Enhanced display logic for geocoded results
        let locationText;

        if (currentWeather.is_landmark && currentWeather.landmark_query) {
            locationText = `🏛️ ${currentWeather.landmark_query} (${currentWeather.name}, ${currentWeather.sys.country})`;
        } else if (
            currentWeather.is_geocoded &&
            currentWeather.original_query
        ) {
            locationText = `📍 ${currentWeather.original_query} → ${currentWeather.name}, ${currentWeather.sys.country}`;
        } else {
            locationText = `${currentWeather.name}, ${currentWeather.sys.country}`;
        }

        document.getElementById("locationName").textContent = locationText;

        // Rest of your existing display code
        document.getElementById("temperature").textContent = `${Math.round(
            currentWeather.main.temp
        )}°C`;
        document.getElementById("description").textContent =
            currentWeather.weather[0].description.charAt(0).toUpperCase() +
            currentWeather.weather[0].description.slice(1);
        document.getElementById("feelsLike").textContent = `${Math.round(
            currentWeather.main.feels_like
        )}°C`;
        document.getElementById(
            "humidity"
        ).textContent = `${currentWeather.main.humidity}%`;
        document.getElementById(
            "windSpeed"
        ).textContent = `${currentWeather.wind.speed} m/s`;
        document.getElementById(
            "pressure"
        ).textContent = `${currentWeather.main.pressure} hPa`;

        const iconCode = currentWeather.weather[0].icon;
        document.getElementById(
            "weatherIcon"
        ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        if (forecastWeather) {
            this.displayForecast(forecastWeather);
        }

        this.hideLoading();
        this.weatherDisplay.classList.remove("hidden");
    }

    displayForecast(forecastData) {
        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";

        const dailyForecasts = {};
        forecastData.list.forEach((forecast) => {
            const date = new Date(forecast.dt * 1000).toDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = forecast;
            }
        });

        Object.values(dailyForecasts)
            .slice(0, 5)
            .forEach((forecast) => {
                const forecastItem = document.createElement("div");
                forecastItem.className = "forecast-item";

                const date = new Date(forecast.dt * 1000);
                const dayName = date.toLocaleDateString("en-US", {
                    weekday: "short",
                });
                const iconCode = forecast.weather[0].icon;

                forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather icon">
                <div class="forecast-temp">${Math.round(
                    forecast.main.temp
                )}°C</div>
                <div class="forecast-desc">${forecast.weather[0].main}</div>
            `;

                forecastContainer.appendChild(forecastItem);
            });
    }

    showLoading() {
        this.loading.classList.remove("hidden");
        this.error.classList.add("hidden");
        this.weatherDisplay.classList.add("hidden");
    }

    hideLoading() {
        this.loading.classList.add("hidden");
    }

    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove("hidden");
        this.loading.classList.add("hidden");
        this.weatherDisplay.classList.add("hidden");
    }
}

// Assessment 2: CRUD Operations Frontend
class WeatherRecordsManager {
    constructor() {
        this.initializeRecordsUI();
    }

    initializeRecordsUI() {
        // Toggle records section
        document
            .getElementById("toggleRecords")
            ?.addEventListener("click", () => {
                const recordsSection =
                    document.getElementById("recordsSection");
                const mainApp = document.querySelector(".container");

                if (recordsSection.style.display === "none") {
                    recordsSection.style.display = "block";
                    mainApp.style.display = "none";
                    document.getElementById("toggleRecords").textContent =
                        "🌤️ Weather";
                    this.loadRecords();
                } else {
                    recordsSection.style.display = "none";
                    mainApp.style.display = "block";
                    document.getElementById("toggleRecords").textContent =
                        "📊 Records";
                }
            });

        // Save current weather
        document
            .getElementById("saveCurrentBtn")
            ?.addEventListener("click", () => {
                this.showSaveForm();
            });

        // View records
        document
            .getElementById("viewRecordsBtn")
            ?.addEventListener("click", () => {
                this.loadRecords();
            });

        // Export buttons
        document
            .getElementById("exportJsonBtn")
            ?.addEventListener("click", () => {
                window.open("/api/weather-records/export/json", "_blank");
            });

        document
            .getElementById("exportCsvBtn")
            ?.addEventListener("click", () => {
                window.open("/api/weather-records/export/csv", "_blank");
            });

        // Save form handlers
        document
            .getElementById("confirmSave")
            ?.addEventListener("click", () => {
                this.saveWeatherRecord();
            });

        document.getElementById("cancelSave")?.addEventListener("click", () => {
            this.hideSaveForm();
        });
    }

    showSaveForm() {
        const form = document.getElementById("saveWeatherForm");
        form.style.display = "block";

        // Set default dates
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        document.getElementById("startDate").value = today
            .toISOString()
            .split("T")[0];
        document.getElementById("endDate").value = nextWeek
            .toISOString()
            .split("T")[0];
    }

    hideSaveForm() {
        document.getElementById("saveWeatherForm").style.display = "none";
    }

    async saveWeatherRecord() {
        const location = document.getElementById("saveLocation").value.trim();
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const tags = document
            .getElementById("tags")
            .value.split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);
        const includeExtra = document.getElementById("includeExtra").checked;

        if (!location || !startDate || !endDate) {
            alert("Please fill in location and date range");
            return;
        }

        try {
            const response = await fetch("/api/weather-records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    location,
                    dateRange: { startDate, endDate },
                    includeAdditionalData: includeExtra,
                    tags,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Weather record saved successfully!");
                this.hideSaveForm();
                this.loadRecords();

                // Clear form
                document.getElementById("saveLocation").value = "";
                document.getElementById("tags").value = "";
                document.getElementById("includeExtra").checked = false;
            } else {
                alert("❌ Failed to save record: " + result.message);
            }
        } catch (error) {
            alert("❌ Network error: " + error.message);
        }
    }

    async loadRecords() {
        try {
            const response = await fetch(
                "/api/weather-records?limit=20&sortBy=createdAt&sortOrder=desc"
            );
            const result = await response.json();

            if (result.success) {
                this.displayRecords(result.data, result.pagination);
            } else {
                document.getElementById("recordsDisplay").innerHTML =
                    "<p>❌ Failed to load records</p>";
            }
        } catch (error) {
            document.getElementById("recordsDisplay").innerHTML =
                "<p>❌ Network error loading records</p>";
        }
    }

    displayRecords(records, pagination) {
        const container = document.getElementById("recordsDisplay");

        if (records.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3>📋 No Weather Records Yet</h3>
                    <p>Save your first weather search to see it here!</p>
                </div>
            `;
            return;
        }

        let html = `<h3>📊 Saved Weather Records (${pagination.totalRecords} total)</h3>`;

        records.forEach((record) => {
            const createdDate = new Date(record.createdAt).toLocaleDateString();
            const tags =
                record.tags.length > 0 ? record.tags.join(", ") : "No tags";

            html += `
                <div class="record-card" style="
                    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,249,250,0.8));
                    border: 1px solid rgba(102,126,234,0.2);
                    border-radius: 15px;
                    padding: 20px;
                    margin: 15px 0;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <h4 style="color: #667eea; margin-bottom: 10px;">
                                📍 ${record.location}
                                ${
                                    record.resolvedLocation
                                        ? `→ ${record.resolvedLocation.name}, ${record.resolvedLocation.country}`
                                        : ""
                                }
                            </h4>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
                                <div>
                                    <strong>🌡️ Temperature:</strong> ${
                                        record.weatherData.current.temperature
                                    }°C<br>
                                    <strong>🌤️ Condition:</strong> ${
                                        record.weatherData.current.description
                                    }
                                </div>
                                <div>
                                    <strong>💧 Humidity:</strong> ${
                                        record.weatherData.current.humidity
                                    }%<br>
                                    <strong>💨 Wind:</strong> ${
                                        record.weatherData.current.windSpeed
                                    } m/s
                                </div>
                                <div>
                                    <strong>📅 Date Range:</strong><br>
                                    ${new Date(
                                        record.dateRange.startDate
                                    ).toLocaleDateString()} - 
                                    ${new Date(
                                        record.dateRange.endDate
                                    ).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>🏷️ Tags:</strong> ${tags}<br>
                                    <strong>📝 Saved:</strong> ${createdDate}
                                </div>
                            </div>

                            ${
                                record.additionalData.youtubeVideos &&
                                record.additionalData.youtubeVideos.length > 0
                                    ? `
                                <div style="margin-top: 15px;">
                                    <strong>🎥 Related Videos:</strong>
                                    <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                                        ${record.additionalData.youtubeVideos
                                            .slice(0, 2)
                                            .map(
                                                (video) => `
                                            <a href="${
                                                video.url
                                            }" target="_blank" style="
                                                text-decoration: none;
                                                background: #ff0000;
                                                color: white;
                                                padding: 8px 12px;
                                                border-radius: 8px;
                                                font-size: 12px;
                                                display: flex;
                                                align-items: center;
                                                gap: 5px;
                                            ">
                                                📺 ${video.title.substring(
                                                    0,
                                                    30
                                                )}...
                                            </a>
                                        `
                                            )
                                            .join("")}
                                    </div>
                                </div>
                            `
                                    : ""
                            }
                        </div>
                        
                        <div style="margin-left: 20px;">
                            <button onclick="weatherRecordsManager.deleteRecord('${
                                record._id
                            }')" 
                                    style="background: #ff4757; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add pagination if needed
        if (pagination.totalPages > 1) {
            html += `
                <div style="text-align: center; margin: 20px 0;">
                    <p>Page ${pagination.currentPage} of ${pagination.totalPages} 
                       (${pagination.totalRecords} total records)</p>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    async deleteRecord(recordId) {
        if (!confirm("Are you sure you want to delete this weather record?")) {
            return;
        }

        try {
            const response = await fetch(`/api/weather-records/${recordId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (result.success) {
                alert("✅ Record deleted successfully!");
                this.loadRecords();
            } else {
                alert("❌ Failed to delete record: " + result.message);
            }
        } catch (error) {
            alert("❌ Network error: " + error.message);
        }
    }
}

class VideoBackgroundManager {
    constructor() {
        this.video = document.getElementById("bg-video");
        this.initializeVideoControls();
    }

    initializeVideoControls() {
        // Add video control button
        this.createVideoControls();

        // Handle video loading
        this.video.addEventListener("loadeddata", () => {
            console.log("✅ Background video loaded successfully");
        });

        this.video.addEventListener("error", (e) => {
            console.error("❌ Video loading error:", e);
            this.handleVideoError();
        });
    }

    createVideoControls() {
        // Create video control button
        const controlButton = document.createElement("button");
        controlButton.id = "videoControl";
        controlButton.innerHTML = "⏸️";
        controlButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        `;

        controlButton.addEventListener("click", () => {
            this.toggleVideo();
        });

        document.body.appendChild(controlButton);
    }

    toggleVideo() {
        const controlButton = document.getElementById("videoControl");

        if (this.video.paused) {
            this.video.play();
            controlButton.innerHTML = "⏸️";
        } else {
            this.video.pause();
            controlButton.innerHTML = "▶️";
        }
    }

    handleVideoError() {
        // Fallback to gradient background if video fails
        document.body.style.background =
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)";
        document.body.style.backgroundAttachment = "fixed";

        // Hide video elements
        const videoBackground = document.querySelector(".video-background");
        if (videoBackground) {
            videoBackground.style.display = "none";
        }

        console.log("🔄 Fallback to gradient background due to video error");
    }
}

// Initialize video background when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    new VideoBackgroundManager();
});

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new WeatherApp();
});

// Initialize records manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.weatherRecordsManager = new WeatherRecordsManager();
});
