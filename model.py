"""Models and database functions for """

from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

##################################################################
# Model definitions

class Site(db.Model):
    """Facility site information"""

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
