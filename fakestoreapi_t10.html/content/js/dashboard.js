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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8979310344827586, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "Update a product -PUT"], "isController": false}, {"data": [0.99, 500, 1500, "Add a new cart - POST"], "isController": false}, {"data": [0.85, 500, 1500, "Get all carts - GET"], "isController": false}, {"data": [0.74, 500, 1500, "Get all products - GET"], "isController": false}, {"data": [0.995, 500, 1500, "Get all categories - GET"], "isController": false}, {"data": [0.82, 500, 1500, "User login - POST"], "isController": false}, {"data": [0.865, 500, 1500, "Delete a user - DELETE"], "isController": false}, {"data": [0.8, 500, 1500, "Get all users - GET"], "isController": false}, {"data": [0.99, 500, 1500, "Update a users - PATCH"], "isController": false}, {"data": [0.865, 500, 1500, "Delete a product -DELETE"], "isController": false}, {"data": [0.81, 500, 1500, "Limit results -GET"], "isController": false}, {"data": [0.985, 500, 1500, "Get a single product - GET"], "isController": false}, {"data": [0.875, 500, 1500, "Add a new user - POST"], "isController": false}, {"data": [0.845, 500, 1500, "Get a single user -GET"], "isController": false}, {"data": [1.0, 500, 1500, "Update a users - PUT"], "isController": false}, {"data": [0.87, 500, 1500, "Get user carts - GET"], "isController": false}, {"data": [0.835, 500, 1500, "Get carts in a date range - GET"], "isController": false}, {"data": [0.855, 500, 1500, "Get products in a specific category -GET"], "isController": false}, {"data": [0.82, 500, 1500, "Sort results -GET"], "isController": false}, {"data": [0.99, 500, 1500, "Add new product - POST"], "isController": false}, {"data": [0.995, 500, 1500, "Update a cart - PATCH"], "isController": false}, {"data": [0.845, 500, 1500, "Sort results - GET"], "isController": false}, {"data": [0.9, 500, 1500, "Get a single cart - GET"], "isController": false}, {"data": [0.91, 500, 1500, "Limit results - GET"], "isController": false}, {"data": [0.875, 500, 1500, "Delete a cart - DELETE"], "isController": false}, {"data": [0.995, 500, 1500, "Update a cart - PUT"], "isController": false}, {"data": [0.995, 500, 1500, "Update a product - PATCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2900, 0, 0.0, 450.9903448275875, 311, 2321, 486.0, 518.0, 631.8999999999996, 1061.9799999999996, 21.663292671083987, 43.02329486776054, 5.325364914429994], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update a product -PUT", 100, 0, 0.0, 329.99, 312, 549, 327.0, 341.9, 346.0, 546.989999999999, 0.8321267495464909, 0.657217607385957, 0.2901066890508762], "isController": false}, {"data": ["Add a new cart - POST", 100, 0, 0.0, 338.10000000000014, 311, 876, 328.0, 357.70000000000005, 367.9, 872.7799999999984, 0.8313588560502141, 0.6388797959014009, 0.34342265245043024], "isController": false}, {"data": ["Get all carts - GET", 100, 0, 0.0, 504.84999999999997, 479, 1114, 495.5, 519.0, 527.8499999999999, 1108.5399999999972, 0.8307924929590337, 1.308498176410478, 0.10060377844425797], "isController": false}, {"data": ["Get all products - GET", 100, 0, 0.0, 580.7299999999999, 318, 2321, 389.0, 966.0000000000002, 1308.2999999999997, 2320.79, 0.8319259918637638, 9.180287071662105, 0.10317832125654101], "isController": false}, {"data": ["Get all categories - GET", 100, 0, 0.0, 339.24999999999994, 314, 1383, 328.0, 342.8, 348.84999999999997, 1373.0099999999948, 0.8336668000533547, 0.5998004670618248, 0.11234962735094038], "isController": false}, {"data": ["User login - POST", 100, 0, 0.0, 545.2200000000004, 474, 1586, 492.0, 542.6000000000001, 1212.6999999999944, 1585.79, 0.8268152729317215, 0.6692359090007111, 0.20508894465298563], "isController": false}, {"data": ["Delete a user - DELETE", 100, 0, 0.0, 520.3899999999999, 478, 1517, 493.0, 515.0, 703.3499999999999, 1511.099999999997, 0.8284592315212168, 0.7906445982386957, 0.1715169502758769], "isController": false}, {"data": ["Get all users - GET", 100, 0, 0.0, 551.9, 477, 1609, 497.0, 661.9, 894.95, 1606.0699999999986, 0.8297791128001726, 2.9721326464145243, 0.1004810644406459], "isController": false}, {"data": ["Update a users - PATCH", 100, 0, 0.0, 337.6100000000002, 314, 567, 328.5, 354.5, 366.79999999999995, 566.7499999999999, 0.8296414289743972, 0.7713558778021139, 0.5201462865249639], "isController": false}, {"data": ["Delete a product -DELETE", 100, 0, 0.0, 519.9100000000001, 478, 1060, 494.0, 527.8, 724.949999999998, 1059.9099999999999, 0.8304199433653598, 0.8739034564154092, 0.17435574982768784], "isController": false}, {"data": ["Limit results -GET", 100, 0, 0.0, 525.8799999999998, 477, 1576, 496.0, 526.3000000000001, 703.2999999999998, 1570.3599999999972, 0.8309029422273184, 1.114026628362041, 0.10710858239649027], "isController": false}, {"data": ["Get a single product - GET", 100, 0, 0.0, 337.5800000000001, 312, 850, 326.0, 340.0, 367.84999999999997, 847.0999999999985, 0.8387361923054342, 0.8833104340879163, 0.10566110235097755], "isController": false}, {"data": ["Add a new user - POST", 100, 0, 0.0, 506.5, 473, 1520, 491.0, 521.2, 545.95, 1510.8499999999954, 0.8291323958609711, 0.5520936758962921, 0.5173980478077739], "isController": false}, {"data": ["Get a single user -GET", 100, 0, 0.0, 525.0299999999999, 474, 1009, 492.0, 592.7000000000003, 842.8499999999999, 1007.7299999999993, 0.8301717625376691, 0.7820801717625377, 0.10215004109350224], "isController": false}, {"data": ["Update a users - PUT", 100, 0, 0.0, 331.5399999999999, 315, 407, 327.0, 350.9, 364.79999999999995, 406.95, 0.8299650584710383, 0.7717216120826313, 0.518728161544399], "isController": false}, {"data": ["Get user carts - GET", 100, 0, 0.0, 535.32, 479, 1042, 492.0, 689.1000000000007, 892.5999999999999, 1041.6599999999999, 0.8302751531857657, 0.6566633213496953, 0.10621684088606966], "isController": false}, {"data": ["Get carts in a date range - GET", 100, 0, 0.0, 502.51000000000005, 479, 858, 494.5, 513.7, 519.75, 856.4499999999991, 0.8307372793354102, 1.3090440031152648, 0.13304776739356178], "isController": false}, {"data": ["Get products in a specific category -GET", 100, 0, 0.0, 506.94000000000005, 475, 852, 494.0, 521.8, 528.0, 851.99, 0.832251406504877, 1.7992560192582974, 0.11784809955391325], "isController": false}, {"data": ["Sort results -GET", 200, 0, 0.0, 495.66999999999985, 320, 1646, 491.5, 640.7, 791.5999999999999, 1563.2700000000034, 1.542817029614373, 11.276274897209815, 0.20415205811791748], "isController": false}, {"data": ["Add new product - POST", 100, 0, 0.0, 334.71, 314, 555, 328.0, 344.0, 358.69999999999993, 554.9, 0.8333402778356486, 0.6611220458087151, 0.29215738256152135], "isController": false}, {"data": ["Update a cart - PATCH", 100, 0, 0.0, 333.47, 312, 623, 328.0, 344.9, 362.4999999999999, 620.6799999999988, 0.8310548579311721, 0.6383540127483815, 0.34573180613152277], "isController": false}, {"data": ["Sort results - GET", 100, 0, 0.0, 511.9100000000001, 480, 1091, 496.0, 514.6, 532.3499999999999, 1090.2099999999996, 0.8308201025232007, 1.309142058813755, 0.10872059935362197], "isController": false}, {"data": ["Get a single cart - GET", 100, 0, 0.0, 508.8499999999999, 477, 1531, 491.0, 509.8, 523.6999999999999, 1522.7899999999959, 0.8309305591331733, 0.6558508936658164, 0.10224340864333968], "isController": false}, {"data": ["Limit results - GET", 200, 0, 0.0, 440.65999999999985, 313, 1682, 481.5, 515.9, 581.75, 1150.7000000000003, 1.5532171009202813, 3.9036259125150474, 0.2024946122781812], "isController": false}, {"data": ["Delete a cart - DELETE", 100, 0, 0.0, 511.16999999999996, 479, 890, 493.0, 519.0, 698.449999999998, 889.7599999999999, 0.8297928836962295, 0.6563791365175252, 0.171793057952735], "isController": false}, {"data": ["Update a cart - PUT", 100, 0, 0.0, 331.24000000000007, 313, 539, 325.0, 340.9, 360.74999999999994, 538.2199999999996, 0.8313865032715059, 0.6382190454020169, 0.3442459740108579], "isController": false}, {"data": ["Update a product - PATCH", 100, 0, 0.0, 335.46000000000004, 315, 915, 327.0, 342.9, 363.39999999999986, 909.7199999999973, 0.8321198252548366, 0.6564482785521115, 0.2917295090493031], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2900, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
