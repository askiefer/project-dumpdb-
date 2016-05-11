"""Landfill, compost, and recycling facility search."""

from jinja2 import StrictUndefined

from flask import Flask, render_template, redirect, request, flash, session
from flask_debugtoolbar import DebugToolbarExtension

# from model import connect_to_db, db, County, Landfill, Compost, Recycling

app = Flask(__name__)

app.jinja_env.undefined = StrictUndefined

@app.route('/')
def index():
    """Homepage of the application"""

    return render_template("homepage.html")

# @app.route('/search/<int:zipcode>')
# def site_search(zipcode)
@app.route('/search')
def site_search():
    """Retrieves site details given waste type and zipcode"""

    user_input = request.args.get("waste")
    zipcode = int(request.args.get("zipcode"))

    # sites = Site.query.filter(...) \
                      # .filter

    # query the zipcodes table and returns the county_id
    county_id = db.session.query(Zipcodes.county_id).filter(Zipcodes.zipcodes == zipcode).first()

    # # if the county_id exists
    # if county_id:
    #     # query the site_counties table for the site_id
    #     site = db.session.query(SiteCounty.site_id).filter(SiteCounty.county_id == county_id)
    #     # then query the site table for the site info, given the waste type
    #     if user_input == "landfill":
    #         site_info = (db.session.query(Site.site_name, Site.site_address, Site.site_city, Site.site_state)
    #             .filter(Site.site_id == site, ))
    #     elif user_input == "compost":
    #         site_info = (db.session.query(Site.site_name, Site.site_address, Site.site_city, Site.site_state)
    #             .filter(Site.site_id == site)
