"""Landfill, compost, and recycling facility search."""

from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
# from flask.ext.cache import Cache

from model import connect_to_db, db, Site, Zipcode
from haversine import min_haversine

app = Flask(__name__)
app.secret_key = "123"
app.config['CACHE_TYPE'] = 'simple'
# app.cache = Cache(app)

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

@app.route('/update_database', methods=["POST"])
def update_database():
    """Updates landfill site or adds a new site"""

    # the landfill name
    site = request.form.get("site")
    new_site = request.form.get("new")
    # the type of information 
    update = request.form.get("update")
    info = request.form.get("info")

    # checks to see if the site is in the database and, if it is, updates it given the info
    site = db.session.query(Site.site_id).filter(Site.site_name == site)

    if site:
        if update == "Status":
            info.lower()
            site.current_status = info
            # take info and update it
        elif update == "Zipcode":
            site.zipcode = info

        elif update == "Waste In Place":
            site.waste_in_place = info

        elif update == "Annual Tonnage":
            site.annual_tonnage = info

        else:
            site.capacity = info

    else:
        new_site = Site(site_name=site)
        db.session.add(new_site)

    db.session.commit()
    

@app.route('/calculator')
def calculator():
    """Calculates landfill gas (lfg) and MW (mw) of electricity"""

    tonnage = float(request.args.get("tonnage"))

    dec_lfg = round((tonnage * .432), 2)
    lfg = str(dec_lfg)
    dec_mw = round((tonnage * 0.00000078), 2)
    mw = str(dec_mw)
    dec_homes = round(dec_mw * 1000.00)
    homes = str(dec_homes)

    return jsonify(lfg=lfg, mw=mw, homes=homes)

#---------------------------------------------------------------------#

if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)

    app.run()
