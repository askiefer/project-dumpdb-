import doctest

import math

def min_haversine(lat1, lon1, sites_info):
    """Finds the site_id closest to the user's lat / long coordinates

    >>> min_haversine(61.293281, -149.602138, [(1671, 41.1412, -82.6875), (1672, 40.51139, -81.54137), (1673, 41.756, -81.2004), (1674, 41.299, -82.188)])
    1671

    >>> min_haversine(61.293281, -149.602138, [(1, 61.293281, -149.602138), (2, 58.3528, -134.4947), (3, 61.59, -149.21)])
    1
    >>>

    """
    
    min_distance = 100000
    closest_site_id = None

    # user_coords is a list of tuples, site_info is a tuple with id, lat, lon
    for site in sites_info:
        site_id = site[0]
        lat2, lon2 = (site[1], site[2])

        # calculate deltas between origin and destination coordinates
        dlat = math.radians(lat2-lat1)
        dlon = math.radians(lon2-lon1)
        # a central angle between the two points
        a = math.sin(dlat/2) * math.sin(dlat/2) + math.cos(math.radians(lat1)) \
            * math.cos(math.radians(lat2)) * math.sin(dlon/2) * math.sin(dlon/2)
        # a determinative angle of the triangle on Earth
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        # spherical distance between the two points
        # radius of the Earth (km)
        r = 6371
        d = r * c

        if d < min_distance:
            closest_site_id = site_id
            min_distance = d
            
    return closest_site_id

if __name__ == "__main__":
    doctest.testmod()