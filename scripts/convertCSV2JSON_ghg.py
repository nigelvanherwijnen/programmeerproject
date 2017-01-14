# Nigel van Herwijnen
# UvA ID: 10330879
#
# Course: Programmeerproject
# Filename: convertCSV2JSON_ghg.py

import csv
import json
import os
import codecs

c_codes = dict()
data_ghg = dict()

data_co2 = dict()
data_ch4 = dict()
data_n2o = dict()
data_other = dict()

data_energy = dict()
data_industrial = dict()
data_agriculture = dict()
data_waste = dict()
data_land = dict()
data_fuel = dict()

# Load country codes
with open("../data_raw/country_codes.csv", "rU") as csv_file:
    rows = csv.DictReader(csv_file, delimiter = ";")
    for row in rows:
        c_codes[row["Name"]] = row["Code"]

# Load data for datamap
with open("../data_raw/2_GHG_per_capita/ghg_per_capita.csv", "rU") as csv_file1:
    rows = csv.DictReader(csv_file1, delimiter = ",")
    for row in rows:
        data_ghg[row["Country"]] = dict()

    csv_file1.seek(18)

    for row in rows:
        if row["Total"] != "":
            data_ghg[row["Country"]][int(row["Year"])] = float(row["Total"])
        else:
            data_ghg[row["Country"]][int(row["Year"])] = 0

# Load data for pie chart and line graph
with open("../data_raw/4_Emission_by_gas/ghg_emission.csv", "rU") as csv_file1:
    rows = csv.DictReader(csv_file1, delimiter = ",")
    for row in rows:
        data_co2[row["Country"]] = dict()
        data_ch4[row["Country"]] = dict()
        data_n2o[row["Country"]] = dict()
        data_other[row["Country"]] = dict()
        data_energy[row["Country"]] = dict()
        data_industrial[row["Country"]] = dict()
        data_agriculture[row["Country"]] = dict()
        data_waste[row["Country"]] = dict()
        data_land[row["Country"]] = dict()
        data_fuel[row["Country"]] = dict()

    csv_file1.seek(728)
    for row in rows:

        if row["Total CO2 (including Land-Use Change and Forestry) (MtCO2)"] != "":
            data_co2[row["Country"]][int(row["Year"])] = float(row["Total CO2 (including Land-Use Change and Forestry) (MtCO2)"])
        else:
            data_co2[row["Country"]][int(row["Year"])] = 0

        if row["Total CH4 (including Land-Use Change and Forestry) (MtCO2e)"] != "":
            data_ch4[row["Country"]][int(row["Year"])] = float(row["Total CH4 (including Land-Use Change and Forestry) (MtCO2e)"])
        else:
            data_ch4[row["Country"]][int(row["Year"])] = 0

        if row["Total N2O (including Land-Use Change and Forestry) (MtCO2e)"] != "":
            data_n2o[row["Country"]][int(row["Year"])] = float(row["Total N2O (including Land-Use Change and Forestry) (MtCO2e)"])
        else:
            data_n2o[row["Country"]][int(row["Year"])] = 0

        if row["Total GHG Emissions Including Land-Use Change and Forestry (MtCO?e?)"] != "":
            data_other[row["Country"]][int(row["Year"])] = float(row["Total GHG Emissions Including Land-Use Change and Forestry (MtCO?e?)"]) - \
                                data_n2o[row["Country"]][int(row["Year"])] - \
                                data_ch4[row["Country"]][int(row["Year"])] - \
                                data_co2[row["Country"]][int(row["Year"])]
        else:
            data_other[row["Country"]][int(row["Year"])] = 0



        if row["Energy (MtCO2e)"] != "":
            data_energy[row["Country"]][int(row["Year"])] = float(row["Energy (MtCO2e)"])
        else:
            data_energy[row["Country"]][int(row["Year"])] = 0

        if row["Industrial Processes (MtCO2e)"] != "":
            data_industrial[row["Country"]][int(row["Year"])] = float(row["Industrial Processes (MtCO2e)"])
        else:
            data_industrial[row["Country"]][int(row["Year"])] = 0

        if row["Agriculture (MtCO2e)"] != "":
            data_agriculture[row["Country"]][int(row["Year"])] = float(row["Agriculture (MtCO2e)"])
        else:
            data_agriculture[row["Country"]][int(row["Year"])] = 0

        if row["Waste (MtCO2e)"] != "":
            data_waste[row["Country"]][int(row["Year"])] = float(row["Waste (MtCO2e)"])
        else:
            data_waste[row["Country"]][int(row["Year"])] = 0

        if row["Land-Use Change and Forestry (MtCO2)"] != "":
            data_land[row["Country"]][int(row["Year"])] = float(row["Land-Use Change and Forestry (MtCO2)"])
        else:
            data_land[row["Country"]][int(row["Year"])] = 0

        if row["Bunker Fuels (MtCO2)"] != "":
            data_fuel[row["Country"]][int(row["Year"])] = float(row["Bunker Fuels (MtCO2)"])
        else:
            data_fuel[row["Country"]][int(row["Year"])] = 0







# Write data to json
with open("../project/data/data_ghg.json", "w+") as json_file:

    # Write to JSON
    json_file.write('{')
    for i in range(1990, 2013, 1):
        # Write opening line of first entry
        json_file.write('"' + str(i) + '": [\n')

        for name, value in data_ghg.iteritems():
            # print name, value
            holder = dict()
            holder = {
            "name": name, \
            "code": c_codes[name], \
            "ghg": value[i], \
            "co2": data_co2[name][i], \
            "n2o": data_n2o[name][i], \
            "ch4": data_ch4[name][i], \
            "other": data_other[name][i], \
            "energy": data_energy[name][i], \
            "industrial": data_industrial[name][i], \
            "agriculture": data_agriculture[name][i], \
            "waste": data_waste[name][i], \
            "land": data_land[name][i], \
            "fuel": data_fuel[name][i]
            }
            # print holder
            json.dump(holder, json_file)
            json_file.write(",\n")

        json_file.seek(-2, os.SEEK_END)
        json_file.truncate()

        # Write ending line
        json_file.write("],\n")

    json_file.seek(-2, os.SEEK_END)
    json_file.truncate()
    json_file.write("}")
