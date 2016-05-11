"""Models and database functions for """

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

##################################################################
# Model definitions

class County(db.Model):
    """County id and the county name"""

    __tablename__ = "counties"

    county_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    county_name = db.Column(db.String(50), nullable=False)
    country = db.Column(db.String, nullable=True)

    def __repr__(self):
        """Provides helpful representation when printed."""

        return "<county_name=%s>" % (self.county_name)

class Site(db.Model):
    """Facility site information"""

    __tablename__ = "sites"

    site_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    site_type = db.Column(db.String(10), nullable=False)
    site_name = db.Column(db.String(30), nullable=False)
    site_state = db.Column(db.String(2), nullable=True)
    site_address = db.Column(db.String(50), nullable=True)
    site_city = db.Column(db.String(30), nullable=True)
    site_county = db.Column(db.String(20), nullable=False)
    site_zipcode = db.Column(db.Integer, nullable=True)
    latitude = db.Column(db.Integer, nullable=True)
    longitude = db.Column(db.Integer, nullable=True)
    ownership_type = db.Column(db.String(20), nullable=True)
    ownership_organization = db.Column(db.String(20), nullable=True)
    year_opened = db.Column(db.Integer, nullable=True)
    closure_year = db.Column(db.Integer, nullable=True)
    current_status = db.Column(db.String(10), nullable=True)
    area = db.Column(db.Integer, nullable=True)
    depth = db.Column(db.Integer, nullable=True)
    capacity = db.Column(db.Integer, nullable=True)
    waste_in_place = db.Column(db.Integer, nullable=True)
    waste_in_place_year = db.Column(db.Integer, nullable=True)
    annual_tonnage = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        """Provides site information when printed."""

        return "<site: site_id=%s site_name=%s" % (self.site_id, self.site_name)

class SiteCounty(db.Model):
    """Facilities and the counties they serve"""
    # Every facility-county pair is unique.

    __tablename__ = "sites_counties"

    sitecounty_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    county_id = db.Column(db.Integer, db.ForeignKey('counties.county_id'))
    site_id = db.Column(db.Integer, db.ForeignKey('sites.site_id'))

    county = db.relationship("County", backref="sites-counties")
    site = db.relationship("Site", backref="site-counties")

class Zipcodes(db.Model):
    """Counties and their zip codes"""

    __tablename__ = "zipcodes"

    zipcodes = db.Column(db.Integer, primary_key=True)
    county_id = db.Column(db.Integer, db.ForeignKey('counties.county_id'))

##################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to Flask app."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sites'
    db.app = app
    db.init_app(app)

if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    print "Connected to DB."
