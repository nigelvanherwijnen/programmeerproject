# Nigel van Herwijnen
# UvA ID: 10330879
#
# Course: Programmeerproject
# Filename: convertCSV2JSON.py

import csv
import json
import os
import codecs

data_ghg = dict()
c_codes = dict()

with open("../data_raw/country_codes.csv", "rU") as csv_file:
    rows = csv.DictReader(csv_file, delimiter = ";")
    for row in rows:
        c_codes[row["Name"]] = row["Code"]


with open("../data_raw/2_GHG_per_capita/ghg_per_capita.csv", "rU") as csv_file1:
    with open("../project/data/data.json", "w+") as json_file:

        rows = csv.DictReader(csv_file1, delimiter = ",")
        for row in rows:
            data_ghg[row["Country"]] = dict()

        csv_file1.seek(18)

        for row in rows:
            if row["Total"] != "":
                data_ghg[row["Country"]][int(row["Year"])] = float(row["Total"])
            else:
                data_ghg[row["Country"]][int(row["Year"])] = 0

        for key, value in data_ghg.iteritems():
            print key, value, "\n"

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
                "ghg": value[i]
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
