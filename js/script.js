const countryBounds = {
    "AFG": [[29.3, 60.5], [38.5, 75.2]],    "ALA": [[59.9, 19.3], [60.5, 21.0]],    "ALB": [[39.6, 19.3], [42.7, 21.0]], 
    "DZA": [[18.9, -8.7], [37.1, 12.0]],    "ASM": [[-14.4, -170.8], [-14.1, -169.4]], "AND": [[42.4, 1.4], [42.7, 1.8]], 
    "AGO": [[-18.0, 11.6], [-4.4, 24.1]],   "AIA": [[18.1, -63.2], [18.3, -62.9]],  "ATA": [[-90.0, -180.0], [-60.0, 180.0]], 
    "ATG": [[17.0, -61.9], [17.7, -61.7]],  "ARG": [[-55.3, -73.4], [-21.8, -53.6]], "ARM": [[38.8, 43.5], [41.3, 46.6]], 
    "ABW": [[12.4, -70.1], [12.6, -69.8]],  "AUS": [[-43.7, 112.9], [-10.7, 153.6]], "AUT": [[46.3, 9.5], [49.1, 17.2]], 
    "AZE": [[38.4, 44.8], [41.9, 50.6]],    "BHS": [[20.9, -80.5], [27.3, -72.7]],  "BHR": [[25.6, 50.3], [26.3, 50.8]], 
    "BGD": [[20.6, 88.0], [26.6, 92.7]],    "BRB": [[13.0, -59.7], [13.4, -59.4]],  "BLR": [[51.2, 23.1], [56.2, 32.8]], 
    "BEL": [[49.5, 2.5], [51.5, 6.4]],      "BLZ": [[15.9, -89.2], [18.5, -87.4]],  "BEN": [[6.2, 0.8], [12.4, 3.9]], 
    "BMU": [[32.2, -64.9], [32.4, -64.6]],  "BTN": [[26.7, 88.8], [28.3, 92.1]],    "BOL": [[-23.0, -69.6], [-9.7, -57.5]], 
    "BES": [[12.0, -68.4], [17.7, -62.9]],  "BIH": [[42.5, 15.7], [45.3, 19.6]],    "BWA": [[-26.9, 20.0], [-17.8, 29.4]], 
    "BVT": [[-54.5, 3.2], [-54.3, 3.5]],    "BRA": [[-33.8, -74.0], [5.3, -34.7]],  "IOT": [[-7.5, 71.2], [-5.2, 72.5]], 
    "BRN": [[4.0, 114.1], [5.1, 115.4]],    "BGR": [[41.2, 22.4], [44.2, 28.6]],    "BFA": [[9.4, -5.5], [15.1, 2.4]], 
    "BDI": [[-4.5, 29.0], [-2.3, 30.9]],    "CPV": [[14.8, -25.4], [17.2, -22.7]],  "KHM": [[9.9, 102.3], [14.7, 107.6]], 
    "CMR": [[1.6, 8.5], [13.1, 16.2]],      "CAN": [[41.7, -141.0], [83.1, -52.6]], "CYM": [[19.2, -81.4], [19.8, -79.7]], 
    "CAF": [[2.2, 14.4], [11.0, 27.5]],     "TCD": [[7.4, 13.4], [23.5, 24.0]],     "CHL": [[-56.0, -75.6], [-17.5, -66.4]], 
    "CHN": [[18.0, 73.5], [53.6, 134.8]],   "CXR": [[-10.6, 105.5], [-10.4, 105.7]], "CCK": [[-12.2, 96.8], [-11.8, 96.9]], 
    "COL": [[-4.2, -79.0], [13.4, -66.8]],  "COM": [[-12.4, 43.2], [-11.3, 44.5]],  "COG": [[-5.0, 11.1], [3.7, 18.7]], 
    "COD": [[-13.5, 12.2], [5.4, 31.3]],    "COK": [[-21.3, -160.0], [-8.9, -157.3]], "CRI": [[8.0, -86.0], [11.2, -82.5]], 
    "CIV": [[4.4, -8.6], [10.7, -2.5]],     "HRV": [[42.3, 13.5], [46.6, 19.5]],    "CUB": [[19.8, -85.0], [23.3, -74.1]], 
    "CUW": [[12.0, -69.2], [12.4, -68.7]],  "CYP": [[34.5, 32.3], [35.7, 34.6]],    "CZE": [[48.5, 12.0], [51.1, 18.9]], 
    "DNK": [[54.5, 8.0], [57.8, 15.2]],     "DJI": [[10.9, 41.7], [12.7, 43.4]],    "DMA": [[15.2, -61.5], [15.7, -61.2]], 
    "DOM": [[17.5, -72.0], [19.9, -68.3]],  "ECU": [[-5.0, -81.0], [2.0, -75.2]],   "EGY": [[22.0, 24.7], [31.7, 35.8]], 
    "SLV": [[13.1, -90.1], [14.5, -87.7]],  "GNQ": [[1.0, 5.5], [3.8, 11.6]],       "ERI": [[12.3, 36.4], [18.0, 43.2]], 
    "EST": [[57.5, 21.8], [59.7, 28.2]],    "SWZ": [[-27.3, 30.8], [-25.7, 32.1]],  "ETH": [[3.4, 33.0], [14.9, 48.0]], 
    "FLK": [[-52.9, -61.3], [-51.0, -57.7]], "FRO": [[61.3, -7.7], [62.4, -6.2]],   "FJI": [[-21.7, 174.5], [-12.4, -178.1]], 
    "FIN": [[59.7, 20.5], [70.1, 31.6]],    "FRA": [[41.3, -5.1], [51.1, 9.6]],     "GUF": [[2.1, -54.6], [5.8, -51.6]], 
    "PYF": [[-27.6, -154.7], [-7.8, -134.4]], "ATF": [[-50.0, 40.0], [-37.0, 80.0]], "GAB": [[-3.9, 8.7], [2.3, 14.5]], 
    "GMB": [[13.0, -16.8], [13.8, -13.8]],  "GEO": [[41.0, 40.0], [43.6, 46.7]],    "DEU": [[47.2, 5.8], [55.1, 15.1]], 
    "GHA": [[4.7, -3.3], [11.2, 1.2]],      "GIB": [[36.1, -5.4], [36.2, -5.3]],    "GRC": [[34.8, 19.3], [41.8, 29.7]], 
    "GRL": [[59.7, -73.3], [83.6, -11.3]],  "GRD": [[12.0, -61.8], [12.5, -61.4]],  "GLP": [[15.8, -61.8], [16.5, -61.0]], 
    "GUM": [[13.2, 144.6], [13.7, 145.0]],  "GTM": [[13.7, -92.2], [18.4, -88.2]],  "GGY": [[49.4, -2.7], [49.5, -2.3]], 
    "GIN": [[7.2, -15.1], [12.7, -7.6]],    "GNB": [[10.9, -16.7], [12.7, -13.6]],  "GUY": [[1.2, -61.4], [8.6, -56.4]], 
    "HTI": [[18.0, -74.5], [20.1, -71.6]],  "HMD": [[-53.2, 73.2], [-53.0, 73.8]],  "VAT": [[41.9, 12.4], [41.9, 12.5]], 
    "HND": [[13.0, -89.4], [16.5, -83.1]],  "HKG": [[22.1, 113.8], [22.6, 114.4]],  "HUN": [[45.7, 16.1], [48.6, 22.9]], 
    "ISL": [[63.3, -24.5], [66.6, -13.5]],  "IND": [[6.5, 68.1], [35.5, 97.4]],     "IDN": [[-11.0, 94.9], [6.1, 141.0]], 
    "IRN": [[25.0, 44.0], [39.8, 63.4]],    "IRQ": [[29.1, 38.8], [37.4, 48.6]],    "IRL": [[51.4, -10.7], [55.4, -5.9]], 
    "IMN": [[54.0, -4.8], [54.4, -4.3]],    "ISR": [[29.4, 34.2], [33.4, 35.9]],    "ITA": [[35.5, 6.6], [47.1, 18.5]], 
    "JAM": [[17.7, -78.4], [18.6, -76.1]],  "JPN": [[30.0, 128.0], [45.5, 148.5]],  "JEY": [[49.1, -2.3], [49.3, -2.0]], 
    "JOR": [[29.2, 34.9], [33.4, 39.3]],    "KAZ": [[40.5, 46.5], [55.4, 87.3]],    "KEN": [[-4.7, 33.9], [5.0, 41.9]], 
    "KIR": [[-11.5, 169.5], [4.7, -150.1]], "PRK": [[37.6, 124.3], [43.0, 130.7]],  "KOR": [[33.1, 124.6], [38.6, 131.9]], 
    "KWT": [[28.5, 46.5], [30.1, 48.4]],    "KGZ": [[39.2, 69.2], [43.3, 80.3]],    "LAO": [[13.9, 100.1], [22.5, 107.7]], 
    "LVA": [[55.7, 20.9], [58.1, 28.3]],    "LBN": [[33.0, 35.1], [34.7, 36.6]],    "LSO": [[-30.7, 27.0], [-28.5, 29.5]], 
    "LBR": [[4.3, -11.5], [8.6, -7.3]],     "LBY": [[19.5, 9.4], [33.0, 25.0]],     "LIE": [[47.0, 9.4], [47.3, 9.6]], 
    "LTU": [[53.9, 20.9], [56.5, 26.9]],    "LUX": [[49.4, 5.7], [50.2, 6.6]],      "MAC": [[22.1, 113.5], [22.2, 113.6]], 
    "MKD": [[40.8, 20.4], [42.4, 23.1]],    "MDG": [[-25.7, 43.2], [-11.9, 50.5]],  "MWI": [[-17.2, 32.6], [-9.3, 36.0]], 
    "MYS": [[0.8, 99.6], [7.4, 119.3]],     "MDV": [[-0.7, 72.5], [7.1, 73.8]],     "MLI": [[10.1, -12.3], [25.0, 4.3]], 
    "MLT": [[35.8, 14.2], [36.1, 14.6]],    "MHL": [[4.5, 160.8], [14.7, 172.2]],   "MTQ": [[14.4, -61.2], [14.9, -60.8]], 
    "MRT": [[14.7, -17.1], [27.4, -4.8]],   "MUS": [[-20.6, 57.3], [-19.9, 57.8]],  "MYT": [[-13.0, 45.0], [-12.6, 45.3]], 
    "MEX": [[14.5, -118.4], [32.7, -86.7]], "FSM": [[1.0, 137.0], [10.2, 163.1]],   "MDA": [[45.4, 26.6], [48.5, 30.2]], 
    "MCO": [[43.7, 7.4], [43.7, 7.5]],      "MNG": [[41.5, 87.7], [52.2, 119.9]],   "MNE": [[41.8, 18.4], [43.6, 20.4]], 
    "MSR": [[16.6, -62.2], [16.8, -62.1]],  "MAR": [[21.3, -17.1], [35.9, -1.0]],   "MOZ": [[-26.9, 30.2], [-10.5, 40.9]], 
    "MMR": [[9.6, 92.2], [28.6, 101.2]],    "NAM": [[-28.9, 11.7], [-16.9, 25.3]],  "NRU": [[-0.6, 166.9], [-0.5, 167.0]], 
    "NPL": [[26.3, 80.0], [30.5, 88.2]],    "NLD": [[50.7, 3.3], [53.6, 7.2]],      "NCL": [[-22.7, 163.9], [-19.5, 168.1]], 
    "NZL": [[-47.3, 166.4], [-34.1, 178.6]],"NIC": [[10.7, -87.7], [15.1, -82.6]],  "NER": [[11.7, 0.1], [23.5, 16.0]], 
    "NGA": [[4.2, 2.6], [13.9, 14.7]],      "NIU": [[-19.1, -169.9], [-18.9, -169.7]],"NFK": [[-29.1, 167.9], [-28.9, 168.0]], 
    "MNP": [[14.1, 145.1], [20.6, 145.8]],  "NOR": [[57.9, 4.6], [71.2, 31.1]],     "OMN": [[16.6, 53.0], [26.5, 59.9]], 
    "PAK": [[23.6, 60.8], [37.1, 77.9]],    "PLW": [[2.7, 134.0], [8.2, 134.7]],    "PSE": [[31.2, 34.2], [32.5, 35.5]], 
    "PAN": [[7.2, -83.0], [9.6, -77.1]],    "PNG": [[-12.3, 140.8], [0.0, 156.1]],  "PRY": [[-27.6, -62.7], [-19.3, -54.2]], 
    "PER": [[-18.4, -81.4], [0.1, -68.6]],  "PHL": [[4.6, 116.6], [21.1, 126.6]],   "PCN": [[-24.1, -130.1], [-24.0, -130.0]], 
    "POL": [[49.0, 14.1], [54.9, 24.1]],    "PRT": [[36.9, -9.5], [42.2, -6.1]],    "PRI": [[17.9, -67.3], [18.5, -65.2]], 
    "QAT": [[24.5, 50.7], [26.2, 51.7]],    "REU": [[-21.4, 55.2], [-20.8, 55.8]],  "ROU": [[43.6, 20.2], [48.3, 29.7]], 
    "RUS": [[41.1, 19.6], [81.8, 180.0]],   "RWA": [[-2.9, 28.8], [-1.0, 30.9]],    "BLM": [[17.8, -62.9], [17.9, -62.8]], 
    "SHN": [[-40.4, -12.5], [-7.9, 0.0]],   "KNA": [[17.1, -62.9], [17.4, -62.5]],  "LCA": [[13.7, -61.1], [14.1, -60.8]], 
    "MAF": [[18.0, -63.1], [18.1, -63.0]],  "SPM": [[46.7, -56.4], [47.1, -56.1]],  "VCT": [[12.5, -61.3], [13.4, -61.1]], 
    "WSM": [[-14.1, -172.9], [-13.4, -171.3]],"SMR": [[43.9, 12.4], [44.0, 12.5]],  "STP": [[-0.0, 6.4], [1.7, 7.5]], 
    "SAU": [[16.4, 34.5], [32.2, 55.7]],    "SEN": [[12.3, -17.6], [16.7, -11.3]],  "SRB": [[42.2, 18.8], [46.2, 23.1]], 
    "SYC": [[-10.4, 46.1], [-3.6, 56.4]],   "SLE": [[6.9, -13.3], [10.0, -10.3]],   "SGP": [[1.1, 103.6], [1.5, 104.1]], 
    "SXM": [[18.0, -63.1], [18.1, -63.0]],  "SVK": [[47.7, 16.8], [49.6, 22.6]],    "SVN": [[45.4, 13.3], [46.9, 16.6]], 
    "SLB": [[-12.8, 155.3], [-5.1, 170.3]], "SOM": [[-1.7, 41.0], [12.0, 51.4]],    "ZAF": [[-34.9, 16.3], [-22.1, 33.0]], 
    "SGS": [[-59.5, -38.0], [-53.9, -26.0]],"SSD": [[3.5, 23.4], [12.2, 35.9]],     "ESP": [[36.0, -9.3], [43.8, 3.3]], 
    "LKA": [[5.9, 79.5], [9.9, 81.9]],      "SDN": [[9.3, 21.8], [22.0, 38.6]],     "SUR": [[1.8, -58.1], [6.0, -53.9]], 
    "SJM": [[74.0, 10.0], [81.0, 34.0]],    "SWE": [[55.3, 11.0], [69.1, 24.2]],    "CHE": [[45.8, 5.9], [47.8, 10.5]], 
    "SYR": [[32.3, 35.7], [37.4, 42.4]],    "TWN": [[21.8, 119.3], [25.5, 122.1]],  "TJK": [[36.6, 67.3], [41.1, 75.2]], 
    "TZA": [[-11.8, 29.3], [-1.0, 40.5]],   "THA": [[5.6, 97.3], [20.5, 105.7]],    "TLS": [[-9.6, 124.0], [-8.1, 127.4]], 
    "TGO": [[6.1, 0.1], [11.2, 1.7]],       "TKL": [[-9.4, -171.3], [-8.5, -171.1]],"TON": [[-21.6, -175.7], [-15.5, -173.6]], 
    "TTO": [[10.0, -62.0], [11.4, -60.5]],  "TUN": [[32.2, 7.5], [37.6, 11.6]],     "TUR": [[35.8, 25.6], [42.1, 44.8]], 
    "TKM": [[35.1, 52.4], [42.8, 66.6]],    "TCA": [[21.1, -72.5], [21.9, -71.1]],  "TUV": [[-10.8, 176.1], [-5.6, 179.9]], 
    "UGA": [[-1.5, 29.5], [4.3, 35.1]],     "UKR": [[44.3, 22.1], [52.4, 40.2]],    "ARE": [[22.5, 51.5], [26.1, 56.4]], 
    "GBR": [[49.8, -10.8], [60.9, 2.0]],    "USA": [[24.4, -124.8], [49.4, -66.9]], "UMI": [[-0.4, -160.0], [28.3, 166.7]], 
    "URY": [[-35.0, -58.5], [-30.1, -53.1]],"UZB": [[37.2, 56.0], [45.6, 73.2]],    "VUT": [[-20.3, 166.5], [-13.1, 170.3]], 
    "VEN": [[0.6, -73.4], [12.2, -59.8]],   "VNM": [[8.5, 102.1], [23.4, 109.5]],   "VGB": [[18.3, -64.8], [18.8, -64.2]], 
    "VIR": [[17.7, -65.1], [18.4, -64.5]],  "WLF": [[-14.3, -178.2], [-13.2, -176.1]],"ESH": [[21.3, -17.1], [27.7, -8.7]], 
    "YEM": [[12.1, 42.5], [19.0, 54.6]],    "ZMB": [[-18.1, 22.0], [-8.2, 33.7]],   "ZWE": [[-22.5, 25.2], [-15.6, 33.1]]
};

