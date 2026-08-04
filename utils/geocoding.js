const axios = require("axios");

async function getCoordinates(location, country) {
    try {
        const query = `${location}, ${country}`;

        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: query,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "WanderLust/1.0",
                },
            }
        );

        if (response.data.length === 0) {
            return null;
        }

        return {
            type: "Point",
            coordinates: [
                parseFloat(response.data[0].lon),
                parseFloat(response.data[0].lat),
            ],
        };
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports = getCoordinates;