// Landmark to city mapping
const landmarkToCity = {
    // Paris landmarks
    "eiffel tower": "Paris,FR",
    "louvre museum": "Paris,FR",
    "arc de triomphe": "Paris,FR",
    "notre dame": "Paris,FR",
    "notre dame cathedral": "Paris,FR",
    "champs elysees": "Paris,FR",
    "sacre coeur": "Paris,FR",
    "pont neuf": "Paris,FR",
    "palace of versailles": "Versailles,FR",

    // New York landmarks
    "times square": "New York,US",
    "statue of liberty": "New York,US",
    "empire state building": "New York,US",
    "central park": "New York,US",
    "brooklyn bridge": "New York,US",
    "one world trade center": "New York,US",
    "freedom tower": "New York,US",
    "madison square garden": "New York,US",
    "9/11 memorial": "New York,US",
    "ground zero": "New York,US",
    "rockefeller center": "New York,US",
    "wall street": "New York,US",
    "high line": "New York,US",
    "yankee stadium": "New York,US",

    // London landmarks
    "big ben": "London,GB",
    "tower bridge": "London,GB",
    "london eye": "London,GB",
    "buckingham palace": "London,GB",
    "westminster abbey": "London,GB",
    "tower of london": "London,GB",
    "piccadilly circus": "London,GB",
    "hyde park": "London,GB",
    "london bridge": "London,GB",
    "st pauls cathedral": "London,GB",
    "trafalgar square": "London,GB",
    "covent garden": "London,GB",
    "houses of parliament": "London,GB",
    "kensington palace": "London,GB",

    // Rome landmarks
    "vatican city": "Rome,IT",
    "sistine chapel": "Rome,IT",
    "st peters basilica": "Rome,IT",
    "trevi fountain": "Rome,IT",
    "spanish steps": "Rome,IT",
    "roman forum": "Rome,IT",
    "castel sant angelo": "Rome,IT",

    // India landmarks - Comprehensive collection
    "taj mahal": "Agra,IN",
    "red fort": "Delhi,IN",
    "india gate": "Delhi,IN",
    "lotus temple": "Delhi,IN",
    "gateway of india": "Mumbai,IN",
    "golden temple": "Amritsar,IN",
    "amber fort": "Jaipur,IN",
    "mysore palace": "Mysore,IN",
    "victoria memorial": "Kolkata,IN",

    // Delhi landmarks
    "qutub minar": "Delhi,IN",
    "humayun tomb": "Delhi,IN",
    "jama masjid": "Delhi,IN",
    "chandni chowk": "Delhi,IN",
    "akshardham temple": "Delhi,IN",
    "parliament house": "Delhi,IN",
    "rashtrapati bhavan": "Delhi,IN",
    "connaught place": "Delhi,IN",
    "lodi gardens": "Delhi,IN",

    // Mumbai landmarks
    "marine drive": "Mumbai,IN",
    "chhatrapati shivaji terminus": "Mumbai,IN",
    "elephanta caves": "Mumbai,IN",
    "juhu beach": "Mumbai,IN",
    "hanging gardens": "Mumbai,IN",
    "crawford market": "Mumbai,IN",
    "nariman point": "Mumbai,IN",
    "bandra worli sea link": "Mumbai,IN",
    "siddhivinayak temple": "Mumbai,IN",
    "haji ali dargah": "Mumbai,IN",

    // Rajasthan landmarks
    "hawa mahal": "Jaipur,IN",
    "city palace jaipur": "Jaipur,IN",
    "jantar mantar": "Jaipur,IN",
    "nahargarh fort": "Jaipur,IN",
    "jaigarh fort": "Jaipur,IN",
    "umaid bhawan palace": "Jodhpur,IN",
    "mehrangarh fort": "Jodhpur,IN",
    "city palace udaipur": "Udaipur,IN",
    "lake palace": "Udaipur,IN",
    "jaisalmer fort": "Jaisalmer,IN",
    "thar desert": "Jaisalmer,IN",

    // Kerala landmarks
    "munnar tea gardens": "Munnar,IN",
    "chinese fishing nets": "Kochi,IN",
    "mattancherry palace": "Kochi,IN",
    "periyar wildlife sanctuary": "Thekkady,IN",
    "kovalam beach": "Thiruvananthapuram,IN",
    "padmanabhaswamy temple": "Thiruvananthapuram,IN",

    // Karnataka landmarks
    "bangalore palace": "Bangalore,IN",
    "lalbagh botanical garden": "Bangalore,IN",
    "cubbon park": "Bangalore,IN",
    "mysore zoo": "Mysore,IN",
    "chamundi hills": "Mysore,IN",
    "gol gumbaz": "Bijapur,IN",

    // Tamil Nadu landmarks
    "meenakshi temple": "Madurai,IN",
    "marina beach": "Chennai,IN",
    "shore temple": "Mahabalipuram,IN",
    "brihadeeswara temple": "Thanjavur,IN",
    ooty: "Ooty,IN",
    "rameswaram temple": "Rameswaram,IN",

    // West Bengal landmarks
    "howrah bridge": "Kolkata,IN",
    "dakshineswar temple": "Kolkata,IN",
    "kalighat temple": "Kolkata,IN",
    "science city": "Kolkata,IN",
    "eden gardens": "Kolkata,IN",
    "tiger hill": "Darjeeling,IN",

    // Goa landmarks
    "baga beach": "Panaji,IN",
    "calangute beach": "Panaji,IN",
    "basilica of bom jesus": "Panaji,IN",
    "se cathedral": "Panaji,IN",
    "fort aguada": "Panaji,IN",
    "dudhsagar falls": "Panaji,IN",
    "anjuna beach": "Panaji,IN",

    // Andhra Pradesh & Telangana landmarks
    "golconda fort": "Hyderabad,IN",
    "salar jung museum": "Hyderabad,IN",
    "ramoji film city": "Hyderabad,IN",
    "tirupati temple": "Tirupati,IN",
    "araku valley": "Visakhapatnam,IN",

    // Uttar Pradesh landmarks
    "fatehpur sikri": "Agra,IN",
    "itmad ud daulah": "Agra,IN",
    "mehtab bagh": "Agra,IN",
    "varanasi ghats": "Varanasi,IN",
    "kashi vishwanath temple": "Varanasi,IN",
    "allahabad fort": "Prayagraj,IN",
    "kumbh mela": "Prayagraj,IN",

    // Punjab landmarks
    "jallianwala bagh": "Amritsar,IN",
    "wagah border": "Amritsar,IN",
    "anandpur sahib": "Anandpur Sahib,IN",

    // Gujarat landmarks
    "somnath temple": "Somnath,IN",
    "dwarka temple": "Dwarka,IN",
    "gir national park": "Junagadh,IN",
    "sabarmati ashram": "Ahmedabad,IN",
    "akshardham gandhinagar": "Gandhinagar,IN",
    "rann of kutch": "Bhuj,IN",

    // Himachal Pradesh landmarks
    "shimla mall road": "Shimla,IN",
    "rohtang pass": "Manali,IN",
    "mcleod ganj": "Dharamshala,IN",
    "spiti valley": "Kaza,IN",
    "kullu valley": "Kullu,IN",

    // Uttarakhand landmarks
    "kedarnath temple": "Kedarnath,IN",
    "badrinath temple": "Badrinath,IN",
    "valley of flowers": "Chamoli,IN",

    // Jammu & Kashmir landmarks
    "dal lake": "Srinagar,IN",
    "shalimar bagh": "Srinagar,IN",
    "pangong tso": "Leh,IN",
    "magnetic hill": "Leh,IN",

    // Madhya Pradesh landmarks
    "khajuraho temples": "Khajuraho,IN",
    "sanchi stupa": "Sanchi,IN",
    "kanha national park": "Kanha,IN",
    "bandhavgarh national park": "Umaria,IN",

    // Orissa landmarks
    "jagannath temple": "Puri,IN",
    "konark sun temple": "Konark,IN",
    "chilika lake": "Bhubaneswar,IN",
    "lingaraj temple": "Bhubaneswar,IN",

    // Northeast India landmarks
    "kaziranga national park": "Jorhat,IN",
    "majuli island": "Jorhat,IN",
    "tawang monastery": "Tawang,IN",
    "living root bridges": "Cherrapunji,IN",
    "loktak lake": "Imphal,IN",

    // Maharashtra landmarks (beyond Mumbai)
    "ajanta caves": "Aurangabad,IN",
    "ellora caves": "Aurangabad,IN",

    // Bihar & Jharkhand landmarks
    "nalanda university": "Nalanda,IN",
    "bodh gaya": "Gaya,IN",
    "mahabodhi temple": "Gaya,IN",

    // China landmarks
    "great wall of china": "Beijing,CN",
    "great wall": "Beijing,CN",
    "forbidden city": "Beijing,CN",
    "temple of heaven": "Beijing,CN",
    "summer palace": "Beijing,CN",
    "tiananmen square": "Beijing,CN",
    "terra cotta warriors": "Xi'an,CN",
    "shanghai tower": "Shanghai,CN",
    "oriental pearl tower": "Shanghai,CN",
    "li river": "Guilin,CN",

    // Japan landmarks
    "mount fuji": "Tokyo,JP",
    "tokyo tower": "Tokyo,JP",
    "senso ji temple": "Tokyo,JP",
    "tokyo skytree": "Tokyo,JP",
    "shibuya crossing": "Tokyo,JP",
    "meiji shrine": "Tokyo,JP",
    "fushimi inari shrine": "Kyoto,JP",
    "kiyomizu dera": "Kyoto,JP",
    "golden pavilion": "Kyoto,JP",
    "hiroshima peace memorial": "Hiroshima,JP",

    // USA landmarks (beyond New York)
    "golden gate bridge": "San Francisco,US",
    "hollywood sign": "Los Angeles,US",
    "walt disney world": "Orlando,US",
    "mount rushmore": "Rapid City,US",
    "niagara falls": "Niagara Falls,US",
    "grand canyon": "Grand Canyon,US",
    "space needle": "Seattle,US",
    "white house": "Washington,US",
    "lincoln memorial": "Washington,US",
    "capitol building": "Washington,US",
    "mount vernon": "Mount Vernon,US",
    "golden gate park": "San Francisco,US",
    "las vegas strip": "Las Vegas,US",
    "miami beach": "Miami,US",
    "mount rushmore": "Keystone,US",

    // Canada landmarks
    "cn tower": "Toronto,CA",
    "niagara falls": "Niagara Falls,CA",
    "banff national park": "Calgary,CA",
    "parliament hill": "Ottawa,CA",
    "chateau frontenac": "Quebec City,CA",

    // Australia landmarks
    "sydney opera house": "Sydney,AU",
    "sydney harbour bridge": "Sydney,AU",
    "ayers rock": "Uluru,AU",
    "great barrier reef": "Cairns,AU",
    "twelve apostles": "Melbourne,AU",

    // South America landmarks
    "christ the redeemer": "Rio de Janeiro,BR",
    "machu picchu": "Cusco,PE",
    "iguazu falls": "Foz do Iguaçu,BR",
    "sugarloaf mountain": "Rio de Janeiro,BR",
    "easter island": "Hanga Roa,CL",

    // Middle East landmarks
    "burj khalifa": "Dubai,AE",
    "burj al arab": "Dubai,AE",
    "palm jumeirah": "Dubai,AE",
    "pyramids of giza": "Cairo,EG",
    "great pyramid": "Cairo,EG",
    "blue mosque": "Istanbul,TR",
    "hagia sophia": "Istanbul,TR",

    // European landmarks
    "sagrada familia": "Barcelona,ES",
    "park guell": "Barcelona,ES",
    "brandenburg gate": "Berlin,DE",
    "neuschwanstein castle": "Munich,DE",
    "cologne cathedral": "Cologne,DE",
    "leaning tower of pisa": "Pisa,IT",
    "st marks square": "Venice,IT",
    "rialto bridge": "Venice,IT",
    "edinburgh castle": "Edinburgh,GB",
    "cliffs of moher": "Doolin,IE",
    "red square": "Moscow,RU",
    "st basils cathedral": "Moscow,RU",
    "hermitage museum": "St Petersburg,RU",
    "anne frank house": "Amsterdam,NL",
    "little mermaid": "Copenhagen,DK",
    "tivoli gardens": "Copenhagen,DK",
    "stockholm city hall": "Stockholm,SE",
    "oslo opera house": "Oslo,NO",
    "charles bridge": "Prague,CZ",
    "prague castle": "Prague,CZ",

    // Africa landmarks
    "table mountain": "Cape Town,ZA",
    "victoria falls": "Victoria Falls,ZM",
    "mount kilimanjaro": "Arusha,TZ",
    "karnak temple": "Luxor,EG",
    "valley of the kings": "Luxor,EG",

    // Southeast Asia landmarks
    "angkor wat": "Siem Reap,KH",
    "bayon temple": "Siem Reap,KH",
    "petronas towers": "Kuala Lumpur,MY",
    "marina bay sands": "Singapore,SG",
    "grand palace": "Bangkok,TH",
    "wat pho": "Bangkok,TH",
    "ha long bay": "Ha Long,VN",

    // Island landmarks
    "mount vesuvius": "Naples,IT",
    "mount etna": "Catania,IT",
    "giants causeway": "Belfast,GB",
    "mont saint michel": "Mont-Saint-Michel,FR",
    "plitvice lakes": "Plitvice,HR",
    "dubrovnik old town": "Dubrovnik,HR",

    // Additional world landmarks
    "mount everest": "Kathmandu,NP",
    "tiger nest monastery": "Paro,BT",
    "shwedagon pagoda": "Yangon,MM",
    "chocolate hills": "Bohol,PH",
    "jeju island": "Jeju,KR",
    "gyeongbokgung palace": "Seoul,KR",
    "n seoul tower": "Seoul,KR",

    // Nordic landmarks
    "northern lights": "Tromsø,NO",
    "lofoten islands": "Svolvær,NO",
    "blue lagoon": "Reykjavik,IS",

    // Historical landmarks
    "chichen itza": "Merida,MX",
    "monte cristo": "Rio de Janeiro,BR",
    "moai statues": "Hanga Roa,CL",
    "nazca lines": "Nazca,PE",
};

// Helper function
function getLandmarkCity(location) {
    const locationLower = location.toLowerCase().trim();
    return landmarkToCity[locationLower] || null;
}

// CommonJS export
module.exports = {
    landmarkToCity,
    getLandmarkCity,
};