const iso2to3 = {
    "AF": "AFG", "AL": "ALB", "DZ": "DZA", "AS": "ASM", "AD": "AND", "AO": "AGO", "AI": "AIA", "AQ": "ATA", "AG": "ATG", 
    "AR": "ARG", "AM": "ARM", "AW": "ABW", "AU": "AUS", "AT": "AUT", "AZ": "AZE", "BS": "BHS", "BH": "BHR", "BD": "BGD", 
    "BB": "BRB", "BY": "BLR", "BE": "BEL", "BZ": "BLZ", "BJ": "BEN", "BM": "BMU", "BT": "BTN", "BO": "BOL", "BQ": "BES", 
    "BA": "BIH", "BW": "BWA", "BV": "BVT", "BR": "BRA", "IO": "IOT", "BN": "BRN", "BG": "BGR", "BF": "BFA", "BI": "BDI", 
    "KH": "KHM", "CM": "CMR", "CA": "CAN", "CV": "CPV", "KY": "CYM", "CF": "CAF", "TD": "TCD", "CL": "CHL", "CN": "CHN", 
    "CX": "CXR", "CC": "CCK", "CO": "COL", "KM": "COM", "CG": "COG", "CD": "COD", "CK": "COK", "CR": "CRI", "CI": "CIV", 
    "HR": "HRV", "CU": "CUB", "CW": "CUW", "CY": "CYP", "CZ": "CZE", "DK": "DNK", "DJ": "DJI", "DM": "DMA", "DO": "DOM", 
    "EC": "ECU", "EG": "EGY", "SV": "SLV", "GQ": "GNQ", "ER": "ERI", "EE": "EST", "ET": "ETH", "FK": "FLK", "FO": "FRO", 
    "FJ": "FJI", "FI": "FIN", "FR": "FRA", "GF": "GUF", "PF": "PYF", "TF": "ATF", "GA": "GAB", "GM": "GMB", "GE": "GEO", 
    "DE": "DEU", "GH": "GHA", "GI": "GIB", "GR": "GRC", "GL": "GRL", "GD": "GRD", "GP": "GLP", "GU": "GUM", "GT": "GTM", 
    "GG": "GGY", "GN": "GIN", "GW": "GNB", "GY": "GUY", "HT": "HTI", "HM": "HMD", "VA": "VAT", "HN": "HND", "HK": "HKG", 
    "HU": "HUN", "IS": "ISL", "IN": "IND", "ID": "IDN", "IR": "IRN", "IQ": "IRQ", "IE": "IRL", "IMN": "IMN", "IL": "ISR", 
    "IT": "ITA", "JAM": "JAM", "JP": "JPN", "JE": "JEY", "JO": "JOR", "KZ": "KAZ", "KE": "KEN", "KI": "KIR", "KP": "PRK", 
    "KR": "KOR", "KW": "KWT", "KG": "KGZ", "LA": "LAO", "LV": "LVA", "LB": "LBN", "LS": "LSO", "LR": "LBR", "LY": "LBY", 
    "LI": "LIE", "LT": "LTU", "LU": "LUX", "MO": "MAC", "MK": "MKD", "MDG": "MDG", "MW": "MWI", "MY": "MYS", "MV": "MDV", 
    "ML": "MLI", "MT": "MLT", "MH": "MHL", "MQ": "MTQ", "MR": "MRT", "MU": "MUS", "YT": "MYT", "MX": "MEX", "FM": "FSM", 
    "MD": "MDA", "MC": "MCO", "MN": "MNG", "ME": "MNE", "MS": "MSR", "MA": "MAR", "MZ": "MOZ", "MM": "MMR", "NA": "NAM", 
    "NR": "NRU", "NP": "NPL", "NL": "NLD", "NC": "NCL", "NZ": "NZL", "NI": "NIC", "NE": "NER", "NG": "NGA", "NU": "NIU", 
    "NF": "NFK", "MP": "MNP", "NO": "NOR", "OM": "OMN", "PK": "PAK", "PW": "PLW", "PS": "PSE", "PA": "PAN", "PG": "PNG", 
    "PY": "PRY", "PE": "PER", "PH": "PHL", "PN": "PCN", "PL": "POL", "PT": "PRT", "PR": "PRI", "QA": "QAT", "RE": "REU", 
    "RO": "ROU", "RU": "RUS", "RW": "RWA", "BL": "BLM", "SH": "SHN", "KN": "KNA", "LC": "LCA", "MF": "MAF", "PM": "SPM", 
    "VC": "VCT", "WS": "WSM", "SM": "SMR", "ST": "STP", "SA": "SAU", "SN": "SEN", "RS": "SRB", "SC": "SYC", "SL": "SLE", 
    "SG": "SGP", "SX": "SXM", "SK": "SVK", "SI": "SVN", "SB": "SLB", "SO": "SOM", "ZA": "ZAF", "GS": "SGS", "SS": "SSD", 
    "ES": "ESP", "LK": "LKA", "SD": "SDN", "SR": "SUR", "SJ": "SJM", "SZ": "SWZ", "SE": "SWE", "CH": "CHE", "SY": "SYR", 
    "TW": "TWN", "TJ": "TJK", "TZ": "TZA", "TH": "THA", "TL": "TLS", "TG": "TGO", "TK": "TKL", "TO": "TON", "TT": "TTO", 
    "TN": "TUN", "TR": "TUR", "TM": "TKM", "TC": "TCA", "TV": "TUV", "UG": "UGA", "UA": "UKR", "AE": "ARE", "GB": "GBR", 
    "US": "USA", "UM": "UMI", "UY": "URY", "UZ": "UZB", "VU": "VUT", "VE": "VEN", "VN": "VNM", "VG": "VGB", "VI": "VIR", 
    "WF": "WLF", "EH": "ESH", "YE": "YEM", "ZM": "ZMB", "ZW": "ZWE", "AX": "ALA"
};

