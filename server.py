"""Landfill, compost, and recycling facility search."""

from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Site, Zipcode
from haversine import min_haversine
from calculator import calculator

app = Flask(__name__)
app.secret_key = "123"

app.jinja_env.undefined = StrictUndefined

# ---------------------------------------------------------------#

@app.route('/')
def index():
    """Homepage of the application"""

    return render_template("base.html")

@app.route('/sites')
def create_map():
    """Shows map of sites"""

    return render_template("map.html")

@app.route('/sites_json')
def json_sites():

    # queries the db for the site objects
    sites = Site.query.all()

    return jsonify(json_list=[i.serialize for i in sites])
    
@app.route('/zipsearch')
def site_search():
    """Retrieves nearest site using lat / long distance given a zipcode"""
    # retrieves the user zipcode
    zipcode = (request.args.get("zipcode"))
    # query the db for the user_coord's lat/long, which is a tuple, eg (37.75, -122.43)
    lat1, lon1 = db.session.query(Zipcode.latitude, Zipcode.longitude).filter(Zipcode.zip == zipcode).first()
    # returns a list of tuples, ex [(1, 43.573894, -99.8492939), (2, 98.2734928, -92.72983478)...]
    sites_info = db.session.query(Site.site_id, Site.latitude, Site.longitude).filter(Site.latitude.isnot(None), Site.longitude.isnot(None)).all()

    closest_site_id = min_haversine(lat1, lon1, sites_info)

    zip_site_object = Site.query.filter(Site.site_id==closest_site_id).first()

    # haversine returns the site id, which we pass as JSON

    return jsonify(zip_site_object.serialize)

@app.route('/stateList')
def by_state():
    """A list of sites for a given state"""

    state = request.args.get("state")

    # returns a list of tuples with name and owner for each site
    state_sites = Site.query.filter(Site.site_state==state).order_by('site_name').all()

    return jsonify(state_list=[i.serialize for i in sites])

# @app.route('/sites/<int:site_id>')
# def site_details(site_id):
#     """Details of a single site"""

#     # returns the site object
#     site = db.session.query(Site).filter(Site.site_id==site_id).first()
#     return render_template("site_details.html", site=site)

@app.route('/calculator')
def calculator():
    """Calculates landfill gas (lfg) and MW (mw) of electricity"""

    tonnage = float(request.args.get("tonnage"))
    # lfg, mw = calculator(tonnage)

    lfg = str(tonnage * .432)
    mw = str(tonnage * 0.00000078)
    return jsonify(lfg=lfg, mw=mw)

#---------------------------------------------------------------------#

if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)

    app.run()
