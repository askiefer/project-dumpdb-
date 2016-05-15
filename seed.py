"""Utility file to seed zipcode, site, and association database"""

from sqlalchemy import func
from model import Site

from model import connect_to_db, db
from server import app

def load_sites():
    """Load sites and site information from sites-data into database"""

    for row in open("facility_data.txt"):
        row = row.rstrip()
        row = row.split("|")

        # change empty strings to None
        for i, item in enumerate(row):
            if not item:
                row[i] = None

        # unpacking values of the list
        (site_type, site_name, site_state, site_address, site_city, site_county,
        site_zipcode, latitude, longitude, ownership_type, ownership_organization,
        year_opened, closure_year, current_status, area, depth, capacity,
        waste_in_place, waste_in_place_year, annual_tonnage) = row

        # if there is a lat present, change lat and long to data type float
        if latitude:
            latitude = float(latitude)
            longitude = float(longitude)
        # if there is an area, change to float
        if area:
            area = float(area)
        # if there is a depth, change to float
        if depth:
            area = float(depth)
        # if there is a capacity, change to float
        if capacity:
            capacity = float(capacity)

        # if there is a zipcode, limits zipcode length to 5
        if site_zipcode and len(site_zipcode) > 5:
            site_zipcode = site_zipcode[:5]

        site = Site(site_type=site_type, site_name=site_name,
        site_state=site_state, site_address=site_address, site_city=site_city,
        site_county=site_county, site_zipcode=site_zipcode, latitude=latitude,
        longitude=longitude, ownership_type=ownership_type,
        ownership_organization=ownership_organization, year_opened=year_opened,
        closure_year=closure_year, current_status=current_status, area=area,
        depth=depth, capacity=capacity, waste_in_place=waste_in_place,
        waste_in_place_year=waste_in_place_year, annual_tonnage=annual_tonnage)


        db.session.add(site)

    db.session.commit()

if __name__ == "__main__":

    connect_to_db(app)
    load_sites()
