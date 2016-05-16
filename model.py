"""Data model for sites."""

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

##################################################################
# Model definition of a site

class Site(db.Model):
    """Facility site information, including lat and long"""

    __tablename__ = "sites"

    site_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    site_type = db.Column(db.String(10), nullable=False)
    site_name = db.Column(db.String(100), nullable=False)
    site_state = db.Column(db.String(2), nullable=True)
    site_address = db.Column(db.String(100), nullable=True)
    site_city = db.Column(db.String(100), nullable=True)
    site_county = db.Column(db.String(100), nullable=True)
    site_zipcode = db.Column(db.String(5), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    ownership_type = db.Column(db.String(100), nullable=True)
    ownership_organization = db.Column(db.String(100), nullable=True)
    year_opened = db.Column(db.Integer, nullable=True)
    closure_year = db.Column(db.Integer, nullable=True)
    current_status = db.Column(db.String(100), nullable=True)
    area = db.Column(db.Float, nullable=True)
    depth = db.Column(db.Float, nullable=True)
    capacity = db.Column(db.Float, nullable=True)
    waste_in_place = db.Column(db.Integer, nullable=True)
    waste_in_place_year = db.Column(db.Integer, nullable=True)
    annual_tonnage = db.Column(db.Integer, nullable=True)

    def __repr__(self):
        """Provides site information when printed."""

        return "<Site: site_id=%s, Name: site_name=%s>" % (self.site_id, self.site_name)

    @property
    def serialize(self):
        """Returns object data in easily serializable format"""

        return {
            "siteID": self.site_id,
            "siteType": self.site_type,
            "siteName": self.site_name,
            "siteState": self.site_state,
            "siteAddress": self.site_address,
            "siteCounty": self.site_county,
            "siteZipcode": self.site_zipcode,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "ownershipType": self.ownership_type,
            "ownershipOrganization": self.ownership_organization,
            "yearOpened": self.year_opened,
            "closureYear": self.closure_year,
            "currentStatus": self.current_status,
            "area": self.area,
            "depth": self.depth,
            "capacity": self.capacity,
            "wasteInPlace": self.waste_in_place,
            "wasteInPlaceYear": self.waste_in_place_year,
            "annualTonnage": self.annual_tonnage,
        }

##################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to Flask app."""

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///sites'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.app = app
    db.init_app(app)

if __name__ == "__main__":

    from server import app
    connect_to_db(app)
    
    db.create_all()

    print "Connected to DB."
