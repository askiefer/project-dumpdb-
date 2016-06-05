import doctest

# 1 million tons of Municipal Solid Waste = ~ 432,000 cubic feet of LFG and ~.78 MW of electricity
# 1 ton of MSW = ~ .432 cubic feet of LFG and ~ 7.8e^-7

def calculator(tonnage):
    """Calculates landfill gas (lfg) and MW (mw) of electricity

    >>> calculator(2000)
    ('864.0', '1.56', '0.00156')

    >>> calculator(1)
    ('0.432', '0.00078', '7.8e-07')
    >>>

    """

    lfg = str(tonnage * .432)
    dec_mw = tonnage * 0.00000078
    homes = str(dec_mw * 1000.00)
    mw = str(dec_mw)

    # return jsonify(lfg=lfg, mw=mw, homes=homes)
    return (lfg, homes, mw)

if __name__ == "__main__":
    doctest.testmod()