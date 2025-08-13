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

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new WeatherApp();
});
