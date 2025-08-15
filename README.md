# 🌤️ WeatherScope - Advanced Weather Intelligence Platform

A sophisticated full-stack weather application built with modern web technologies, featuring real-time weather data, intelligent location search, CRUD operations, and advanced data management capabilities.

## 📸 Screenshots

![WeatherScope Main Interface](https://via.placeholder.com/800x400?text=WeatherScope+Main+Interface)
![Records Management](https://via.placeholder.com/800x400?text=Records+Management+Dashboard)

## 🌟 Features

### 🌍 Core Weather Features
- **Real-time Weather Data** - Current conditions with detailed metrics
- **5-Day Weather Forecast** - Extended weather predictions with hourly data
- **Intelligent Location Search** - Support for cities, landmarks, and coordinates
- **Geolocation Support** - Automatic location detection with permission handling
- **Landmark Recognition** - Pre-configured database of 100+ famous landmarks

### 📊 Advanced Data Management
- **Complete CRUD Operations** - Create, Read, Update, Delete weather records
- **Advanced Filtering** - Search by location, date range, and custom tags
- **Data Export** - Export records in JSON and CSV formats
- **Quick Save Feature** - One-click saving of current weather data
- **Tag System** - Organize records with custom categorization

### 🎨 Modern User Experience
- **Glassmorphism Design** - Modern translucent UI elements with backdrop blur
- **Responsive Layout** - Mobile-first design with perfect tablet and desktop scaling
- **Smooth Animations** - 60fps micro-interactions and transitions
- **Video Background** - Dynamic video backgrounds with fallback gradients
- **Dark/Light Themes** - Theme switching with persistent preferences

### ⚡ Technical Excellence
- **Performance Optimized** - Client-side caching and optimized API calls
- **Error Handling** - Comprehensive error management with user-friendly messages
- **Input Validation** - Client and server-side validation for data integrity
- **Security Best Practices** - Environment variable protection and API key security

## 🛠️ Technology Stack

Frontend:
├── HTML5 (Semantic Structure)
├── CSS3 (Modern Features, Grid, Flexbox)
├── Vanilla JavaScript (ES6+, Modules, Classes)
├── Font Awesome (Icons)
└── Inter Font (Typography)

Backend:
├── Node.js (Runtime Environment)
├── Express.js (Web Framework)
├── MongoDB + Mongoose (Database & ODM)
└── RESTful API Architecture

External APIs:
├── OpenWeatherMap API (Weather Data)
├── Geocode.maps.co (Location Services)
├── YouTube Data API (Video Content)
└── Nominatim OSM (Backup Geocoding)

text

## 🚀 Quick Start

### Prerequisites
- Node.js (v14.0.0+)
- npm (v6.0.0+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
git clone https://github.com/yourusername/weatherscope.git
cd weatherscope

text

2. **Install dependencies**
npm install

text

3. **Setup environment variables**

Create a `.env` file in the root directory:
Required APIs
WEATHER_API_KEY=your_openweathermap_key
GEOCODE_API_KEY=your_geocode_maps_key

Database
MONGODB_URI=mongodb://localhost:27017/weather-app

OR MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-app
Optional APIs
YOUTUBE_API_KEY=your_youtube_key

Server Config
PORT=3000

text

4. **Get API Keys**

| Service | URL | Free Tier |
|---------|-----|-----------|
| OpenWeatherMap | [openweathermap.org](https://openweathermap.org/api) | 1,000 calls/day |
| Geocode Maps | [geocode.maps.co](https://geocode.maps.co) | 10,000 requests/month |
| YouTube Data | [Google Cloud Console](https://console.cloud.google.com/) | 10,000 units/day |
| MongoDB Atlas | [mongodb.com/atlas](https://www.mongodb.com/atlas) | 512MB free |

5. **Start the application**
Development mode
npm run dev

Production mode
npm start

text

6. **Access the app**
🌐 Application: http://localhost:3000
🔧 Health Check: http://localhost:3000/api/health

text

## 📖 Usage Guide

### Basic Weather Search
1. Enter a location (city, landmark, or coordinates like "40.7128,-74.0060")
2. Click **Search** or press **Enter**
3. View current weather and 5-day forecast
4. Click **Use My Location** for automatic location detection

### Managing Weather Records

#### Quick Save
1. Search for any location's weather
2. Navigate to **Records** section (top-right button)
3. Click **Save Current Weather** (automatically enabled when weather data is loaded)
4. Data is saved with default settings (current date + 7 days)

#### Custom Save
1. In Records section, click **Save Custom Weather Search**
2. Configure:
- **Location**: Any city, landmark, or coordinates
- **Date Range**: Start and end dates for the record
- **Tags**: Custom tags for organization (e.g., "vacation", "business")
- **Additional Data**: Include videos and maps (optional)
3. Click **Save Record**

#### Managing Records
- **View All**: Click **View All Records** to see saved data
- **Export**: Download records as **JSON** or **CSV**
- **Delete**: Click the delete button on any record
- **Filter**: Records are automatically sorted by creation date

## 📊 API Endpoints

### Weather Endpoints
GET /api/weather/current/:location # Current weather
GET /api/weather/forecast/:location # 5-day forecast
GET /api/weather/coordinates/:lat/:lon # Weather by coordinates
GET /api/autocomplete/:query # Location autocomplete

text

### CRUD Endpoints
POST /api/weather-records # Create record
GET /api/weather-records # Get all records (with pagination)
GET /api/weather-records/:id # Get single record
PUT /api/weather-records/:id # Update record
DELETE /api/weather-records/:id # Delete record

text

### Export Endpoints
GET /api/weather-records/export/json # Export as JSON
GET /api/weather-records/export/csv # Export as CSV

text

### Utility Endpoints
GET /api/health # API health check

text

## 🏗️ Project Structure

weatherscope/
├── 📄 server.js # Main Express server
├── 📄 landmark.js # Landmark database (100+ locations)
├── 📁 public/ # Frontend files
│ ├── 📄 index.html # Main application interface
│ ├── 📄 style.css # Modern CSS with glassmorphism
│ ├── 📄 script.js # Frontend JavaScript (ES6+ classes)
│ └── 🎥 background-video.mp4 # Optional video background
├── 📄 .env # Environment variables
├── 📄 package.json # Dependencies and scripts
├── 📄 .gitignore # Git ignore rules
└── 📄 README.md # This documentation

text

### Key Components

#### Backend Architecture
- **Express Server**: RESTful API with middleware
- **MongoDB Integration**: Mongoose ODM with proper schemas
- **Weather Services**: Multi-provider weather data aggregation
- **Export Services**: JSON and CSV data export functionality

#### Frontend Architecture
- **WeatherApp Class**: Main application logic and state management
- **WeatherRecordsManager Class**: CRUD operations and UI management
- **VideoBackgroundManager Class**: Dynamic background handling
- **Modular CSS**: Component-based styling with modern features

## 🎯 Assessment Compliance

### Assessment 1 Requirements ✅
- [x] **Real-time Weather Display** - Current conditions and forecasts
- [x] **Multi-format Location Search** - Cities, landmarks, coordinates
- [x] **Responsive Design** - Mobile-first with breakpoints
- [x] **Modern UI/UX** - Glassmorphism effects and smooth animations
- [x] **Error Handling** - User-friendly error messages and fallbacks
- [x] **API Integration** - OpenWeatherMap and geocoding services

### Assessment 2 Requirements ✅
- [x] **Complete CRUD Operations**
  - **CREATE**: Save weather records with date ranges and validation
  - **READ**: Display records with pagination, filtering, and search
  - **UPDATE**: Modify records with proper validation
  - **DELETE**: Remove records with confirmation dialogs
- [x] **Additional API Integration**
  - **YouTube Data API**: Location-related video content
  - **OpenStreetMap**: Map data and location visualization
  - **Multiple Geocoding**: Primary and fallback location services
- [x] **Data Export Capabilities**
  - **JSON Format**: Complete record export with metadata
  - **CSV Format**: Tabular data export for analysis
- [x] **Advanced Features**
  - **Quick Save**: One-click weather data preservation
  - **Tag System**: Custom categorization and organization
  - **Date Range Validation**: Smart date handling and validation
  - **Search and Filtering**: Advanced record discovery

## 🔧 Configuration Options

### Environment Variables
Core Configuration
WEATHER_API_KEY=your_key # OpenWeatherMap API key (required)
GEOCODE_API_KEY=your_key # Geocoding service key (required)
MONGODB_URI=your_connection # Database connection (required)
PORT=3000 # Server port (optional, default: 3000)

Optional Integrations
YOUTUBE_API_KEY=your_key # YouTube Data API (optional)
GOOGLE_MAPS_API_KEY=your_key # Google Maps API (optional, not used)

Advanced Options
NODE_ENV=development # Environment mode
MAX_RECORDS_PER_PAGE=50 # Pagination limit
CACHE_DURATION=300000 # Cache duration in milliseconds

text

### Customization
- **Landmark Database**: Add custom landmarks in `landmark.js`
- **Styling**: Modify CSS custom properties in `style.css`
- **API Timeouts**: Adjust timeout values in `server.js`
- **Export Formats**: Add new export formats in export endpoints

## 📈 Performance Features

- **Client-side Caching**: Weather data cached for 5 minutes
- **API Rate Limiting**: Intelligent request throttling
- **Image Optimization**: Compressed weather icons and assets
- **Lazy Loading**: On-demand loading of heavy components
- **Database Indexing**: Optimized MongoDB queries
- **Minified Assets**: Compressed CSS and JavaScript for production

## 🔒 Security Measures

- **Environment Variable Protection**: Sensitive data in `.env` file
- **API Key Validation**: Server-side API key verification
- **Input Sanitization**: XSS and injection prevention
- **CORS Configuration**: Proper cross-origin request handling
- **Error Message Sanitization**: No sensitive data in error responses
- **Rate Limiting**: Protection against API abuse

## 🐛 Troubleshooting

### Common Issues

#### "Cannot GET /"
Check if server is running
npm run dev

Verify static files are in public/ directory
ls -la public/

Check server logs for errors
text

#### "API Key Invalid" Error
Verify API keys in .env file
cat .env

Check if OpenWeatherMap key is activated (takes up to 2 hours)
Test key directly: https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY
text

#### Database Connection Failed
For local MongoDB
brew services start mongodb-community # macOS
sudo systemctl start mongod # Linux

For MongoDB Atlas, check:
- Connection string format
- Network access settings
- Database user permissions
text

#### Weather Data Not Loading
Check browser console (F12) for errors
Verify API endpoints:
curl http://localhost:3000/api/health
curl http://localhost:3000/api/weather/current/London

text

### Debug Mode
Enable detailed logging
DEBUG=* npm run dev

Check specific components
DEBUG=weather:* npm run dev
DEBUG=database:* npm run dev

text

## 🚀 Deployment

### Production Deployment

#### Using PM2 (Recommended)
Install PM2 globally
npm install -g pm2

Start application with PM2
pm2 start server.js --name "weatherscope"

Setup auto-restart on system reboot
pm2 startup
pm2 save

Monitor application
pm2 status
pm2 logs weatherscope

text

#### Using Docker
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

text
undefined
Build and run Docker container
docker build -t weatherscope .
docker run -p 3000:3000 --env-file .env weatherscope

text

#### Platform Deployment

**Heroku**
Install Heroku CLI and login
heroku create weatherscope-app

Set environment variables
heroku config:set WEATHER_API_KEY=your_key
heroku config:set MONGODB_URI=your_mongodb_uri

Deploy
git push heroku main

text

**Vercel** (Frontend + Serverless Functions)
// vercel.json
{
"version": 2,
"builds": [
{ "src": "server.js", "use": "@vercel/node" }
],
"routes": [
{ "src": "/(.*)", "dest": "/server.js" }
]
}

text

**Railway**
Install Railway CLI
npm install -g @railway/cli

Login and deploy
railway login
railway init
railway up

text

## 📊 Monitoring & Analytics

### Health Monitoring
// Check application health
fetch('/api/health')
.then(response => response.json())
.then(data => console.log('Health Status:', data));

text

### Performance Metrics
- **API Response Times**: Monitored via server logs
- **Database Query Performance**: MongoDB slow query log
- **Frontend Performance**: Browser DevTools Performance tab
- **Memory Usage**: Node.js `process.memoryUsage()`

### Logging
// Server-side logging
console.log('Weather request for:', location);
console.error('Database error:', error);

// Client-side logging
console.log('Weather data loaded:', data);
console.error('Frontend error:', error);

text

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
git checkout -b feature/amazing-feature

text
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
git commit -m 'Add amazing feature'

text
6. **Push to the branch**
git push origin feature/amazing-feature

text
7. **Open a Pull Request**

### Development Guidelines
- Follow JavaScript ES6+ standards
- Maintain responsive design principles
- Add JSDoc comments for functions
- Test all CRUD operations
- Ensure proper error handling
- Update documentation for new features

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

MIT License

Copyright (c) 2025 WeatherScope

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

text

## 🙏 Acknowledgments

- **OpenWeatherMap** for comprehensive weather data API
- **Geocode.maps.co** for reliable geocoding services
- **MongoDB** for robust database solutions
- **Font Awesome** for beautiful iconography
- **Inter Font** for modern typography
- **YouTube Data API** for multimedia content integration
- **OpenStreetMap** community for mapping data

## 📞 Support

For support, questions, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/weatherscope/issues)
- **Email**: your.email@example.com
- **Documentation**: This README and inline code comments
- **Community**: Join discussions in GitHub Discussions

---

<div align="center">

**Built with ❤️ for advanced full-stack development demonstration**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/weatherscope.svg?style=social&label=Star)](https://github.com/yourusername/weatherscope)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/weatherscope.svg?style=social&label=Fork)](https://github.com/yourusername/weatherscope/fork)

</div>
Save this as README.md in your project root directory. This comprehensive markdown file includes:

✅ Professional Structure - Clear sections with proper headings
✅ Visual Elements - Emojis, badges, and formatting for readability
✅ Complete Documentation - Installation, usage, API reference
✅ Assessment Requirements - Clear compliance with both assessments
✅ Technical Details - Architecture, deployment, troubleshooting
✅ Professional Standards - License, contributing guidelines, support info

The README includes proper markdown formatting, code blocks, tables, and all the information needed for users and contributors to understand and work with your WeatherScope project! 🚀

## 🙏 Acknowledgments

- **OpenWeatherMap** for comprehensive weather data API
- **Geocode.maps.co** for reliable geocoding services
- **MongoDB** for robust database solutions
- **Font Awesome** for beautiful iconography
- **Inter Font** for modern typography
- **YouTube Data API** for multimedia content integration
- **OpenStreetMap** community for mapping data

## 📞 Support

For support, questions, or contributions:

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/weatherscope/issues)
- **Email**: your.email@example.com
- **Documentation**: This README and inline code comments
- **Community**: Join discussions in GitHub Discussions

---

<div align="center">

**Built with ❤️ for advanced full-stack development demonstration**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/weatherscope.svg?style=social&label=Star)](https://github.com/yourusername/weatherscope)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/weatherscope.svg?style=social&label=Fork)](https://github.com/yourusername/weatherscope/fork)

</div>
