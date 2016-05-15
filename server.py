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

@app.route('/search/<int:zipcode>')
def site_search(zipcode):
    """Retrieves site details given zipcode and waste type"""

    zipcode = int(request.args.get("zipcode"))
    user_input = request.args.get("waste")
    # query the db for the site id requested
    user_site = Site.query.filter(site_type=user_input, Site_zipcode=zipcode).first()
    # if the site exists in the db
    if user_site:
        return jsonify(user_site)
        
    else:
        flash("The zipcode you entered is not in dump_db. Please enter another.")

@app.route('/sites')
def create_map():
    """Shows map of sites"""

    return render_template("map.html")

@app.route('/sites_json')
def json_sites():

    sites = db.session.query((Site.site_id, Site.site_type, Site.site_name,
        Site.longitude, Site.latitude)).all()
    site_list = []
    site_dict = {}

    # iterates through the site objects and appends them to the site_list
    for site in sites:
        # convert the tuples into dictionaries
        site_dict = site._asdict()
        # append the dictionaries to the list
        site_list.append(site_dict)

    # # iterates through the list of objects and creates a dictionary for each
    # for site in sites:
    #     json_sites[site.site_id] = {
    #                 "siteType": site.site_type,
    #                 "siteName": site.site_name,
    #                 "ownershipType": site.ownership_type,
    #                 "yearOpened": site.year_opened,
    #                 "closureYear": site.closure_year,
    #                 "latitude": site.latitude,
    #                 "longitude": site.longitude
    #             }

    # makes site_list a dictionary with key "sites" to jsonify
    site_dict["sites"] = site_list

    return jsonify(site_dict)

# @app.route('/sites.json')
# def site_info():
#     """JSON information about sites."""

#     sites = Site.query.limit(50)
#     for site in sites:
#         site = {
#             site.site_id: {
#                 "siteType": site.site_type,
#                 "siteName": site.site_name,
#                 "ownershipType": site.ownership_type,
#                 "yearOpened": site.year_opened,
#                 "closureYear": site.closure_year,
#                 "latitude": site.latitude,
#                 "longitude": site.longitude
#                 }}
#         return jsonify(sites)

#---------------------------------------------------------------------#

if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)

    app.run()
