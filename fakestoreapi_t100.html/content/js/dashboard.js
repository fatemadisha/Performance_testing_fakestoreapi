/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5475862068965517, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9905, 500, 1500, "Update a product -PUT"], "isController": false}, {"data": [0.9895, 500, 1500, "Add a new cart - POST"], "isController": false}, {"data": [0.279, 500, 1500, "Get all carts - GET"], "isController": false}, {"data": [0.797, 500, 1500, "Get all products - GET"], "isController": false}, {"data": [0.991, 500, 1500, "Get all categories - GET"], "isController": false}, {"data": [0.2975, 500, 1500, "User login - POST"], "isController": false}, {"data": [0.187, 500, 1500, "Delete a user - DELETE"], "isController": false}, {"data": [0.1825, 500, 1500, "Get all users - GET"], "isController": false}, {"data": [0.989, 500, 1500, "Update a users - PATCH"], "isController": false}, {"data": [0.377, 500, 1500, "Delete a product -DELETE"], "isController": false}, {"data": [0.166, 500, 1500, "Limit results -GET"], "isController": false}, {"data": [0.982, 500, 1500, "Get a single product - GET"], "isController": false}, {"data": [0.0975, 500, 1500, "Add a new user - POST"], "isController": false}, {"data": [0.1505, 500, 1500, "Get a single user -GET"], "isController": false}, {"data": [0.9895, 500, 1500, "Update a users - PUT"], "isController": false}, {"data": [0.217, 500, 1500, "Get user carts - GET"], "isController": false}, {"data": [0.156, 500, 1500, "Get carts in a date range - GET"], "isController": false}, {"data": [0.425, 500, 1500, "Get products in a specific category -GET"], "isController": false}, {"data": [0.47125, 500, 1500, "Sort results -GET"], "isController": false}, {"data": [0.9925, 500, 1500, "Add new product - POST"], "isController": false}, {"data": [0.987, 500, 1500, "Update a cart - PATCH"], "isController": false}, {"data": [0.1505, 500, 1500, "Sort results - GET"], "isController": false}, {"data": [0.2025, 500, 1500, "Get a single cart - GET"], "isController": false}, {"data": [0.55325, 500, 1500, "Limit results - GET"], "isController": false}, {"data": [0.2555, 500, 1500, "Delete a cart - DELETE"], "isController": false}, {"data": [0.987, 500, 1500, "Update a cart - PUT"], "isController": false}, {"data": [0.9925, 500, 1500, "Update a product - PATCH"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29000, 0, 0.0, 983.6992413793106, 307, 12098, 1143.0, 1674.0, 1747.0, 1975.9900000000016, 99.70055454136026, 198.0171964923884, 24.50882435856445], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update a product -PUT", 1000, 0, 0.0, 331.22599999999943, 309, 1191, 323.0, 340.0, 351.94999999999993, 553.97, 3.7261155990103436, 2.9404655804729187, 1.2990461609830986], "isController": false}, {"data": ["Add a new cart - POST", 1000, 0, 0.0, 334.1120000000001, 308, 1173, 325.0, 341.0, 351.94999999999993, 586.8600000000001, 3.711401425178147, 2.8532413292384207, 1.533127737158551], "isController": false}, {"data": ["Get all carts - GET", 1000, 0, 0.0, 1395.676000000001, 488, 2259, 1451.5, 1687.9, 1744.9499999999998, 1876.94, 3.6975684789682304, 5.825230266077028, 0.4477524330000592], "isController": false}, {"data": ["Get all products - GET", 1000, 0, 0.0, 553.5649999999994, 313, 3906, 334.0, 1088.8, 1801.8999999999999, 2318.9700000000003, 3.726990492447254, 41.12881777765148, 0.4622341724031262], "isController": false}, {"data": ["Get all categories - GET", 1000, 0, 0.0, 332.21200000000005, 308, 1363, 324.0, 339.9, 352.94999999999993, 556.99, 3.7424169277002477, 2.694306286886197, 0.5043491562721036], "isController": false}, {"data": ["User login - POST", 1000, 0, 0.0, 1413.8559999999986, 477, 2517, 1442.0, 1811.8, 1957.9499999999998, 2118.78, 3.7744252493951485, 3.0521462207623586, 0.9362343880335623], "isController": false}, {"data": ["Delete a user - DELETE", 1000, 0, 0.0, 1548.115000000001, 480, 2381, 1583.0, 1888.8999999999996, 2035.7999999999997, 2123.94, 3.752190341111624, 3.5807548164053262, 0.7768206565582658], "isController": false}, {"data": ["Get all users - GET", 1000, 0, 0.0, 1552.1410000000014, 984, 3416, 1554.5, 1768.0, 1843.0, 2349.51, 3.6994424940161514, 13.252270070400392, 0.44797936450976844], "isController": false}, {"data": ["Update a users - PATCH", 1000, 0, 0.0, 336.57200000000034, 307, 2030, 324.0, 338.0, 348.94999999999993, 838.97, 3.7548108514033607, 3.491299399230264, 2.3540903970712477], "isController": false}, {"data": ["Delete a product -DELETE", 1000, 0, 0.0, 1265.2479999999996, 481, 2196, 1267.0, 1648.9, 1741.85, 1922.88, 3.708277245639993, 3.904424832293162, 0.7785933670044908], "isController": false}, {"data": ["Limit results -GET", 1000, 0, 0.0, 1504.466999999998, 579, 2382, 1600.0, 1710.9, 1742.9499999999998, 1985.8400000000001, 3.678039163761016, 4.93291141626576, 0.4741222359535684], "isController": false}, {"data": ["Get a single product - GET", 1000, 0, 0.0, 336.7699999999997, 308, 1106, 324.0, 342.9, 365.94999999999993, 583.99, 3.741338800676434, 3.939739366647461, 0.47132100125708987], "isController": false}, {"data": ["Add a new user - POST", 1000, 0, 0.0, 1669.0209999999995, 484, 2315, 1692.0, 2001.8, 2085.85, 2145.98, 3.7364041593651103, 2.489156692413605, 2.331603767416314], "isController": false}, {"data": ["Get a single user -GET", 1000, 0, 0.0, 1564.0339999999992, 907, 2415, 1582.5, 1768.0, 1797.9499999999998, 1965.3200000000006, 3.7025380898605995, 3.4908570450043506, 0.455585741525816], "isController": false}, {"data": ["Update a users - PUT", 1000, 0, 0.0, 335.1140000000001, 309, 1396, 324.0, 338.9, 349.94999999999993, 839.9300000000001, 3.7550223423829374, 3.4925301457887423, 2.3468889639893358], "isController": false}, {"data": ["Get user carts - GET", 1000, 0, 0.0, 1493.7279999999985, 893, 2484, 1530.5, 1707.9, 1747.0, 1861.99, 3.693225885081583, 2.922250554907189, 0.4724732333453978], "isController": false}, {"data": ["Get carts in a date range - GET", 1000, 0, 0.0, 1520.6709999999982, 803, 2290, 1596.0, 1708.8, 1764.9499999999998, 1906.5300000000004, 3.6852501547805065, 5.805938872755683, 0.5902158451015656], "isController": false}, {"data": ["Get products in a specific category -GET", 1000, 0, 0.0, 1160.1340000000014, 475, 2980, 1156.0, 1664.9, 1766.8999999999999, 2025.92, 3.7246028642196025, 8.053522543158834, 0.527409585265471], "isController": false}, {"data": ["Sort results -GET", 2000, 0, 0.0, 1060.4790000000046, 313, 12098, 1084.0, 1841.9, 1959.8999999999996, 2180.94, 6.968811085984675, 50.9342099589537, 0.9221424825692612], "isController": false}, {"data": ["Add new product - POST", 1000, 0, 0.0, 334.59099999999984, 308, 1198, 323.0, 345.9, 358.94999999999993, 553.99, 3.7265460507928223, 2.955005450073599, 1.3064746408541241], "isController": false}, {"data": ["Update a cart - PATCH", 1000, 0, 0.0, 337.56299999999993, 308, 2675, 324.0, 338.0, 346.0, 836.6300000000003, 3.7117182657367573, 2.8506358753345187, 1.5441327941443934], "isController": false}, {"data": ["Sort results - GET", 1000, 0, 0.0, 1524.201, 719, 2209, 1611.0, 1727.8, 1783.8999999999999, 2024.0, 3.68088223385381, 5.79925871632913, 0.48167794857071344], "isController": false}, {"data": ["Get a single cart - GET", 1000, 0, 0.0, 1475.8950000000011, 530, 2386, 1562.0, 1706.0, 1741.0, 2055.86, 3.6834040546911835, 2.9065870890241925, 0.4532313582920792], "isController": false}, {"data": ["Limit results - GET", 2000, 0, 0.0, 977.1775, 310, 4982, 1019.0, 1750.9, 1821.0, 1996.99, 6.990074094785405, 17.56996763814134, 0.9113036051307144], "isController": false}, {"data": ["Delete a cart - DELETE", 1000, 0, 0.0, 1465.9260000000006, 981, 2180, 1498.0, 1673.9, 1722.0, 1875.8400000000001, 3.6982522060074405, 2.9260181403893517, 0.7656537770249779], "isController": false}, {"data": ["Update a cart - PUT", 1000, 0, 0.0, 334.8109999999991, 309, 1327, 324.0, 338.0, 350.94999999999993, 561.97, 3.7116356064627, 2.8492892681768076, 1.5368491183009616], "isController": false}, {"data": ["Update a product - PATCH", 1000, 0, 0.0, 332.3160000000003, 308, 1353, 323.0, 339.0, 350.94999999999993, 555.94, 3.726143367092192, 2.9410042049527894, 1.3063334656114227], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
