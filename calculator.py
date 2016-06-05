# 1 million tons of Municipal Solid Waste = ~ 432,000 cubic feet of LFG and ~.78 MW of electricity
# 1 ton of MSW = ~ .432 cubic feet of LFG and ~ 7.8e^-7

def calculator():
    """Calculates landfill gas (lfg) and MW (mw) of electricity"""

    tonnage = float(request.args.get("tonnage"))

    lfg = str(tonnage * .432)
    dec_mw = tonnage * 0.00000078
    homes = str(dec_mw * 1000.00)
    mw = str(dec_mw)

    return jsonify(lfg=lfg, mw=mw, homes=homes)
    