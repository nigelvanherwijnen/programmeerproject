# Nigel van Herwijnen
# UvA ID: 10330879
#
# Course: Programmeerproject
# Filename: convertCSV2JSON.py

import csv
import json
import os
import codecs

data_name = dict()
data_total = dict()
data_hydro = dict()
data_fossil = dict()
data_renewable = dict()
data_nuclear = dict()
data_final = dict()

data_ghg = dict()
data_population = dict()
c_codes = dict()

with open("../data_raw/country_codes.csv", "rU") as csv_file:
    rows = csv.DictReader(csv_file, delimiter = ";")
    for row in rows:
        c_codes[row["Name"]] = row["Code"]




# Open file to read and to write
with open("../data_raw/2_GHG_per_capita/GHG_total.csv", "rU") as csv_file1:
    with open("../data_raw/2_GHG_per_capita/Population.csv", "rU") as csv_file2:
        with open("../project/data/data.json", "w+") as json_file:

            # Prepare holders for data
            rows1 = csv.DictReader(csv_file1, delimiter = ";")
            for row in rows1:
                data_ghg[row["Country"]] = dict()

            rows2 = csv.DictReader(csv_file2, delimiter = ";")
            for row in rows2:
                data_population[row["Country"]] = dict()

            # Return readers to start of file
            csv_file1.seek(18)
            csv_file2.seek(23)

            # Save population per country
            for row in rows2:
                data_population[row["Country"]][row["Year"]] = row["Population"]

            # Calculate and save GHG per capita
            for row in rows1:
                if row["Total"] != "" and data_population[row["Country"]][row["Year"]] != "":
                    data_ghg[row["Country"]][row["Year"]] = int(row["Total"]) / int(data_population[row["Country"]][row["Year"]])
                else:
                    data_ghg[row["Country"]][row["Year"]] = ""



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
                    "ghg": value[str(i)]
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