// --- SECURITY UTILS ---
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') str = String(str);
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&',
        '<': '<',
        '>': '>',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}

function getCSRFToken() {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) return metaTag.getAttribute('content');
    return '';
}

// --- STATE VARIABLES ---
let allTransmitters = [];
let markerMap = new Map();
let activeMarker = null;
let currentPhotos = [];
let photoIndex = 0;

let receiverLocation = null;
let receiverMarker = null;
let activeLine = null;
let currentLineTargetId = null;
let lastFilteredCountry = "";
let isPicking = false;

const urlParamsAtLoad = new URLSearchParams(window.location.search);
const isUrlLocked = urlParamsAtLoad.has('lat') && urlParamsAtLoad.has('lng');

// --- MAP SETUP ---
const tileOptions = { maxZoom: 21, maxNativeZoom: 18 };

const osmStandard = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    maxNativeZoom: 19,
    attribution: '© OpenStreetMap contributors'
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', tileOptions);
const borders = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', tileOptions);
const hybrid = L.layerGroup([satellite, borders]);

const map = L.map('map', {
    zoomControl: false,
    layers: [osmStandard],
    maxZoom: 19
}).setView([51, 10], 5);

const getTxIcon = (isActive = false) => L.divIcon({
    className: 'tx-icon-container' + (isActive ? ' tx-active' : ''),
    html: `<div class="tx-icon-png"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const rxIcon = L.icon({
    iconUrl: '/img_assets/rx.png',
    iconSize: [34, 26],
    iconAnchor: [16, 25]
});

// --- FRONTEND FORM VALIDATION ---
const registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        const userInput = registerForm.querySelector('input[name="username"]').value.trim();
        const passInput = document.getElementById('reg-password').value;
        const errorBox = document.getElementById('register-error-msg');
        
        if (userInput.length < 3) {
            e.preventDefault(); 
            errorBox.textContent = "Username must be at least 3 characters.";
            errorBox.style.display = 'block';
        } else if (passInput.length < 8) {
            e.preventDefault(); 
            errorBox.textContent = "Password must be at least 8 characters.";
            errorBox.style.display = 'block';
        } else {
            errorBox.style.display = 'none';
        }
    });
}

// --- CORE FUNCTIONS ---
function switchLayer(type) {
    const isHybrid = type === 'hybrid';
    
    if (isHybrid) {
        map.addLayer(hybrid);
        map.removeLayer(osmStandard);
        document.body.classList.add('satellite-active');
    } else {
        map.addLayer(osmStandard);
        map.removeLayer(hybrid);
        document.body.classList.remove('satellite-active');
    }

    document.getElementById('btn-hybrid').classList.toggle('active', isHybrid);
    document.getElementById('btn-hybrid').classList.toggle('inactive', !isHybrid);
    document.getElementById('btn-light').classList.toggle('active', !isHybrid);
    document.getElementById('btn-light').classList.toggle('inactive', isHybrid);
    
    localStorage.setItem('mapLayer', type);
}

function highlightMarker(id) {
    if (activeMarker) {
        activeMarker.setIcon(getTxIcon(false));
    }
    const marker = markerMap.get(parseInt(id)); // Ensuring correct type mapping
    if (marker) {
        marker.setIcon(getTxIcon(true));
        marker.txId = id;
        activeMarker = marker;
    }
}

function toggleModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('open')) return;
    sidebar.classList.remove('open');
    markerMap.forEach(m => m.setIcon(getTxIcon(false)));
    activeMarker = null;
}

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
}

function updateGeometry() {
    if (!receiverLocation) return;
    
    if (activeLine && currentLineTargetId) {
        const target = allTransmitters.find(x => x.id == currentLineTargetId);
        if (target) {
            activeLine.setLatLngs(getGreatCirclePoints(receiverLocation, { lat: target.lat, lng: target.lng }));
        }
    }
    
    applyFilters(); 
    
    if (activeMarker) {
        const activeEntry = [...markerMap.entries()].find(([k, v]) => v === activeMarker);
        if (activeEntry) {
            openSidebarById(activeEntry[0]);
        }
    }
}

function getGreatCirclePoints(start, end, pointsCount = 100) {
    const deg2rad = Math.PI / 180;
    const rad2deg = 180 / Math.PI;
    
    const lat1 = start.lat * deg2rad;
    const lon1 = start.lng * deg2rad;
    const lat2 = end.lat * deg2rad;
    const lon2 = end.lng * deg2rad;
    
    const d = 2 * Math.asin(Math.sqrt(
        Math.pow(Math.sin((lat1 - lat2) / 2), 2) + 
        Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
    ));
    
    const path = [];
    for (let i = 0; i <= pointsCount; i++) {
        const f = i / pointsCount;
        const A = Math.sin((1 - f) * d) / Math.sin(d);
        const B = Math.sin(f * d) / Math.sin(d);
        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);
        
        const finalLat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * rad2deg;
        const finalLng = Math.atan2(y, x) * rad2deg;
        path.push([finalLat, finalLng]);
    }
    return path;
}

// --- AUTO-DETECT COUNTRY FROM COORDINATES ---
function autoDetectCountry(lat, lng) {
    const countrySelect = document.getElementById('transmitter-modal-country');
    if (!countrySelect || !lat || !lng) return;

    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' }
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.address && data.address.country_code) {
            const iso2 = data.address.country_code.toUpperCase();
            const iso3 = iso2to3[iso2];
            
            if (iso3) {
                countrySelect.value = iso3;
            }
        }
    })
    .catch(err => console.error('Geocoding error:', err));
}

function drawPath(targetId) {
    if (!receiverLocation) return;
    
    if (activeLine && String(currentLineTargetId) === String(targetId)) {
        map.removeLayer(activeLine);
        activeLine = null;
        currentLineTargetId = null;
        return;
    }
    
    if (activeLine) {
        map.removeLayer(activeLine);
    }
    
    const target = allTransmitters.find(x => String(x.id) === String(targetId));
    if (target) {
        currentLineTargetId = targetId;
        activeLine = L.polyline(getGreatCirclePoints(receiverLocation, { lat: target.lat, lng: target.lng }), {
            color: '#ff4242', 
            weight: 3, 
            dashArray: '10, 10', 
            opacity: 0.8
        }).addTo(map);
    }
}

// --- PHOTO / CAROUSEL ---
function populatePhotoDetails(p) {
    document.getElementById('viewerImg').src = 'transmitter_photos/' + escapeHTML(p.photo_filename);
    document.getElementById('viewerAuthor').textContent = p.author ? 'Uploaded by: ' + p.author : 'Unknown Author';
    
    let displayDate = '';
    if (p.photo_date) {
        const parts = p.photo_date.split('-');
        if (parts.length === 3) {
            displayDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        } else {
            displayDate = p.photo_date; 
        }
    }
    
    document.getElementById('viewerDate').textContent = displayDate;
    document.getElementById('viewerDesc').textContent = p.description || '';
}

function updateCarousel() {
    const p = currentPhotos[photoIndex];
    if (!p) return;
    
    document.getElementById('carouselImg').src = 'transmitter_photos/' + escapeHTML(p.photo_filename);
    const viewer = document.getElementById('photoViewer');
    
    if (viewer && viewer.style.display === 'flex') {
        populatePhotoDetails(p);
    }
}

function nextPhoto() { 
    if (currentPhotos.length > 1) { 
        photoIndex = (photoIndex + 1) % currentPhotos.length; 
        updateCarousel(); 
    } 
}

function prevPhoto() { 
    if (currentPhotos.length > 1) { 
        photoIndex = (photoIndex - 1 + currentPhotos.length) % currentPhotos.length; 
        updateCarousel(); 
    } 
}

function viewFull() {
    if (currentPhotos[photoIndex]) {
        populatePhotoDetails(currentPhotos[photoIndex]);
        const viewer = document.getElementById('photoViewer');
        viewer.style.display = 'flex';

        const arrows = viewer.querySelectorAll('.nav-arrow');
        arrows.forEach(arrow => {
            if (currentPhotos.length > 1) {
                arrow.style.display = 'flex';
            } else {
                arrow.style.display = 'none';
            }
        });
    }
}

// --- FILTERING & URL ---
function applyFilters(skipMove = false) {
    const filters = {
        tx: document.getElementById('tx-name').value.toLowerCase(),
        station: document.getElementById('station-name').value.toLowerCase(),
        freq: document.getElementById('station-frequency').value,
        power: parseFloat(document.getElementById('station-power').value) || 0,
        pi: document.getElementById('station-pi-code').value.toLowerCase(),
        country: document.getElementById('country').value
    };

    if (filters.country) {
        localStorage.setItem('userCountry', filters.country);
    }

    const params = new URLSearchParams(window.location.search);
    const newParams = new URLSearchParams();
    
    if (params.has('lat')) newParams.set('lat', params.get('lat'));
    if (params.has('lng')) newParams.set('lng', params.get('lng'));
    
    Object.entries(filters).forEach(([key, val]) => {
        if (val) newParams.set(key, val);
    });

    const newQueryString = newParams.toString() ? '?' + newParams.toString() : '';
    window.history.replaceState({}, '', window.location.pathname + newQueryString);

    if (!skipMove && filters.country && filters.country !== lastFilteredCountry && countryBounds[filters.country]) {
        lastFilteredCountry = filters.country;
        map.fitBounds(countryBounds[filters.country], { padding: [100, 100], animate: true });
    }

    markerMap.forEach(m => map.removeLayer(m));
    markerMap.clear();

    if (!filters.country) return;

    let visibleIds = new Set();

    allTransmitters.forEach(t => {
        if (filters.country && t.country !== filters.country) return;
        if (!t.name.toLowerCase().includes(filters.tx)) return;
        if (filters.station && !t.stations.some(s => s.station_name.toLowerCase().includes(filters.station))) return;
        
        const matchesAdvancedFilters = t.stations.some(s => {
            const matchFreq = filters.freq ? parseFloat(s.frequency) == filters.freq : true;
            const matchPower = filters.power ? parseFloat(s.power_kw) >= filters.power : true;
            const matchPi = filters.pi ? (s.pi_code || "").toLowerCase().includes(filters.pi) : true;
            return matchFreq && matchPower && matchPi;
        });

        if ((filters.freq || filters.power || filters.pi) && !matchesAdvancedFilters) return;

        visibleIds.add(t.id);
        const isActiveMarker = activeMarker && activeMarker.txId == t.id;
        const m = L.marker([t.lat, t.lng], { icon: getTxIcon(isActiveMarker) }).addTo(map);
        m.txId = t.id;
        
        m.on('mouseover', (e) => {
            const safeName = escapeHTML(t.name);
            const dist = receiverLocation ? `<div class="popup-distance">Distance: ${getDistance(receiverLocation.lat, receiverLocation.lng, t.lat, t.lng)} km</div>` : "";
            L.popup({ offset: [0, -20], closeButton: false })
                .setLatLng(e.latlng)
                .setContent(`<div class="popup-content"><div class="popup-title">${safeName}</div>${dist}</div>`)
                .openOn(map);
        });
        
        m.on('mouseout', () => map.closePopup());
        
        m.on('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (activeMarker && activeMarker.txId == t.id && sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebarById(t.id);
            }
        });
        
        m.on('contextmenu', (e) => { 
            L.DomEvent.stopPropagation(e); 
            drawPath(t.id); 
        });
        
        markerMap.set(t.id, m);
    });

    if (activeLine && !visibleIds.has(currentLineTargetId)) {
        map.removeLayer(activeLine);
        activeLine = null;
        currentLineTargetId = null;
    }
    
    if (activeMarker && !visibleIds.has(activeMarker.txId)) {
        closeSidebar();
    }
}

function resetFilters() {
    closeSidebar();
    
    ['tx-name', 'station-name', 'station-frequency', 'station-power', 'station-pi-code'].forEach(id => {
        document.getElementById(id).value = '';
    });
    
    document.getElementById('country').value = localStorage.getItem('userCountry') || '';
    lastFilteredCountry = "";
    applyFilters(true);
}

function filterByStationName(name) {
    document.getElementById('station-name').value = name;
    applyFilters();
}

function filterByStationPICode(code) {
    document.getElementById('station-pi-code').value = code;
    applyFilters();
}

// --- MODALS & SIDEBAR ---
function prepareAddModal() {
    document.getElementById('transmitter-modal-title').innerText = 'Add a transmitter';
    document.getElementById('transmitter-modal-action').value = 'add_transmitter';
    document.getElementById('transmitter-form').reset();
    
    const countrySelect = document.getElementById('transmitter-modal-country');
    if (countrySelect) countrySelect.value = ''; 
    
    toggleModal('transmitter-modal');
}

function openEditTransmitter(t) {
    document.getElementById('transmitter-modal-title').innerText = 'Edit Transmitter';
    document.getElementById('transmitter-modal-action').value = 'update_transmitter';
    document.getElementById('transmitter-modal-id').value = t.id;
    document.getElementById('transmitter-modal-name').value = t.name;
    document.getElementById('transmitter-modal-lat').value = parseFloat(t.lat).toFixed(6);
    document.getElementById('transmitter-modal-lng').value = parseFloat(t.lng).toFixed(6);
    document.getElementById('transmitter-modal-country').value = t.country || 'AUTO';
    
    toggleModal('transmitter-modal');
}

function startMapCoordinatesPicker() {
    closeSidebar(); 
    isPicking = true;
    toggleModal('transmitter-modal'); 
    document.body.classList.add('picking-mode');
}

// --- CANCEL PICKING MODE ---
function cancelPicking() {
    isPicking = false;
    document.body.classList.remove('picking-mode');
    toggleModal('transmitter-modal'); 
}

function openAddStation(tid) {
    resetStationValidation();
    document.getElementById('station-modal-title').innerText = 'Add station';
    document.getElementById('station-modal-action').value = 'add_station'; 
    document.getElementById('station-modal-transmitter-id').value = tid;
    
    ['station-modal-name', 'station-modal-frequency', 'station-modal-power', 'station-modal-pi-code'].forEach(id => {
        document.getElementById(id).value = '';
    });
    
    toggleModal('station-modal'); 
}

function openEditStation(s) {
    resetStationValidation();
    document.getElementById('station-modal-title').innerText = 'Modify station';
    document.getElementById('station-modal-action').value = 'update_station';
    
    document.getElementById('station-modal-id').value = s.id;
    // Add this new line so PHP knows which transmitter we return to:
    document.getElementById('station-modal-transmitter-id').value = activeMarker ? activeMarker.txId : '';

    document.getElementById('station-modal-name').value = s.station_name;
    document.getElementById('station-modal-frequency').value = parseFloat(s.frequency).toFixed(1);
    document.getElementById('station-modal-power').value = s.power_kw;
    document.getElementById('station-modal-polarization').value = s.polarization;
    document.getElementById('station-modal-pi-code').value = s.pi_code || '';
    
    validateStationField(document.getElementById('station-modal-frequency'), 'freq');
    validateStationField(document.getElementById('station-modal-power'), 'power');
    validateStationField(document.getElementById('station-modal-pi-code'), 'pi');
    
    toggleModal('station-modal');
}

// --- STATION MODAL VALIDATION ---
const stationInputs = {
    freq: document.getElementById('station-modal-frequency'),
    power: document.getElementById('station-modal-power'),
    pi: document.getElementById('station-modal-pi-code')
};

function openAddPhoto(tid) {
    document.getElementById('ph-modal-tid').value = tid;
    toggleModal('photoModal');
}

// --- MODAL DELETION LOGIC ---
let itemToDelete = { type: null, id: null };

function triggerDeleteModal(type, id) {
    itemToDelete = { type: type, id: id };
    
    if (type === 'transmitter') toggleModal('deleteTransmitterModal');
    if (type === 'station') toggleModal('deleteStationModal');
    if (type === 'photo') toggleModal('deletePhotoModal');
}

function deleteTransmitter(id) { triggerDeleteModal('transmitter', id); }
function deleteStation(id) { triggerDeleteModal('station', id); }

function deleteCurrentPhoto() {
    const photo = currentPhotos[photoIndex];
    if (!photo) return;
    triggerDeleteModal('photo', photo.id);
}

function executeDeletion() {
    if (itemToDelete.type && itemToDelete.id !== null) {
        deleteSecuredItem(itemToDelete.type, itemToDelete.id);
        itemToDelete = { type: null, id: null };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnTx = document.getElementById('confirmDeleteTransmitterBtn');
    const btnSt = document.getElementById('confirmDeleteStationBtn');
    const btnPh = document.getElementById('confirmDeletePhotoBtn');

    if (btnTx) btnTx.addEventListener('click', executeDeletion);
    if (btnSt) btnSt.addEventListener('click', executeDeletion);
    if (btnPh) btnPh.addEventListener('click', executeDeletion);
});

// --- SECURE AJAX POSTER ---
function deleteSecuredItem(type, id) {
    const formData = new URLSearchParams();
    formData.append('action', 'delete_item');
    formData.append('delete_type', type);
    formData.append('target_id', id);
    
    let token = getCSRFToken();
    if (!token && typeof CSRF_TOKEN !== 'undefined') {
        token = CSRF_TOKEN;
    }
    formData.append('csrf_token', token);

    fetch('/php/main.php', {
        method: 'POST',
        credentials: 'same-origin', 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Re-open sidebar if a station or photo is removed
            if ((type === 'station' || type === 'photo') && activeMarker) {
                const url = new URL(window.location.href);
                url.searchParams.set('open_tx', activeMarker.txId);
                window.location.href = url.toString();
            } else {
                window.location.reload();
            }
        } else {
            alert(data.error || 'Failed to delete. Please try again.');
        }
    })
    .catch(err => {
        console.error(err);
        alert('An error occurred during deletion.');
    });
}

window.handleLogoError = function(img, baseLogo) {
    if (!img.dataset.fallback) {
        img.dataset.fallback = 1;
        img.src = baseLogo + '.svg';
    } else if (img.dataset.fallback == 1) {
        img.dataset.fallback = 2;
        img.src = baseLogo + '.jpg';
    } else {
        img.style.opacity = 0.2;
        img.src = '/img_assets/default.png';
    }
};

function openSidebarById(id) {
    const d = allTransmitters.find(x => x.id == id);
    if (!d) return;
    
    highlightMarker(id);
    d.stations.sort((a, b) => parseFloat(a.frequency) - parseFloat(b.frequency));
    
    currentPhotos = d.photos || [];
    photoIndex = 0;
    
    const content = document.getElementById('sidebar-content');
    const distT = receiverLocation ? `<span class="tx-dist-badge">DISTANCE: ${getDistance(receiverLocation.lat, receiverLocation.lng, d.lat, d.lng)} KM</span>` : "";

    content.innerHTML = `
        <div class="tx-header-wrap">
            <h1 class="tx-title">${escapeHTML(d.name)}</h1>
            ${IS_STAFF ? `
            <div class="tx-actions">
                <button onclick='openEditTransmitter(${JSON.stringify(d).replace(/'/g, "&#39;")})' class="btn-action btn-edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-width="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                    </svg>
                </button>
                <button onclick="deleteTransmitter(${d.id})" class="btn-action btn-delete">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>` : ''}
        </div>
        <p class="tx-meta">
            <a href="https://maps.google.com/?q=${d.lat},${d.lng}" target="_blank" class="tx-coord-link">
                ${parseFloat(d.lat).toFixed(6)}, ${parseFloat(d.lng).toFixed(6)}
            </a>
            ${distT}
        </p>
        
        <div class="photo-section-wrapper">
            ${currentPhotos.length > 0 ? `
            <div class="stations-header">
                <span class="stations-title">Photos</span>
                <div class="stations-line"></div>
            </div>
            
            <div class="carousel-container group">
                ${IS_STAFF ? `
                <button onclick="deleteCurrentPhoto()" class="btn-action btn-delete" style="position:absolute;top:10px;right:10px;z-index:10;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>` : ''}
                
                ${currentPhotos.length > 1 ? `
                <button class="nav-btn btn-prev" onclick="prevPhoto()">❮</button>
                <button class="nav-btn btn-next" onclick="nextPhoto()">❯</button>
                ` : ''}
                <img id="carouselImg" src="transmitter_photos/${escapeHTML(currentPhotos[0].photo_filename)}" class="carousel-slide" onclick="viewFull()">
            </div>` : ''}
            
            ${IS_LOGGED_IN ? `<div onclick="openAddPhoto(${d.id})" class="btn-add-card">+ Add Photo</div>` : ''}
        </div>

        <div class="stations-list">
            ${d.stations && d.stations.length > 0 ? `
            <div class="stations-header">
                <span class="stations-title">Stations</span>
                <div class="stations-line"></div>
            </div>
            ` : ''}
            ${d.stations.map(s => {
                const safeStationName = escapeHTML(s.station_name);
                const safePi = escapeHTML(s.pi_code || '----');
                const safePol = escapeHTML(s.polarization);
                const safePwr = escapeHTML(s.power_kw);
                const baseLogo = (s.pi_code && d.country) ? `https://tef.noobish.eu/logos/${d.country.toUpperCase()}/${escapeHTML(s.pi_code).toUpperCase()}` : null;
                
                return `
                <div class="station-card group">
                    ${IS_STAFF ? `
                    <div class="station-actions">
                        <button onclick='openEditStation(${JSON.stringify(s).replace(/'/g, "&#39;")})' class="btn-action btn-edit">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-width="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                            </svg>
                        </button>
                        <button onclick="deleteStation(${s.id})" class="btn-action btn-delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-width="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>` : ''}
                    
                    <div class="station-logo-wrap">
                        <img src="${baseLogo ? baseLogo + '.png' : '/img_assets/default.png'}" onerror="handleLogoError(this, '${baseLogo}')">
                    </div>
                    
                    <div class="station-name-wrap">
                        <button onclick="filterByStationName('${safeStationName.replace(/'/g, "\\'")}')" class="station-name-btn">${safeStationName}</button>
                    </div>
                    
                    <div class="station-pi">
                        <button onclick="filterByStationPICode('${safePi.replace(/'/g, "\\'")}')" class="station-pi-btn">${safePi}</button>
                    </div>

                    <div class="station-details">
                        <div class="station-detail-item">${safePol} pol.</div>
                        <div class="station-detail-item">${safePwr} kW</div>
                    </div>
                    
                    <div class="station-freq-wrap">
                        <div class="frequency-unit">
                            <span class="station-freq">${parseFloat(s.frequency).toFixed(1)}</span>
                            <span class="station-unit">MHz</span>
                        </div>
                    </div>
                </div>`;
            }).join('')}
            
            ${IS_STAFF ? `<div onclick="openAddStation(${d.id})" class="btn-add-card lg">+ Add Station</div>` : ''}
        </div>`;
        
    document.getElementById('sidebar').classList.add('open');
}

function validateStationField(el, type) {
    if (!el) return;
    const val = el.value.trim();
    let isValid = true;

    if (val === "") {
        isValid = false;
    } else {
        switch (type) {
            case 'freq':
                const f = parseFloat(val);
                isValid = !isNaN(f) && /^\d+(\.\d+)?$/.test(val) && f >= 87.5 && f <= 108.0;
                break;
            case 'power':
                isValid = /^\d+(\.\d+)?$/.test(val);
                break;
            case 'pi':
                isValid = /^[0-9A-F]{4}$/i.test(val);
                break;
        }
    }
    el.style.borderColor = isValid ? "" : "#ff4242";
}

function resetStationValidation() {
    Object.values(stationInputs).forEach(el => {
        if (el) {
            el.style.borderColor = "";
            el.style.boxShadow = "";
        }
    });
}

/* =========================================================
   MOBILE UI AUTO-HIDE ON INTERACTION
   ========================================================= */
const uiElements = ['.main-nav', '.filter-panel', '.layer-box'];

function toggleMobileUI(hide) {
    if (window.innerWidth <= 768) {
        uiElements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                if (hide) {
                    el.classList.add('nav-hidden');
                } else {
                    el.classList.remove('nav-hidden');
                }
            }
        });
    }
}

// Map start/stop events for both moving and zooming
map.on('movestart zoomstart', () => toggleMobileUI(true));
map.on('moveend zoomend', () => toggleMobileUI(false));

map.on('click', (e) => {
    if (document.getElementById('sidebar').classList.contains('open')) {
        closeSidebar();
    }
    
    if (isPicking) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        
        document.getElementById('transmitter-modal-lat').value = lat;
        document.getElementById('transmitter-modal-lng').value = lng;
        
        isPicking = false;
        document.body.classList.remove('picking-mode');
        toggleModal('transmitter-modal');
        
        autoDetectCountry(lat, lng);
    }
});

map.on('contextmenu', (e) => {
    if (isUrlLocked) return;
    
    if (receiverMarker) {
        map.removeLayer(receiverMarker);
    }
    
    receiverLocation = e.latlng;
    localStorage.setItem('rx_lat', e.latlng.lat.toFixed(6));
    localStorage.setItem('rx_lng', e.latlng.lng.toFixed(6));
    
    receiverMarker = L.marker(receiverLocation, { draggable: true, icon: rxIcon }).addTo(map);
    receiverMarker.on('drag', (ev) => {
        receiverLocation = ev.latlng;
        updateGeometry();
    });
    
    updateGeometry();
});

map.on('zoomstart', () => {
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.main-nav');
        const filters = document.querySelector('.filter-panel');
        if (nav) nav.classList.add('nav-hidden');
        if (filters) filters.classList.add('nav-hidden');
    }
});

map.on('zoomend', () => {
    if (window.innerWidth <= 768) {
        const nav = document.querySelector('.main-nav');
        const filters = document.querySelector('.filter-panel');
        if (nav) nav.classList.remove('nav-hidden');
        if (filters) filters.classList.remove('nav-hidden');
    }
});

// --- UI LISTENERS ---
['tx-name', 'station-name', 'station-frequency', 'station-power', 'station-pi-code', 'country'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => applyFilters());
});

// --- REAL-TIME AUTO-DETECT WITH DEBOUNCE ---
let autoDetectTimeout;
['transmitter-modal-lat', 'transmitter-modal-lng'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => {
            clearTimeout(autoDetectTimeout);
            
            const lat = document.getElementById('transmitter-modal-lat').value;
            const lng = document.getElementById('transmitter-modal-lng').value;
            
            if (lat && lng) {
                autoDetectTimeout = setTimeout(() => {
                    autoDetectCountry(lat, lng);
                }, 800);
            }
        });
    }
});

Object.keys(stationInputs).forEach(key => {
    const el = stationInputs[key];
    if (el) {
        el.addEventListener('input', () => validateStationField(el, key));
    }
});

const adminSearch = document.getElementById('admin-user-search');
if (adminSearch) {
    adminSearch.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        document.querySelectorAll('.admin-user-row').forEach(row => {
            row.style.display = row.getAttribute('data-search').includes(val) ? 'flex' : 'none';
        });
    });
}

fetch('/php/api_get_transmitters.php')
    .then(res => res.json())
    .then(data => {
        allTransmitters = data;
        
        const urlParams = new URLSearchParams(window.location.search);
        const countryDropdown = document.getElementById('country');
        
        // 1. Sync UI Filters from URL Parameters
        const filterMap = {
            'tx': 'tx-name',
            'station': 'station-name',
            'freq': 'station-frequency',
            'power': 'station-power',
            'pi': 'station-pi-code',
            'country': 'country'
        };

        Object.entries(filterMap).forEach(([param, id]) => {
            const val = urlParams.get(param);
            const el = document.getElementById(id);
            if (val && el) el.value = val;
        });

        // 2. Map Layer & Receiver Location Setup
        if (localStorage.getItem('mapLayer')) {
            switchLayer(localStorage.getItem('mapLayer'));
        }

        const uLat = urlParams.get('lat'), uLng = urlParams.get('lng');
        const sLat = localStorage.getItem('rx_lat'), sLng = localStorage.getItem('rx_lng');
        
        if (uLat && uLng) {
            receiverLocation = L.latLng(uLat, uLng);
        } else if (sLat && sLng) {
            receiverLocation = L.latLng(sLat, sLng);
        }

        if (receiverLocation) {
            receiverMarker = L.marker(receiverLocation, { 
                draggable: !isUrlLocked, 
                icon: rxIcon 
            }).addTo(map);
            
            receiverMarker.on('drag', (ev) => {
                receiverLocation = ev.latlng;
                localStorage.setItem('rx_lat', ev.latlng.lat.toFixed(6));
                localStorage.setItem('rx_lng', ev.latlng.lng.toFixed(6));
                updateGeometry();
            });
        }

        // 3. Optimized Country Detection Flow
        const urlCountry = urlParams.get('country');
        const storedCountry = localStorage.getItem('userCountry');
        const txToOpen = urlParams.get('open_tx'); // Check for our new flag

        // Helper function to finish setup and pop open the sidebar
        const finishInit = () => {
            applyFilters();
            if (txToOpen) {
                setTimeout(() => openSidebarById(txToOpen), 200);
            }
        };

        if (urlCountry) {
            // Priority 1: URL manually set
            finishInit();
        } else if (storedCountry && storedCountry !== "undefined" && storedCountry !== "") {
            // Priority 2: Remembered from previous session
            countryDropdown.value = storedCountry;
            finishInit();
        } else {
            // Priority 3: Initial load / No memory - Use PHP Proxy
            fetch('/php/api_get_country.php')
                .then(res => res.json())
                .then(d => {
                    if (d && d.country) {
                        const iso3 = iso2to3[d.country.toUpperCase()];
                        if (iso3) {
                            localStorage.setItem('userCountry', iso3);
                            countryDropdown.value = iso3;
                        }
                    }
                    finishInit();
                })
                .catch(() => finishInit()); // Fallback to show map even if API fails
        }
    });

// --- UI Listeners & Collapsible Logic ---
function toggleFilters() {
    const content = document.getElementById('filter-content');
    const header = document.getElementById('filter-header');
    if (content && header) {
        content.classList.toggle('is-collapsed');
        header.classList.toggle('is-collapsed');
    }
}

/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        
        // 1. Close Photo Viewer if open (highest z-index)
        const viewer = document.getElementById('photoViewer');
        if (viewer && viewer.style.display === 'flex') {
            viewer.style.display = 'none';
            return; // Stop here so we don't accidentally close the modal underneath it too
        }

        // 2. Close any open modals
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });

        // 3. Close Sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar(); // Call the function so it also clears marker highlights
        }

        // 4. Cancel Coordinate Picking Mode if active
        if (typeof isPicking !== 'undefined' && isPicking) {
            cancelPicking();
        }
    }
});

// Map auth errors generated from the patched login_register.php logic directly into HTML containers
if (typeof AUTH_ERROR !== 'undefined' && AUTH_ERROR !== "") {
    let targetModal = (AUTH_ERROR === "AUTH_ERR" || AUTH_ERROR === "TOO_MANY_ATTEMPTS") ? 'loginModal' : 'registerModal';
    
    // Check if error is related to stations instead (added to keep consistent behavior)
    if (AUTH_ERROR === "invalid_station" || AUTH_ERROR === "invalid_data" || AUTH_ERROR === "invalid_date" || AUTH_ERROR === "file_too_large") {
       alert("An error occurred with your submission: " + AUTH_ERROR);
    } else {
        const modal = document.getElementById(targetModal);
        if (modal) modal.classList.add('active');
    
        const loginErrorBox = document.getElementById('login-error-msg');
        const registerErrorBox = document.getElementById('register-error-msg');
    
        if (AUTH_ERROR === "AUTH_ERR" && loginErrorBox) {
            loginErrorBox.textContent = "Invalid username or password.";
            loginErrorBox.style.display = 'block';
        } 
        else if (AUTH_ERROR === "TOO_MANY_ATTEMPTS" && loginErrorBox) {
            let secondsLeft = COOLDOWN_SECONDS;
            loginErrorBox.style.display = 'block';
    
            const updateTimer = () => {
                const mins = Math.floor(secondsLeft / 60);
                const secs = secondsLeft % 60;
                loginErrorBox.innerHTML = `Please wait <strong>${mins}:${secs < 10 ? '0' : ''}${secs}</strong> before trying again.`;
                if (secondsLeft <= 0) {
                    loginErrorBox.textContent = "Cooldown finished. You can try again.";
                    clearInterval(timerInterval);
                }
                secondsLeft--;
            };
            updateTimer();
            const timerInterval = setInterval(updateTimer, 1000);
        }
        else if (registerErrorBox) {
            const msgs = {
                "PASS_TOO_SHORT": "Password must be at least 8 characters.",
                "USER_EXISTS": "Username already taken.",
                "EMPTY_FIELDS": "Please fill in all fields.",
                "INVALID_USER_LENGTH": "Username must be 3-30 characters."
            };
            registerErrorBox.textContent = msgs[AUTH_ERROR] || "An error occurred.";
            registerErrorBox.style.display = 'block';
        }
    }
}