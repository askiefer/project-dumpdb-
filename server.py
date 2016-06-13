"""Landfill, compost, and recycling facility search."""

import os

from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
# from flask.ext.cache import Cache

from model import connect_to_db, db, Site, Zipcode, Update
from haversine import min_haversine

app = Flask(__name__)
# app.secret_key = "123"
app.config['SECRET_KEY'] = os.environ.get("FLASK_SECRET_KEY", "abcdef")
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
    sites = Site.query.filter(Site.current_status == "Open").all()
    return jsonify(json_list=[i.serialize for i in sites])
    
@app.route('/zipsearch')
def site_search():
    """Retrieves nearest site using lat / long distance given a zipcode"""
    # retrieves the user zipcode
    zipcode = (request.args.get("zipcode"))
    print zipcode

    if zipcode == 'vortex':
        zip_site_object = Site.query.filter(Site.site_id == 2648).first()
    else:
        # query the db for the user_coord's lat/long, which is a tuple, eg (37.75, -122.43)
        lat1, lon1 = db.session.query(Zipcode.latitude, Zipcode.longitude).filter(Zipcode.zip == zipcode).first()
        # returns a list of tuples, ex [(1, 43.573894, -99.8492939), (2, 98.2734928, -92.72983478)...]
        sites_info = db.session.query(Site.site_id, Site.latitude, Site.longitude).filter(Site.latitude.isnot(None), Site.longitude.isnot(None)).all()

        closest_site_id = min_haversine(lat1, lon1, sites_info)

        zip_site_object = Site.query.filter(Site.site_id==closest_site_id).first()

    # haversine returns the site id, which we pass as JSON
    return jsonify(zip_site_object.serialize)

@app.route('/stateList.json')
def by_state():
    """A list of sites for a given state"""

    state = request.args.get("state")

    # returns the site objects for the submitted state
    state_sites = Site.query.filter(Site.site_state==state).order_by('site_name').all()

    return jsonify(state_list=[i.serialize for i in state_sites])

@app.route('/site.json')
def site_details():
    """Details of a single site"""

    name = request.args.get("name")
    # returns the site object that the user requested
    site = db.session.query(Site).filter(Site.site_name==name).first()
    return jsonify(site=site.serialize)

@app.route('/update-database.json', methods=["POST"])
def update_database():
    """Adds landfill site or a new site to the updates table in the database"""

    # the form information
    user_name = request.form.get("name")
    email = request.form.get("email")
    source = request.form.get("source")
    existing_site = request.form.get("dropdown")
    new_site = request.form.get("new")
    update = request.form.get("update")
    info = request.form.get("info")

    # adds the information to the updates table in the database
    new_update = Update(user_name=user_name, email=email, source=source, existing_site=existing_site, new_site=new_site, update=update, info=info)
    db.session.add(new_update)
    db.session.commit()

    return 'Success'

@app.route('/calculator')
def calculator():
    """Calculates landfill gas (lfg) and MW (mw) of electricity"""

    tonnage = float(request.args.get("tonnage"))
    # 1 million tons of Municipal Solid Waste = ~ 432,000 cubic feet of LFG and ~.78 MW of electricity
    # 1 ton of MSW = ~ .432 cubic feet of LFG and ~ 7.8e^-7
    dec_lfg = round((tonnage * .432), 2)
    lfg = str(dec_lfg)
    dec_mw = round((tonnage * 0.00000078), 2)
    mw = str(dec_mw)
    dec_homes = round(dec_mw * 1000.00)
    homes = str(dec_homes)

    return jsonify(lfg=lfg, mw=mw, homes=homes)

#---------------------------------------------------------------------#

if __name__ == "__main__":
    connect_to_db(app, os.environ.get("DATABASE_URL"))
    # DebugToolbarExtension(app)
    db.create_all(app=app)

    DEBUG = "NO_DEBUG" not in os.environ
    PORT = int(os.environ.get("PORT", 5000))

    app.run(host="0.0.0.0", port=PORT, debug=DEBUG)
