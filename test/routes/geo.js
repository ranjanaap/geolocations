var should = require('should'),
    request = require('supertest'),
    server = supertest.agent("http://localhost:3000");

describe('GET /geolocations', function() {

    it("should return json", function(done) {

        // calling geolocations api
        server
            .get("/geolocations")
            .expect("Content-type", /json/)
            .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.error.should.equal(false);
                done();
            });
    });
});


describe('GET /geolocations/{ip}', function() {

    it("should return json", function(done) {

        // calling geolocations api
        server
            .get("/geolocations/66.66.111.444")
            .expect("Content-type", /json/)
            .expect(200)
            .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                // Error key should be false.
                res.body.error.should.equal(false);
                done();
            });
    });
});
