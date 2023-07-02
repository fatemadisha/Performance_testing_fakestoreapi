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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41780172413793104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9755, 500, 1500, "Update a product -PUT"], "isController": false}, {"data": [0.9105, 500, 1500, "Add a new cart - POST"], "isController": false}, {"data": [0.011, 500, 1500, "Get all carts - GET"], "isController": false}, {"data": [0.72275, 500, 1500, "Get all products - GET"], "isController": false}, {"data": [0.95825, 500, 1500, "Get all categories - GET"], "isController": false}, {"data": [0.01675, 500, 1500, "User login - POST"], "isController": false}, {"data": [0.015, 500, 1500, "Delete a user - DELETE"], "isController": false}, {"data": [0.001, 500, 1500, "Get all users - GET"], "isController": false}, {"data": [0.961, 500, 1500, "Update a users - PATCH"], "isController": false}, {"data": [0.02175, 500, 1500, "Delete a product -DELETE"], "isController": false}, {"data": [5.0E-4, 500, 1500, "Limit results -GET"], "isController": false}, {"data": [0.945, 500, 1500, "Get a single product - GET"], "isController": false}, {"data": [0.0025, 500, 1500, "Add a new user - POST"], "isController": false}, {"data": [0.002, 500, 1500, "Get a single user -GET"], "isController": false}, {"data": [0.95725, 500, 1500, "Update a users - PUT"], "isController": false}, {"data": [5.0E-4, 500, 1500, "Get user carts - GET"], "isController": false}, {"data": [2.5E-4, 500, 1500, "Get carts in a date range - GET"], "isController": false}, {"data": [0.0345, 500, 1500, "Get products in a specific category -GET"], "isController": false}, {"data": [0.4085, 500, 1500, "Sort results -GET"], "isController": false}, {"data": [0.964, 500, 1500, "Add new product - POST"], "isController": false}, {"data": [0.94475, 500, 1500, "Update a cart - PATCH"], "isController": false}, {"data": [0.0, 500, 1500, "Sort results - GET"], "isController": false}, {"data": [0.00125, 500, 1500, "Get a single cart - GET"], "isController": false}, {"data": [0.473375, 500, 1500, "Limit results - GET"], "isController": false}, {"data": [2.5E-4, 500, 1500, "Delete a cart - DELETE"], "isController": false}, {"data": [0.929, 500, 1500, "Update a cart - PUT"], "isController": false}, {"data": [0.97725, 500, 1500, "Update a product - PATCH"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 58000, 0, 0.0, 2192.8813275862112, 307, 70219, 2901.5, 3534.0, 4019.0, 62155.900000085974, 90.26296090524411, 179.2752724983348, 22.188834004858638], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update a product -PUT", 2000, 0, 0.0, 360.88500000000016, 308, 4011, 328.0, 401.0, 481.9499999999998, 997.4900000000005, 3.744049301641204, 2.9550128491091967, 1.3052984381698338], "isController": false}, {"data": ["Add a new cart - POST", 2000, 0, 0.0, 942.0754999999999, 310, 67137, 335.0, 601.8000000000002, 1182.0, 4528.75, 3.2788121519335975, 2.5208878265082126, 1.3544311916678826], "isController": false}, {"data": ["Get all carts - GET", 2000, 0, 0.0, 3006.1745000000024, 617, 5775, 3044.5, 3332.9, 3451.95, 4268.96, 3.7050141809417774, 5.836833751613997, 0.4486540609734184], "isController": false}, {"data": ["Get all products - GET", 2000, 0, 0.0, 925.5934999999956, 312, 9594, 416.0, 2224.7000000000003, 4023.9499999999925, 8804.910000000025, 3.7491798669041145, 41.37399753374262, 0.46498617489924077], "isController": false}, {"data": ["Get all categories - GET", 2000, 0, 0.0, 383.3190000000004, 307, 3988, 331.0, 465.0, 566.8499999999995, 1107.98, 3.7620786236811563, 2.7084798486609825, 0.5069988770195308], "isController": false}, {"data": ["User login - POST", 2000, 0, 0.0, 3250.061500000006, 486, 67121, 3223.5, 3796.8, 4293.399999999998, 4975.99, 3.3292383701380635, 2.6928466527837425, 0.8258071738428399], "isController": false}, {"data": ["Delete a user - DELETE", 2000, 0, 0.0, 3354.508000000004, 596, 5756, 3367.5, 3958.9, 4141.9, 4617.87, 3.313644760713428, 3.1628383283076387, 0.6860280168664518], "isController": false}, {"data": ["Get all users - GET", 2000, 0, 0.0, 3974.254499999997, 983, 70027, 3295.0, 4066.0, 4270.95, 6356.42, 3.2630685897017555, 11.689038230927364, 0.395137212034197], "isController": false}, {"data": ["Update a users - PATCH", 2000, 0, 0.0, 369.94800000000015, 307, 2264, 331.0, 454.0, 565.0, 873.94, 3.315122261709012, 3.083105789902469, 2.0784262617355327], "isController": false}, {"data": ["Delete a product -DELETE", 2000, 0, 0.0, 2922.8100000000027, 481, 4906, 3008.0, 3294.9, 3418.0, 4207.9, 3.7231121494457216, 3.9202843875945907, 0.7817081173152639], "isController": false}, {"data": ["Limit results -GET", 2000, 0, 0.0, 3060.2510000000007, 1422, 5983, 3061.0, 3334.0, 3421.8999999999996, 4961.51, 3.6714021635572953, 4.923726763466244, 0.4732666851460576], "isController": false}, {"data": ["Get a single product - GET", 2000, 0, 0.0, 388.6564999999997, 308, 4240, 332.0, 512.0, 622.6999999999989, 1031.96, 3.760911344036887, 3.9599788789569494, 0.47378668298902193], "isController": false}, {"data": ["Add a new user - POST", 2000, 0, 0.0, 3660.003000000002, 748, 68393, 3474.5, 4086.9, 4269.9, 4917.98, 3.2998018468990935, 2.1984043627711407, 2.0591536915708213], "isController": false}, {"data": ["Get a single user -GET", 2000, 0, 0.0, 4308.458500000002, 716, 70129, 3387.5, 4004.8, 4265.799999999999, 63734.7, 3.269886633030433, 3.0826025988241486, 0.4023493317986665], "isController": false}, {"data": ["Update a users - PUT", 2000, 0, 0.0, 405.3015000000005, 309, 66914, 331.0, 470.60000000000036, 597.7499999999991, 872.94, 3.315067312441779, 3.082650015083556, 2.0719170702761116], "isController": false}, {"data": ["Get user carts - GET", 2000, 0, 0.0, 4280.478500000001, 1114, 70002, 3248.0, 3489.9, 3755.95, 63777.96, 3.264117717141351, 2.5828733987462527, 0.41757755951710646], "isController": false}, {"data": ["Get carts in a date range - GET", 2000, 0, 0.0, 3499.9095, 1108, 70096, 3220.0, 3461.8, 3585.0, 5497.920000000001, 3.269143696845767, 5.150095326186985, 0.5235737951979549], "isController": false}, {"data": ["Get products in a specific category -GET", 2000, 0, 0.0, 2866.936499999994, 477, 4997, 2957.0, 3483.9, 3608.8999999999996, 4023.88, 3.742767102574275, 8.093854475834824, 0.5299816697981151], "isController": false}, {"data": ["Sort results -GET", 4000, 0, 0.0, 2427.100999999997, 312, 67548, 1705.5, 3777.9, 4018.8499999999995, 5557.879999999976, 6.27275835139365, 45.84648509416194, 0.8300378482557027], "isController": false}, {"data": ["Add new product - POST", 2000, 0, 0.0, 390.3559999999993, 308, 3956, 329.0, 424.9000000000001, 539.0, 1989.850000000001, 3.7440422927017383, 2.9695886069729043, 1.3126085772264884], "isController": false}, {"data": ["Update a cart - PATCH", 2000, 0, 0.0, 439.5685000000003, 308, 67213, 330.0, 499.0, 758.9499999999998, 2138.95, 3.2786777748269675, 2.5172240726259916, 1.3639811836682503], "isController": false}, {"data": ["Sort results - GET", 2000, 0, 0.0, 3176.9060000000077, 1503, 69939, 3133.5, 3329.0, 3430.749999999999, 3975.88, 3.2681073573266883, 5.148555266759263, 0.42766248621267205], "isController": false}, {"data": ["Get a single cart - GET", 2000, 0, 0.0, 3043.463999999998, 875, 5983, 3065.0, 3356.9, 3454.95, 4497.99, 3.687927569102543, 2.911359508399255, 0.4537879626044145], "isController": false}, {"data": ["Limit results - GET", 4000, 0, 0.0, 2691.660000000002, 309, 70195, 1894.5, 3883.9, 4172.0, 63780.94, 6.296555154674878, 15.825964027190098, 0.8208887823721641], "isController": false}, {"data": ["Delete a cart - DELETE", 2000, 0, 0.0, 3449.4925000000057, 780, 70219, 3158.0, 3517.8, 3817.749999999999, 4290.93, 3.2611052864147245, 2.5799005189641426, 0.6751507038280484], "isController": false}, {"data": ["Update a cart - PUT", 2000, 0, 0.0, 532.7169999999999, 309, 67497, 332.0, 567.9000000000001, 824.0, 2618.0, 3.278742274463516, 2.517491321579042, 1.3576042230200496], "isController": false}, {"data": ["Update a product - PATCH", 2000, 0, 0.0, 363.9079999999998, 309, 4882, 327.5, 391.9000000000001, 467.59999999999854, 1291.7400000000011, 3.7439581874749623, 2.955895207312325, 1.3125790911167106], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 58000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
