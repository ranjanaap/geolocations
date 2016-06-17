'use strict';

var maxmind = require('maxmind'),
    lookup = maxmind.open('./GeoLite2-City.mmdb'),
    transform = require('jsonpath-object-transform'),
    map = {
        "zip": {
            "name": '$.postal.code',
            "locations": {
                "city": {
                    "id": '$.city.geoname_id',
                    "name": '$.city.names.en'
                },
                "state_code": {
                    "id": '$.subdivisions[0].geoname_id',
                    "name": '$.subdivisions[0].iso_code'
                }
            }
        }
    };

function getGeo(ip) {
    var geo = lookup.get(ip),
        result = transform(geo, map);
    if (!result.zip.name) {
        result = {
            "errors": {
                "id": "1",
                "status": 404,
                "code": "not-found",
                "title": "Location Not Found"
            }
        };
    }
    return result;
}

/**
 * @swagger
 *    definition:
 *         geoResponse:
 *             properties:
 *                  zip:
 *                      description: "Return structure for the geolocation lookup"
 *                  items:
 *                      $ref: "#/definations/Zip"
 *         Zip:
 *              properties:
 *                  name:
 *                      description: "The 5 digit US ZIP code or 3 digit Canadian postal code"
 *                  locations:
 *                      description: "Locations structure containing potentially containing city and state_code information"
 *                  items:
 *                      $ref: "#/definitions/Locations"
 *         Locations:
 *              properties:
 *                  city:
 *                      description: "City for the geolocation, e.g. Richmond"
 *                  state_code:
 *                      description: "Two letter state or province code for the geolocation, e.g. IN"
 */

module.exports.setup = function(app) {
    /**
     * @swagger
     * /geolocations:
     *   get:
     *     tags:
     *       - Geolocations
     *     description: Return geolocation based on client ip address
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: geolocation
     *         schema:
     *           $ref: '#/definitions/geoResponse'
     */
    app.get('/geolocations', function(req, res) {
        var ip = req.connection.remoteAddress,
            result = getGeo(ip);

        if(result.errors) {
            res.status(404);
        }
        res.json(result);
    });
    /**
     * @swagger
     * /geolocations/{ip}:
     *   get:
     *     tags:
     *       - Geolocations
     *     description: Return geolocation based on ip address passed
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: ip
     *         description: ip to look up
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: geolocation
     *         schema:
     *           $ref: '#/definitions/geoResponse'
     */
    app.get('/geolocations/:ip', function(req, res) {
        var ip = req.params.ip,
            result = getGeo(ip);

        if(result.errors) {
            res.status(404);
        }
        res.json(result);
    });
};
