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

    var data = {"OkPercent": 99.98505747126437, "KoPercent": 0.014942528735632184};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42878735632183906, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.988, 500, 1500, "Update a product -PUT"], "isController": false}, {"data": [0.9796666666666667, 500, 1500, "Add a new cart - POST"], "isController": false}, {"data": [0.014833333333333334, 500, 1500, "Get all carts - GET"], "isController": false}, {"data": [0.6608333333333334, 500, 1500, "Get all products - GET"], "isController": false}, {"data": [0.9846666666666667, 500, 1500, "Get all categories - GET"], "isController": false}, {"data": [0.02266666666666667, 500, 1500, "User login - POST"], "isController": false}, {"data": [0.0155, 500, 1500, "Delete a user - DELETE"], "isController": false}, {"data": [0.011, 500, 1500, "Get all users - GET"], "isController": false}, {"data": [0.9911666666666666, 500, 1500, "Update a users - PATCH"], "isController": false}, {"data": [0.018833333333333334, 500, 1500, "Delete a product -DELETE"], "isController": false}, {"data": [0.012333333333333333, 500, 1500, "Limit results -GET"], "isController": false}, {"data": [0.9736666666666667, 500, 1500, "Get a single product - GET"], "isController": false}, {"data": [0.011666666666666667, 500, 1500, "Add a new user - POST"], "isController": false}, {"data": [0.011333333333333334, 500, 1500, "Get a single user -GET"], "isController": false}, {"data": [0.9901666666666666, 500, 1500, "Update a users - PUT"], "isController": false}, {"data": [0.009666666666666667, 500, 1500, "Get user carts - GET"], "isController": false}, {"data": [0.009, 500, 1500, "Get carts in a date range - GET"], "isController": false}, {"data": [0.03233333333333333, 500, 1500, "Get products in a specific category -GET"], "isController": false}, {"data": [0.36766666666666664, 500, 1500, "Sort results -GET"], "isController": false}, {"data": [0.9838333333333333, 500, 1500, "Add new product - POST"], "isController": false}, {"data": [0.9865, 500, 1500, "Update a cart - PATCH"], "isController": false}, {"data": [0.010833333333333334, 500, 1500, "Sort results - GET"], "isController": false}, {"data": [0.010833333333333334, 500, 1500, "Get a single cart - GET"], "isController": false}, {"data": [0.49291666666666667, 500, 1500, "Limit results - GET"], "isController": false}, {"data": [0.0105, 500, 1500, "Delete a cart - DELETE"], "isController": false}, {"data": [0.9871666666666666, 500, 1500, "Update a cart - PUT"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "Update a product - PATCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 87000, 13, 0.014942528735632184, 2953.501551724141, 307, 26465, 4274.0, 5351.9000000000015, 5704.0, 6098.990000000002, 76.26006610958834, 151.46478357261753, 18.746581445312327], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update a product -PUT", 3000, 0, 0.0, 345.4640000000004, 308, 6514, 324.0, 343.0, 356.0, 845.0, 2.663475231455998, 2.1024044633630106, 0.9285748609665929], "isController": false}, {"data": ["Add a new cart - POST", 3000, 1, 0.03333333333333333, 382.9246666666672, 310, 17794, 326.0, 353.0, 380.9499999999998, 1429.949999999999, 2.6949674178439182, 2.0718149794261698, 1.1132531423320093], "isController": false}, {"data": ["Get all carts - GET", 3000, 0, 0.0, 4610.533000000005, 482, 10401, 4686.0, 5237.9, 5564.0, 6635.019999999979, 2.663385375883578, 4.19625382639699, 0.32251932286090207], "isController": false}, {"data": ["Get all products - GET", 3000, 0, 0.0, 1082.1466666666659, 313, 17044, 612.0, 2244.700000000003, 5529.449999999998, 9079.98, 2.6582500562662927, 29.334744679512514, 0.3296853097127141], "isController": false}, {"data": ["Get all categories - GET", 3000, 0, 0.0, 348.729333333334, 308, 6879, 325.0, 344.0, 360.0, 847.0, 2.662922006564991, 1.917047261095952, 0.358870348540985], "isController": false}, {"data": ["User login - POST", 3000, 0, 0.0, 4933.013999999998, 478, 10332, 5063.5, 5927.0, 6080.95, 6450.939999999999, 2.7722845472859334, 2.2424352729314134, 0.6876565185650655], "isController": false}, {"data": ["Delete a user - DELETE", 3000, 0, 0.0, 5180.621333333339, 480, 6956, 5331.5, 5965.0, 6100.95, 6385.939999999999, 2.7597804318688404, 2.633843888880201, 0.571360792535346], "isController": false}, {"data": ["Get all users - GET", 3000, 0, 0.0, 5163.992333333333, 481, 22483, 5078.0, 5683.8, 5836.0, 7820.88999999991, 2.7053129641302553, 9.691294060530476, 0.3275964917501481], "isController": false}, {"data": ["Update a users - PATCH", 3000, 0, 0.0, 336.2479999999995, 307, 1239, 324.0, 341.0, 352.0, 843.9899999999998, 2.760209555109424, 2.5672967841718544, 1.730522006230713], "isController": false}, {"data": ["Delete a product -DELETE", 3000, 0, 0.0, 4626.267999999997, 473, 10258, 4611.5, 5568.700000000001, 5965.95, 8439.52999999999, 2.663115845539281, 2.8038483411007546, 0.5591502996005326], "isController": false}, {"data": ["Limit results -GET", 3000, 0, 0.0, 4836.817666666658, 478, 20604, 4855.0, 5192.9, 5500.799999999999, 8670.13999999996, 2.6639151383193536, 3.5724610863046347, 0.34339531079897917], "isController": false}, {"data": ["Get a single product - GET", 3000, 0, 0.0, 364.3823333333329, 308, 11766, 325.0, 347.9000000000001, 436.89999999999964, 888.9899999999998, 2.6626478435215115, 2.8036242991688987, 0.3354312224748779], "isController": false}, {"data": ["Add a new user - POST", 3000, 0, 0.0, 5408.664333333333, 478, 7366, 5541.5, 6094.9, 6212.849999999999, 6497.959999999999, 2.748720241667484, 1.8309572698840133, 1.715265853931174], "isController": false}, {"data": ["Get a single user -GET", 3000, 0, 0.0, 5190.865666666659, 477, 22151, 5172.5, 5741.9, 5872.95, 6160.859999999997, 2.716008698470525, 2.560248428788968, 0.3341963828196154], "isController": false}, {"data": ["Update a users - PUT", 3000, 0, 0.0, 338.7863333333335, 309, 1705, 325.0, 347.0, 361.0, 844.0, 2.7601993968044254, 2.5669171528451216, 1.725124623002766], "isController": false}, {"data": ["Get user carts - GET", 3000, 0, 0.0, 5066.958999999996, 478, 22082, 4888.5, 5187.0, 5599.749999999999, 19102.129999999983, 2.6839513131231802, 2.123709676427303, 0.34335705275306305], "isController": false}, {"data": ["Get carts in a date range - GET", 3000, 0, 0.0, 5172.268000000011, 479, 22048, 4885.0, 5181.9, 5697.9, 19093.359999999986, 2.674619201091245, 4.214005336979731, 0.42835698142476963], "isController": false}, {"data": ["Get products in a specific category -GET", 3000, 0, 0.0, 4590.519999999986, 476, 10369, 4549.0, 5831.0, 6068.749999999999, 7971.729999999994, 2.662976373185958, 5.758168028150323, 0.3770816153437148], "isController": false}, {"data": ["Sort results -GET", 6000, 0, 0.0, 2939.345166666672, 312, 17296, 2005.0, 5739.0, 5910.0, 6358.99, 5.281067198059383, 38.599022746766664, 0.6988130911494594], "isController": false}, {"data": ["Add new product - POST", 3000, 1, 0.03333333333333333, 358.65466666666674, 308, 6443, 326.0, 349.0, 364.0, 1150.4699999999666, 2.6634397614268224, 2.113046697367989, 0.9337645257345988], "isController": false}, {"data": ["Update a cart - PATCH", 3000, 4, 0.13333333333333333, 396.76833333333366, 308, 18615, 325.0, 346.0, 367.0, 859.9899999999998, 2.694964996896299, 2.0702357917515206, 1.1211475475369368], "isController": false}, {"data": ["Sort results - GET", 3000, 0, 0.0, 4818.642999999998, 475, 24881, 4860.0, 5128.700000000001, 5311.95, 7838.999999999913, 2.6689014267947027, 4.204610938670425, 0.3492507726469631], "isController": false}, {"data": ["Get a single cart - GET", 3000, 0, 0.0, 4710.722333333324, 474, 10367, 4799.5, 5100.9, 5204.95, 7782.879999999954, 2.663505972912144, 2.1024027182188245, 0.327736086510674], "isController": false}, {"data": ["Limit results - GET", 6000, 0, 0.0, 2830.9671666666713, 309, 20351, 1148.0, 5739.0, 5868.0, 6161.969999999999, 5.285295866458191, 13.284355455416328, 0.6890498029025084], "isController": false}, {"data": ["Delete a cart - DELETE", 3000, 2, 0.06666666666666667, 5106.170333333347, 474, 26465, 4879.0, 5447.0, 5732.0, 18977.179999999982, 2.6947180830853448, 2.132160595766239, 0.5578908531387627], "isController": false}, {"data": ["Update a cart - PUT", 3000, 4, 0.13333333333333333, 387.93699999999865, 308, 17717, 325.0, 345.0, 362.0, 1111.8599999999533, 2.6949843645990446, 2.068838259334303, 1.1158919634667919], "isController": false}, {"data": ["Update a product - PATCH", 3000, 1, 0.03333333333333333, 352.8200000000002, 308, 6453, 325.0, 344.0, 359.0, 848.9699999999993, 2.663505972912144, 2.1025657192353964, 0.9337877385502537], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 7, 53.84615384615385, 0.008045977011494253], "isController": false}, {"data": ["500/Internal Server Error", 6, 46.15384615384615, 0.006896551724137931], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 87000, 13, "502/Bad Gateway", 7, "500/Internal Server Error", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Add a new cart - POST", 3000, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Add new product - POST", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update a cart - PATCH", 3000, 4, "502/Bad Gateway", 3, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete a cart - DELETE", 3000, 2, "502/Bad Gateway", 1, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Update a cart - PUT", 3000, 4, "500/Internal Server Error", 3, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Update a product - PATCH", 3000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
