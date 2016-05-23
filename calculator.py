# 1 million tons of MSW = ~ 432,000 cubic feet of LFG and ~.78 MW of electricity
# 1 ton of MSW = ~ .432 cubic feet of LFG and ~ 7.8e^-7

def calculator(tonnage):
    """Calculates MW and LFG (cubic ft) per 1 ton of MSW"""
    amt_lfg = tonnage * .432
    amt_mw = tonnage * 0.00000078

    return amt_lfg, format(amt_mw, '.2f')
