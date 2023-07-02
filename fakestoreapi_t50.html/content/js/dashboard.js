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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5476896551724137, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.996, 500, 1500, "Update a product -PUT"], "isController": false}, {"data": [0.9945, 500, 1500, "Add a new cart - POST"], "isController": false}, {"data": [0.285, 500, 1500, "Get all carts - GET"], "isController": false}, {"data": [0.7875, 500, 1500, "Get all products - GET"], "isController": false}, {"data": [0.9945, 500, 1500, "Get all categories - GET"], "isController": false}, {"data": [0.29, 500, 1500, "User login - POST"], "isController": false}, {"data": [0.197, 500, 1500, "Delete a user - DELETE"], "isController": false}, {"data": [0.181, 500, 1500, "Get all users - GET"], "isController": false}, {"data": [0.9945, 500, 1500, "Update a users - PATCH"], "isController": false}, {"data": [0.38, 500, 1500, "Delete a product -DELETE"], "isController": false}, {"data": [0.1705, 500, 1500, "Limit results -GET"], "isController": false}, {"data": [0.9865, 500, 1500, "Get a single product - GET"], "isController": false}, {"data": [0.0935, 500, 1500, "Add a new user - POST"], "isController": false}, {"data": [0.1545, 500, 1500, "Get a single user -GET"], "isController": false}, {"data": [0.9945, 500, 1500, "Update a users - PUT"], "isController": false}, {"data": [0.1815, 500, 1500, "Get user carts - GET"], "isController": false}, {"data": [0.149, 500, 1500, "Get carts in a date range - GET"], "isController": false}, {"data": [0.395, 500, 1500, "Get products in a specific category -GET"], "isController": false}, {"data": [0.48175, 500, 1500, "Sort results -GET"], "isController": false}, {"data": [0.9935, 500, 1500, "Add new product - POST"], "isController": false}, {"data": [0.996, 500, 1500, "Update a cart - PATCH"], "isController": false}, {"data": [0.1495, 500, 1500, "Sort results - GET"], "isController": false}, {"data": [0.2115, 500, 1500, "Get a single cart - GET"], "isController": false}, {"data": [0.55475, 500, 1500, "Limit results - GET"], "isController": false}, {"data": [0.2415, 500, 1500, "Delete a cart - DELETE"], "isController": false}, {"data": [0.994, 500, 1500, "Update a cart - PUT"], "isController": false}, {"data": [0.999, 500, 1500, "Update a product - PATCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29000, 0, 0.0, 989.3951034482765, 307, 4794, 1176.0, 1660.0, 1709.0, 2025.0, 99.2674744985281, 197.15724842434278, 24.402362737043884], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update a product -PUT", 1000, 0, 0.0, 331.0149999999995, 308, 1132, 324.0, 345.0, 358.0, 406.93000000000006, 3.722079749280708, 2.9379785780352634, 1.2976391313410283], "isController": false}, {"data": ["Add a new cart - POST", 1000, 0, 0.0, 332.80800000000005, 310, 942, 325.0, 342.0, 351.94999999999993, 531.9000000000001, 3.691835137410104, 2.8375069914127917, 1.5250451788324941], "isController": false}, {"data": ["Get all carts - GET", 1000, 0, 0.0, 1407.2519999999995, 495, 2408, 1450.5, 1675.9, 1718.0, 1915.93, 3.68911121932504, 5.811971361890744, 0.4467283117151416], "isController": false}, {"data": ["Get all products - GET", 1000, 0, 0.0, 577.2819999999998, 314, 4794, 337.0, 1027.7999999999997, 1899.8999999999985, 3203.9300000000003, 3.7160630541579027, 41.00806223104994, 0.46087891394341185], "isController": false}, {"data": ["Get all categories - GET", 1000, 0, 0.0, 334.6810000000001, 310, 1361, 325.0, 349.9, 363.94999999999993, 521.8800000000001, 3.7331820150223245, 2.6880441696096584, 0.5031046074932429], "isController": false}, {"data": ["User login - POST", 1000, 0, 0.0, 1425.8410000000003, 480, 2440, 1459.5, 1765.9, 1904.9499999999998, 2286.7400000000002, 3.760529482551143, 3.0424813501240973, 0.9327875864921781], "isController": false}, {"data": ["Delete a user - DELETE", 1000, 0, 0.0, 1555.2430000000018, 485, 3490, 1587.0, 1896.6999999999998, 2102.95, 2303.96, 3.7389187794673533, 3.5679727839428397, 0.7740730285616005], "isController": false}, {"data": ["Get all users - GET", 1000, 0, 0.0, 1567.225000000001, 1033, 3006, 1568.0, 1759.9, 1820.8999999999999, 2376.7700000000004, 3.685698384558398, 13.20322981204781, 0.44631503875511847], "isController": false}, {"data": ["Update a users - PATCH", 1000, 0, 0.0, 330.8010000000003, 309, 1128, 323.0, 338.0, 348.0, 538.7100000000003, 3.741030878468871, 3.4798455468638942, 2.345450999977554], "isController": false}, {"data": ["Delete a product -DELETE", 1000, 0, 0.0, 1289.0670000000002, 485, 2431, 1325.0, 1629.9, 1697.0, 1974.3600000000006, 3.7043073686082177, 3.8991307842759557, 0.7777598479011394], "isController": false}, {"data": ["Limit results -GET", 1000, 0, 0.0, 1505.549, 624, 2309, 1578.0, 1696.9, 1736.0, 2055.99, 3.667315781560003, 4.91879445474349, 0.4727399249667192], "isController": false}, {"data": ["Get a single product - GET", 1000, 0, 0.0, 338.27000000000044, 307, 894, 325.0, 352.0, 370.94999999999993, 717.1500000000008, 3.732192775221226, 3.929700125308372, 0.47016881640970515], "isController": false}, {"data": ["Add a new user - POST", 1000, 0, 0.0, 1663.3039999999987, 621, 2912, 1654.5, 2001.8, 2139.95, 2350.5600000000004, 3.721124077161229, 2.4786647316046233, 2.3220686379941653], "isController": false}, {"data": ["Get a single user -GET", 1000, 0, 0.0, 1590.3480000000018, 1008, 2574, 1593.0, 1770.0, 1820.9499999999998, 2351.99, 3.689342596042811, 3.477039664583418, 0.4539620772474553], "isController": false}, {"data": ["Update a users - PUT", 1000, 0, 0.0, 331.33200000000005, 309, 1390, 324.0, 337.0, 344.0, 616.2200000000007, 3.7409609032176, 3.4784214360800716, 2.3381005645110005], "isController": false}, {"data": ["Get user carts - GET", 1000, 0, 0.0, 1515.5640000000008, 879, 2160, 1559.0, 1687.0, 1741.8999999999999, 2026.8000000000002, 3.673755790757565, 2.9069668990011057, 0.4699824302629307], "isController": false}, {"data": ["Get carts in a date range - GET", 1000, 0, 0.0, 1527.798000000001, 860, 2230, 1597.0, 1696.9, 1739.8999999999999, 2023.95, 3.6691053987216833, 5.781270352069009, 0.5876301615140197], "isController": false}, {"data": ["Get products in a specific category -GET", 1000, 0, 0.0, 1183.6349999999998, 477, 2371, 1199.0, 1655.8, 1719.0, 2000.6500000000003, 3.7191588750288234, 8.04202730885383, 0.5266387078898237], "isController": false}, {"data": ["Sort results -GET", 2000, 0, 0.0, 1044.553499999997, 312, 3883, 970.0, 1786.0, 1956.0, 2310.83, 6.942829272356778, 50.74404755447517, 0.9187044593792416], "isController": false}, {"data": ["Add new product - POST", 1000, 0, 0.0, 335.98900000000003, 308, 1334, 326.0, 349.0, 360.0, 647.95, 3.7221351656164043, 2.952191151181964, 1.3049282465393448], "isController": false}, {"data": ["Update a cart - PATCH", 1000, 0, 0.0, 332.02000000000015, 309, 1233, 324.0, 341.0, 355.94999999999993, 446.98, 3.692094118863278, 2.835059560400814, 1.535968842417731], "isController": false}, {"data": ["Sort results - GET", 1000, 0, 0.0, 1525.625999999999, 789, 2367, 1599.0, 1716.9, 1758.85, 2061.98, 3.666334252361119, 5.77524981485012, 0.4797742088050683], "isController": false}, {"data": ["Get a single cart - GET", 1000, 0, 0.0, 1471.312, 494, 2077, 1554.5, 1685.9, 1724.8999999999999, 2035.95, 3.674997886876215, 2.900865324189939, 0.4521970056117218], "isController": false}, {"data": ["Limit results - GET", 2000, 0, 0.0, 984.859999999999, 310, 2991, 994.0, 1755.0, 1822.8499999999995, 2296.95, 6.970316905458107, 17.519871121018642, 0.9087278387486888], "isController": false}, {"data": ["Delete a cart - DELETE", 1000, 0, 0.0, 1499.680999999998, 1015, 2705, 1508.5, 1678.0, 1730.0, 2045.88, 3.681302297500764, 2.912593171460336, 0.7621446162794551], "isController": false}, {"data": ["Update a cart - PUT", 1000, 0, 0.0, 333.24899999999997, 309, 1201, 324.0, 342.0, 356.94999999999993, 538.97, 3.6920668559466274, 2.835146791963109, 1.5287464325404005], "isController": false}, {"data": ["Update a product - PATCH", 1000, 0, 0.0, 328.7390000000003, 310, 911, 325.0, 342.0, 354.0, 383.95000000000005, 3.7221767289510908, 2.937509887031936, 1.3049428180600013], "isController": false}]}, function(index, item){
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
