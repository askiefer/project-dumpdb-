"""Utility file to seed zipcode, site, and association database"""

from sqlalchemy import func
from model import County
from model import Sites

from model import connect_to_db, db
from server import app

# def load_counties():
#     """Load counties and zipcodes from zip-data into database"""

#     for row in open("seed_data/zipcode-data"):
#         row = row.rstrip()

def load_sites():
    """Load sites and site information from sites-data into database"""

    for row in open("seed_data/site-data"):
        row = row.rstrip()
        (site_id, site_type, site_name, site_state, site_address, site_city, site_county,
        site_zipcode, latitude, longitude, ownership_type, ownership_organization,
        year_opened, closure_year, current_status, area, depth, capacity,
        waste_in_place, waste_in_place_year, annual_tonnage) = row.split("|")

        site = Site(site_id=site_id, site_type=site_type, site_name=site_name,
            site_state=site_state, site_address=site_address, site_city=site_city,
            site_county=site_county, site_zipcode=site_zipcode, latitude=latitude,
            longitude=longitude, ownership_type=ownership_type,
            ownership_organization=ownership_organization, year_opened=year_opened,
            closure_year=closure_year, current_status=current_status, area=area,
            depth=depth, capacity=capacity, waste_in_place=waste_in_place,
            waste_in_place_year=waste_in_place_year, annual_tonnage=annual_tonnage)

        db.session.add(site)

    db.session.commit()

# def load_pairs():
#     """Load county-site facility pairings"""

#     for row in open("seed_data/pair-data"):
#         row = row.rstrip()
#         county, facility_name, facility_type = row.split("|")

