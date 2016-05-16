"""Landfill, compost, and recycling facility search."""

from jinja2 import StrictUndefined
from flask import Flask, render_template, redirect, request, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

from model import connect_to_db, db, Site

app = Flask(__name__)
app.secret_key = "123"

app.jinja_env.undefined = StrictUndefined

# ---------------------------------------------------------------#

@app.route('/')
def index():
    """Homepage of the application"""

    return render_template("base.html")

# FIXME create an algorithm that calculates nearest site given zipcode
# @app.route('/search/<int:zipcode>')
# def site_search(zipcode):
#     """Retrieves site details given zipcode"""

#     zipcode = int(request.args.get("zipcode"))

#     # queries the db for the site object given the requested zipcode
#     user_site = Site.query.filter(site_zipcode=zipcode).first()

#     # if the site exists in the db
#     if user_site:
#         return jsonify(json_list=[i.serialize for i in user_site])
#     else:
#         flash("The zipcode you entered is not in dump_db. Please enter another.")

@app.route('/sites')
def create_map():
    """Shows map of sites"""

    return render_template("map.html")

@app.route('/sites_json')
def json_sites():

    # queries the db for the site objects
    sites = Site.query.all()
    return jsonify(json_list=[i.serialize for i in sites])

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
