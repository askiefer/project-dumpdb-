"""Landfill, compost, and recycling facility search."""

from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Site, Zipcode
from haversine import assign_info, haversine

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

@app.route('/zipSearch')
def site_search():
    """Retrieves nearest site using lat / long distance given a zipcode"""
    # retrieves the user zipcode
    zipcode = (request.args.get("zipcode"))

    # user_coord is a tuple, eg (37.75, -122.43)
    user_coord = db.session.query(Zipcode.latitude, Zipcode.longitude).filter(Zipcode.zip == zipcode).one()
    
    # returns list of tuples, ex [(1, 43.573894, -99.8492939), (2, 98.2734928, -92.72983478)...]
    sites_info = db.session.query(Site.site_id, Site.latitude, Site.longitude).filter(Site.latitude.isnot(None), Site.longitude.isnot(None)).all()
    
    haversine(user_coord, sites_info)
    
    # haversine returns the site id, which we pass as JSON
    return jsonify(json_list=min_key)

@app.route('/stateList')
def by_state():
    """A list of sites for a given state"""

    state = request.args.get("state")

    # returns a list of tuples with name and owner for each site
    state_sites = (db.session.query(Site.site_id, Site.site_name, Site.ownership_organization).filter(Site.site_state==state).order_by('site_name').all())
    return render_template("state_list.html", sites=state_sites)

@app.route('/sites/<int:site_id>')
def site_details(site_id):
    """Details of a single site"""

    # returns the site object
    site = (db.session.query(Site).filter(Site.site_id==site_id).first())
    print site
    return render_template("site_details.html", site=site)

#---------------------------------------------------------------------#

if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)

    app.run()
