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

    var data = {"OkPercent": 99.24561403508773, "KoPercent": 0.7543859649122807};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4460112359550562, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.635, 500, 1500, "Comment in Review Mode Helm Collection"], "isController": true}, {"data": [0.2, 500, 1500, "Comment in Review Mode NS Collection"], "isController": true}, {"data": [0.03, 500, 1500, "Delete Bundle Collection"], "isController": true}, {"data": [0.44, 500, 1500, "Approve Helm Bundle"], "isController": false}, {"data": [0.19, 500, 1500, "Submit Slice Bundle Collection"], "isController": true}, {"data": [0.44, 500, 1500, "Approve Helm Bundle Collection"], "isController": true}, {"data": [0.46, 500, 1500, "Approve Bundle"], "isController": false}, {"data": [0.605, 500, 1500, "Trigger QA"], "isController": false}, {"data": [0.32, 500, 1500, "Trigger QA and trigger dep Collection"], "isController": true}, {"data": [0.66, 500, 1500, "Comment in Resubmit Mode Collection"], "isController": true}, {"data": [0.79, 500, 1500, "services/count"], "isController": false}, {"data": [0.17, 500, 1500, "Re-Submit Bundle Collection"], "isController": true}, {"data": [0.245, 500, 1500, "Helm Bundle Upload"], "isController": false}, {"data": [0.145, 500, 1500, "Re-Submit Helm Bundle Collection"], "isController": true}, {"data": [0.66, 500, 1500, "Delete Helm Bundle"], "isController": false}, {"data": [0.18, 500, 1500, "file upload"], "isController": false}, {"data": [0.475, 500, 1500, "CPE Collection"], "isController": true}, {"data": [0.455, 500, 1500, "Reject  Bundle Collection"], "isController": true}, {"data": [0.605, 500, 1500, "Slice Bundle"], "isController": false}, {"data": [0.745, 500, 1500, "Comment in Resubmit Mode NS Collection"], "isController": true}, {"data": [0.475, 500, 1500, "CPE stepper"], "isController": false}, {"data": [0.575, 500, 1500, "NS Bundle Submit"], "isController": false}, {"data": [0.7, 500, 1500, "Delete Slice Bundle"], "isController": false}, {"data": [0.835, 500, 1500, "auth/token"], "isController": false}, {"data": [0.0, 500, 1500, "Login Collection"], "isController": true}, {"data": [0.4, 500, 1500, "AppRevision Robin"], "isController": false}, {"data": [0.645, 500, 1500, "Delete NS Bundle"], "isController": false}, {"data": [0.885, 500, 1500, "auth/me"], "isController": false}, {"data": [0.735, 500, 1500, "Comment in Review Mode Collection"], "isController": true}, {"data": [0.415, 500, 1500, "Slice AppRevision Robin"], "isController": false}, {"data": [0.46, 500, 1500, "Approve Robin Bundle Collection"], "isController": true}, {"data": [0.885, 500, 1500, "get tenant details"], "isController": false}, {"data": [0.66, 500, 1500, "Comment by submitter"], "isController": false}, {"data": [0.615, 500, 1500, "GRC Collection"], "isController": true}, {"data": [0.15, 500, 1500, "Submit Helm Bundle Collection"], "isController": true}, {"data": [0.735, 500, 1500, "Comment by reviewer"], "isController": false}, {"data": [0.46, 500, 1500, "Reject  Bundle Helm Collection"], "isController": true}, {"data": [0.23, 500, 1500, "Re-Submit  NS Bundle Collection"], "isController": true}, {"data": [0.705, 500, 1500, "Comment by submitter Helm"], "isController": false}, {"data": [0.615, 500, 1500, "GRC security form"], "isController": false}, {"data": [0.19, 500, 1500, "Bundle Submit Slice"], "isController": false}, {"data": [0.57, 500, 1500, "Approve Slice Bundle Collection"], "isController": true}, {"data": [0.145, 500, 1500, "Helm Bundle Re-Submit"], "isController": false}, {"data": [0.58, 500, 1500, "NS Bundle"], "isController": false}, {"data": [0.745, 500, 1500, "NS Comment by submitter"], "isController": false}, {"data": [0.27, 500, 1500, "icon/upload"], "isController": false}, {"data": [0.155, 500, 1500, "Submit Bundle Collection"], "isController": true}, {"data": [0.225, 500, 1500, "Submit NS Bundle Collection"], "isController": true}, {"data": [0.17, 500, 1500, "Bundle Re-Submit"], "isController": false}, {"data": [0.435, 500, 1500, "OBF Collection"], "isController": true}, {"data": [0.175, 500, 1500, "app-revisions/config-file/upload CMDB"], "isController": false}, {"data": [0.58, 500, 1500, "NS Approve Bundle"], "isController": false}, {"data": [0.52, 500, 1500, "App DATA NS"], "isController": false}, {"data": [0.0, 500, 1500, "NS Bundle Collection"], "isController": true}, {"data": [0.695, 500, 1500, "auth/login"], "isController": false}, {"data": [0.665, 500, 1500, "Trigger Deployment"], "isController": false}, {"data": [0.095, 500, 1500, "Configure Collection"], "isController": true}, {"data": [0.435, 500, 1500, "OBF/Mertrics-Logging"], "isController": false}, {"data": [0.16, 500, 1500, "NS file upload"], "isController": false}, {"data": [0.23, 500, 1500, "NS Bundle Re-Submit"], "isController": false}, {"data": [0.57, 500, 1500, "Approve Slice Bundle"], "isController": false}, {"data": [0.2, 500, 1500, "NS Comment by reviewer "], "isController": false}, {"data": [0.375, 500, 1500, "Rakuten Values"], "isController": false}, {"data": [0.225, 500, 1500, "NS  Bundle Submit"], "isController": false}, {"data": [0.255, 500, 1500, "NS icon/upload"], "isController": false}, {"data": [0.695, 500, 1500, "Helm bundle status"], "isController": false}, {"data": [0.58, 500, 1500, "Approve NS Bundle Collection"], "isController": true}, {"data": [0.675, 500, 1500, "app-revisions/config-file/upload"], "isController": false}, {"data": [0.635, 500, 1500, "Comment by reviewer Helm"], "isController": false}, {"data": [0.305, 500, 1500, "Bundle Submit"], "isController": false}, {"data": [0.86, 500, 1500, "tenants"], "isController": false}, {"data": [0.3125, 500, 1500, "Resource Robin"], "isController": false}, {"data": [0.0, 500, 1500, "Helm Bundle Collection"], "isController": true}, {"data": [0.445, 500, 1500, "NS app Revision"], "isController": false}, {"data": [0.32, 500, 1500, "NS App node resources"], "isController": false}, {"data": [0.305, 500, 1500, "Bundle Submit Helm"], "isController": false}, {"data": [0.0, 500, 1500, "Slice Bundle Collection"], "isController": true}, {"data": [0.555, 500, 1500, "HELM Bundle"], "isController": false}, {"data": [0.695, 500, 1500, "Get Helm bundle Status Collection"], "isController": true}, {"data": [0.66, 500, 1500, "Delete Robin Bundle"], "isController": false}, {"data": [0.56, 500, 1500, "Robin Bundle"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.595, 500, 1500, "App Helm"], "isController": false}, {"data": [0.705, 500, 1500, "Comment in Resubmit Mode Helm Collection"], "isController": true}, {"data": [0.0, 500, 1500, "Robin Bundle Collection"], "isController": true}, {"data": [0.575, 500, 1500, "Reject NS Bundle Collection"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5700, 43, 0.7543859649122807, 1319.4442105263154, 0, 34959, 812.0, 2462.600000000002, 3561.8499999999995, 9245.879999999997, 3.739546491419709, 9.532525448802984, 85.68505626582336], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Comment in Review Mode Helm Collection", 100, 1, 1.0, 917.01, 288, 6554, 572.5, 2226.8000000000034, 3200.75, 6529.599999999988, 0.07144847493230258, 0.11980109079493574, 0.28367835504176164], "isController": true}, {"data": ["Comment in Review Mode NS Collection", 100, 2, 2.0, 2200.61, 1151, 11455, 1610.5, 3764.1000000000017, 6061.099999999994, 11431.149999999987, 0.07135456654955004, 0.12058991429067853, 0.2845346959795983], "isController": true}, {"data": ["Delete Bundle Collection", 100, 0, 0.0, 3053.0300000000007, 1385, 10525, 2577.0, 5207.800000000001, 7546.45, 10521.859999999999, 0.07128396681018505, 0.32857453451569674, 1.079283809985458], "isController": true}, {"data": ["Approve Helm Bundle", 100, 1, 1.0, 1313.6400000000006, 390, 12755, 913.0, 2284.6, 2758.049999999999, 12718.269999999982, 0.07139083627225609, 0.08197118130416779, 0.27134095192541086], "isController": false}, {"data": ["Submit Slice Bundle Collection", 100, 2, 2.0, 1882.5600000000004, 519, 6292, 1608.5, 3009.5000000000023, 4044.8999999999974, 6286.029999999997, 0.07130328137700896, 0.08247227193645451, 0.2710081749212099], "isController": true}, {"data": ["Approve Helm Bundle Collection", 100, 1, 1.0, 1313.6400000000006, 390, 12755, 913.0, 2284.6, 2758.049999999999, 12718.269999999982, 0.07139078530577744, 0.08197112278429775, 0.27134075821297443], "isController": true}, {"data": ["Approve Bundle", 100, 1, 1.0, 1267.3699999999994, 401, 15600, 880.0, 2290.6000000000013, 2790.0499999999956, 15532.819999999967, 0.07155686266091349, 0.08216390971491745, 0.2719719819104251], "isController": false}, {"data": ["Trigger QA", 100, 1, 1.0, 810.3800000000006, 354, 3366, 655.5, 1529.6000000000001, 2005.5499999999995, 3362.279999999998, 0.07161082096793484, 0.08222586639246884, 0.2729463224979], "isController": false}, {"data": ["Trigger QA and trigger dep Collection", 100, 1, 1.0, 1754.64, 691, 19322, 1254.5, 2821.4000000000005, 3756.549999999997, 19224.169999999947, 0.07157186853392901, 0.1969477494494334, 0.5667038184307582], "isController": true}, {"data": ["Comment in Resubmit Mode Collection", 100, 1, 1.0, 788.6499999999997, 294, 9120, 553.5, 1369.6000000000001, 1727.1999999999996, 9048.869999999963, 0.07162010404968717, 0.12376079874500091, 0.2888360461835079], "isController": true}, {"data": ["services/count", 100, 0, 0.0, 697.3, 299, 8686, 417.0, 1241.7000000000007, 2453.899999999991, 8640.029999999977, 0.07173997415926131, 0.08659239068442087, 0.26243939765682894], "isController": false}, {"data": ["Re-Submit Bundle Collection", 100, 1, 1.0, 2082.309999999999, 554, 7242, 1820.5, 3245.2000000000003, 3988.7499999999973, 7232.559999999995, 0.07153510764245323, 0.08213892989738289, 0.27188929584416793], "isController": true}, {"data": ["Helm Bundle Upload", 100, 0, 0.0, 2063.7499999999995, 687, 8709, 1529.5, 3951.900000000001, 6279.399999999995, 8695.069999999992, 0.07162466954168091, 0.11857240215532956, 1.0382149731192616], "isController": false}, {"data": ["Re-Submit Helm Bundle Collection", 100, 1, 1.0, 2218.4900000000007, 373, 17422, 1744.5, 3478.9000000000005, 4269.849999999999, 17322.739999999947, 0.07133878647017113, 0.08191211422659482, 0.27114312201358004], "isController": true}, {"data": ["Delete Helm Bundle", 100, 0, 0.0, 761.2600000000001, 315, 7532, 575.0, 1188.5, 1777.8999999999974, 7495.6099999999815, 0.07133787042189217, 0.08220574911897731, 0.2700249860891153], "isController": false}, {"data": ["file upload", 100, 1, 1.0, 3207.3499999999995, 750, 23144, 2230.0, 7221.200000000003, 10403.649999999998, 23031.049999999945, 0.07172695556371649, 0.17447441849163953, 12.930111809771507], "isController": false}, {"data": ["CPE Collection", 100, 2, 2.0, 1085.2800000000004, 442, 7681, 731.0, 1921.7000000000005, 3470.6499999999983, 7664.129999999992, 0.07178951887382347, 0.5171635615605893, 1.1641259383787486], "isController": true}, {"data": ["Reject  Bundle Collection", 100, 0, 0.0, 1012.9499999999998, 403, 3034, 811.5, 1888.2000000000005, 2251.6999999999994, 3032.329999999999, 0.07161589815646355, 0.0825261326412373, 0.27205648811390937], "isController": true}, {"data": ["Slice Bundle", 100, 0, 0.0, 735.0500000000001, 378, 2328, 635.5, 1142.2000000000005, 1465.8999999999987, 2327.98, 0.07133222197731492, 0.15919903009577777, 0.31008339806732477], "isController": false}, {"data": ["Comment in Resubmit Mode NS Collection", 100, 2, 2.0, 676.7200000000004, 299, 10598, 452.0, 1191.8000000000002, 1694.4499999999987, 10513.119999999957, 0.07142061313167962, 0.12451040053751154, 0.2890023950902614], "isController": true}, {"data": ["CPE stepper", 100, 2, 2.0, 1085.2800000000004, 442, 7681, 731.0, 1921.7000000000005, 3470.6499999999983, 7664.129999999992, 0.07178951887382347, 0.5171635615605893, 1.1641259383787486], "isController": false}, {"data": ["NS Bundle Submit", 100, 2, 2.0, 900.6199999999997, 319, 9885, 600.5, 1750.1000000000006, 1983.1999999999998, 9814.989999999965, 0.07141546159026521, 0.08211034541337768, 0.27126995705074136], "isController": false}, {"data": ["Delete Slice Bundle", 100, 0, 0.0, 732.6700000000003, 322, 8004, 528.5, 1153.0, 1437.5, 7972.829999999984, 0.07133797220387252, 0.08220586640680622, 0.2700253713498143], "isController": false}, {"data": ["auth/token", 100, 0, 0.0, 532.8299999999998, 311, 2322, 394.5, 800.6000000000001, 1449.3499999999983, 2321.4199999999996, 0.07189708363859637, 0.3236070883694245, 0.054624932686355446], "isController": false}, {"data": ["Login Collection", 100, 0, 0.0, 3839.2499999999995, 1933, 23694, 2894.0, 6164.400000000003, 10490.499999999976, 23585.289999999943, 0.07150656466016862, 0.9942485035463681, 1.1473172435220416], "isController": true}, {"data": ["AppRevision Robin", 100, 0, 0.0, 1304.25, 514, 12498, 1010.0, 1827.8000000000002, 2020.9499999999991, 12460.44999999998, 0.0717105475458858, 0.13232276738174034, 0.27799602185737493], "isController": false}, {"data": ["Delete NS Bundle", 100, 0, 0.0, 772.15, 322, 5022, 611.0, 1145.6000000000001, 1712.9499999999982, 5020.659999999999, 0.0713381248773876, 0.08220604233917711, 0.2700259492429241], "isController": false}, {"data": ["auth/me", 100, 0, 0.0, 540.5099999999999, 289, 6814, 356.0, 722.7000000000003, 1270.099999999998, 6781.099999999983, 0.07188106271838365, 0.2519347012658974, 0.2619727793603592], "isController": false}, {"data": ["Comment in Review Mode Collection", 100, 0, 0.0, 706.7400000000001, 304, 4222, 490.5, 1517.4000000000005, 2155.9999999999955, 4207.119999999993, 0.07165854417068493, 0.12104135808706083, 0.28472234911756084], "isController": true}, {"data": ["Slice AppRevision Robin", 100, 0, 0.0, 1075.8599999999994, 502, 6928, 874.5, 1579.4, 1975.3499999999995, 6883.529999999977, 0.071323674681308, 0.12944968346553176, 0.27635695074173056], "isController": false}, {"data": ["Approve Robin Bundle Collection", 100, 1, 1.0, 1267.3699999999994, 401, 15600, 880.0, 2290.6000000000013, 2790.0499999999956, 15532.819999999967, 0.07155686266091349, 0.08216390971491745, 0.2719719819104251], "isController": true}, {"data": ["get tenant details", 100, 0, 0.0, 476.7099999999999, 295, 5602, 349.5, 683.2000000000002, 929.1999999999985, 5558.729999999978, 0.07185523756419367, 0.11683493217224851, 0.26496618851796416], "isController": false}, {"data": ["Comment by submitter", 100, 1, 1.0, 788.6499999999997, 294, 9120, 553.5, 1369.6000000000001, 1727.1999999999996, 9048.869999999963, 0.07162010404968717, 0.12376079874500091, 0.2888360461835079], "isController": false}, {"data": ["GRC Collection", 100, 0, 0.0, 995.3299999999998, 370, 14516, 596.0, 1557.2000000000003, 2409.8999999999955, 14466.369999999974, 0.07182783156086188, 0.16757489218642482, 0.3561229500336872], "isController": true}, {"data": ["Submit Helm Bundle Collection", 100, 0, 0.0, 2567.64, 1187, 17620, 1875.0, 4595.400000000002, 5638.549999999992, 17561.699999999968, 0.07141857282837547, 0.08229874603269828, 0.2714463725078489], "isController": true}, {"data": ["Comment by reviewer", 100, 0, 0.0, 706.7400000000001, 304, 4222, 490.5, 1517.4000000000005, 2155.9999999999955, 4207.119999999993, 0.07165854417068493, 0.12104135808706083, 0.28472234911756084], "isController": false}, {"data": ["Reject  Bundle Helm Collection", 100, 1, 1.0, 1050.56, 409, 4066, 876.0, 1793.4000000000005, 2313.749999999998, 4053.4599999999937, 0.07141622662368363, 0.08200172943319797, 0.27129797027942315], "isController": true}, {"data": ["Re-Submit  NS Bundle Collection", 100, 1, 1.0, 1790.82, 311, 5669, 1554.5, 2589.500000000001, 3382.5499999999993, 5649.18999999999, 0.07126842110514515, 0.08223429261815948, 0.2708506233492452], "isController": true}, {"data": ["Comment by submitter Helm", 100, 1, 1.0, 623.62, 301, 4225, 517.5, 1049.0000000000002, 1285.699999999999, 4199.289999999986, 0.07140607851383957, 0.12357296067810068, 0.287738603411354], "isController": false}, {"data": ["GRC security form", 100, 0, 0.0, 995.3299999999998, 370, 14516, 596.0, 1557.2000000000003, 2409.8999999999955, 14466.369999999974, 0.0718278831532728, 0.16757501255192256, 0.35612320582926366], "isController": false}, {"data": ["Bundle Submit Slice", 100, 2, 2.0, 1882.5600000000004, 519, 6292, 1608.5, 3009.5000000000023, 4044.8999999999974, 6286.029999999997, 0.07130328137700896, 0.08247227193645451, 0.2710081749212099], "isController": false}, {"data": ["Approve Slice Bundle Collection", 100, 0, 0.0, 1005.4499999999997, 390, 10600, 715.5, 1464.3000000000006, 2806.1499999999915, 10570.629999999985, 0.07134830458591228, 0.08221777286267234, 0.2711792982894244], "isController": true}, {"data": ["Helm Bundle Re-Submit", 100, 1, 1.0, 2218.4900000000007, 373, 17422, 1744.5, 3478.9000000000005, 4269.849999999999, 17322.739999999947, 0.07133873557798287, 0.08191205579152824, 0.2711429285835052], "isController": false}, {"data": ["NS Bundle", 100, 0, 0.0, 835.9700000000001, 378, 4227, 601.0, 1424.5, 1929.6999999999985, 4213.959999999994, 0.07138818611185672, 0.14853762193102188, 0.2877613164552625], "isController": false}, {"data": ["NS Comment by submitter", 100, 2, 2.0, 676.7200000000004, 299, 10598, 452.0, 1191.8000000000002, 1694.4499999999987, 10513.119999999957, 0.07142061313167962, 0.12451040053751154, 0.2890023950902614], "isController": false}, {"data": ["icon/upload", 100, 0, 0.0, 3208.2700000000004, 447, 20764, 1448.5, 7926.700000000008, 17190.299999999977, 20753.309999999994, 0.0717693219162696, 0.13123833524239728, 12.938977758373147], "isController": false}, {"data": ["Submit Bundle Collection", 100, 1, 1.0, 1845.6900000000003, 734, 4462, 1684.5, 2432.1000000000004, 3081.0499999999997, 4461.33, 0.071613949251491, 0.08267774492686783, 0.2723288265481504], "isController": true}, {"data": ["Submit NS Bundle Collection", 100, 1, 1.0, 1865.5099999999993, 648, 6039, 1555.0, 2741.0000000000005, 4414.14999999999, 6031.7999999999965, 0.07133664906078167, 0.08231301861743867, 0.27124924829006053], "isController": true}, {"data": ["Bundle Re-Submit", 100, 1, 1.0, 2082.309999999999, 554, 7242, 1820.5, 3245.2000000000003, 3988.7499999999973, 7232.559999999995, 0.07153510764245323, 0.08213892989738289, 0.27188929584416793], "isController": false}, {"data": ["OBF Collection", 100, 1, 1.0, 1179.84, 422, 9036, 869.5, 2062.5000000000005, 3087.0999999999985, 8997.39999999998, 0.07177854309655506, 0.279201008587226, 0.5938552901504047], "isController": true}, {"data": ["app-revisions/config-file/upload CMDB", 100, 0, 0.0, 3544.47, 498, 21102, 2398.5, 9183.700000000003, 10787.699999999992, 21073.109999999986, 0.07166023874325139, 0.13108645118074577, 19.11323637277549], "isController": false}, {"data": ["NS Approve Bundle", 100, 1, 1.0, 902.7700000000002, 341, 4010, 679.0, 1634.9000000000005, 2146.6499999999983, 4008.7699999999995, 0.07130511172084904, 0.08227662871570937, 0.27099006345441895], "isController": false}, {"data": ["App DATA NS", 100, 2, 2.0, 1284.4799999999998, 361, 14405, 709.0, 2676.4, 5251.699999999984, 14330.009999999962, 0.07138650438134671, 0.16664705396819732, 0.32819945389324146], "isController": false}, {"data": ["NS Bundle Collection", 100, 4, 4.0, 10924.940000000004, 3785, 58108, 8723.0, 18219.30000000001, 25774.299999999992, 58017.83999999995, 0.07118876698208038, 1.6514028124724145, 28.89918701760712], "isController": true}, {"data": ["auth/login", 100, 0, 0.0, 918.0100000000001, 359, 9082, 468.0, 2535.4000000000015, 3146.8499999999976, 9034.629999999976, 0.07175850679158388, 0.10161116684355138, 0.03840201340018356], "isController": false}, {"data": ["Trigger Deployment", 100, 0, 0.0, 944.26, 329, 18493, 582.5, 1419.4000000000008, 1661.75, 18394.93999999995, 0.07163385358613399, 0.11486600350432812, 0.29416050227509116], "isController": false}, {"data": ["Configure Collection", 100, 0, 0.0, 4378.11, 823, 23071, 3215.5, 10304.000000000004, 13380.949999999993, 23059.459999999995, 0.0716342641012049, 0.6096733455171277, 20.31898416009721], "isController": true}, {"data": ["OBF/Mertrics-Logging", 100, 1, 1.0, 1179.84, 422, 9036, 869.5, 2062.5000000000005, 3087.0999999999985, 8997.39999999998, 0.07177854309655506, 0.279201008587226, 0.5938552901504047], "isController": false}, {"data": ["NS file upload", 100, 1, 1.0, 3175.36, 567, 18583, 2004.0, 7138.300000000003, 10415.34999999998, 18575.479999999996, 0.07132769369035222, 0.16658359962338978, 12.858127016121841], "isController": false}, {"data": ["NS Bundle Re-Submit", 100, 1, 1.0, 1790.82, 311, 5669, 1554.5, 2589.500000000001, 3382.5499999999993, 5649.18999999999, 0.07126842110514515, 0.08223429261815948, 0.2708506233492452], "isController": false}, {"data": ["Approve Slice Bundle", 100, 0, 0.0, 1005.4499999999997, 390, 10600, 715.5, 1464.3000000000006, 2806.1499999999915, 10570.629999999985, 0.07134830458591228, 0.08221777286267234, 0.2711792982894244], "isController": false}, {"data": ["NS Comment by reviewer ", 100, 2, 2.0, 2200.61, 1151, 11455, 1610.5, 3764.1000000000017, 6061.099999999994, 11431.149999999987, 0.07135456654955004, 0.12058991429067853, 0.2845346959795983], "isController": false}, {"data": ["Rakuten Values", 100, 12, 12.0, 1333.9800000000002, 462, 15180, 1005.0, 2115.8, 2692.8999999999996, 15094.799999999956, 0.07157760623011485, 0.08287204921318315, 0.34460702999459586], "isController": false}, {"data": ["NS  Bundle Submit", 100, 1, 1.0, 1865.5099999999995, 648, 6039, 1555.0, 2741.0000000000005, 4414.14999999999, 6031.7999999999965, 0.07133664906078167, 0.08231301861743867, 0.27124924829006053], "isController": false}, {"data": ["NS icon/upload", 100, 1, 1.0, 2861.140000000001, 558, 34959, 1446.5, 5450.700000000001, 6394.45, 34879.36999999996, 0.07132041910731084, 0.13052402833952512, 12.858120161801068], "isController": false}, {"data": ["Helm bundle status", 100, 0, 0.0, 1058.2199999999998, 296, 17292, 526.0, 1464.3000000000002, 2321.8999999999987, 17290.039999999997, 0.0716366246541742, 0.2048863431222393, 0.2661888250089188], "isController": false}, {"data": ["Approve NS Bundle Collection", 100, 1, 1.0, 902.7700000000002, 341, 4010, 679.0, 1634.9000000000005, 2146.6499999999983, 4008.7699999999995, 0.07130511172084904, 0.08227662871570937, 0.27099006345441895], "isController": true}, {"data": ["app-revisions/config-file/upload", 100, 0, 0.0, 833.6399999999999, 311, 4364, 530.0, 1590.6000000000004, 2768.7999999999947, 4357.399999999997, 0.07173493082241945, 0.47930702801464253, 1.2143799080142983], "isController": false}, {"data": ["Comment by reviewer Helm", 100, 1, 1.0, 917.01, 288, 6554, 572.5, 2226.8000000000034, 3200.75, 6529.599999999988, 0.07144847493230258, 0.11980109079493574, 0.28367835504176164], "isController": false}, {"data": ["Bundle Submit", 200, 1, 0.5, 1429.32, 403, 4462, 1358.5, 2262.2, 2835.7999999999993, 4389.850000000005, 0.1430597768124422, 0.16500771718083543, 0.543738917337915], "isController": false}, {"data": ["tenants", 100, 0, 0.0, 673.8899999999998, 279, 12791, 362.0, 779.5000000000002, 1316.1999999999998, 12742.449999999975, 0.07173642316455188, 0.11832306516106263, 0.26971213787453585], "isController": false}, {"data": ["Resource Robin", 200, 0, 0.0, 1746.415, 509, 13804, 1306.0, 3329.6000000000004, 4127.749999999999, 11963.13000000003, 0.1324853388411905, 1.641705531792838, 4.102970027344973], "isController": false}, {"data": ["Helm Bundle Collection", 100, 12, 12.0, 5418.000000000002, 2172, 19558, 4347.0, 9407.5, 12836.449999999973, 19530.609999999986, 0.07143494954906687, 0.5386348669524065, 1.9968761161710866], "isController": true}, {"data": ["NS app Revision", 100, 1, 1.0, 1248.9699999999998, 455, 11083, 828.0, 1881.9, 4008.549999999998, 11036.569999999976, 0.0713369035075642, 0.13209518514244908, 0.27746432887311234], "isController": false}, {"data": ["NS App node resources", 100, 1, 1.0, 1519.0200000000002, 555, 7151, 1139.5, 2536.3, 4451.749999999983, 7150.91, 0.0713454030729892, 0.910731037551226, 2.345733039904554], "isController": false}, {"data": ["Bundle Submit Helm", 200, 1, 0.5, 1809.0999999999995, 409, 17620, 1400.0, 3274.1000000000013, 4618.699999999994, 11759.730000000029, 0.14267594440774503, 0.16411774234222537, 0.542140722354039], "isController": false}, {"data": ["Slice Bundle Collection", 100, 0, 0.0, 3989.7799999999993, 1802, 15698, 3531.5, 6387.500000000001, 7243.999999999996, 15679.24999999999, 0.07125191756723154, 1.4038075065320195, 3.330960347595355], "isController": true}, {"data": ["HELM Bundle", 100, 0, 0.0, 1089.3600000000001, 371, 11732, 652.0, 2084.5000000000036, 3551.8999999999933, 11720.659999999994, 0.07163724047618707, 0.16336648824217972, 0.31377670994511153], "isController": false}, {"data": ["Get Helm bundle Status Collection", 100, 0, 0.0, 1058.2199999999998, 296, 17292, 526.0, 1464.3000000000002, 2321.8999999999987, 17290.039999999997, 0.0716366246541742, 0.2048863431222393, 0.2661888250089188], "isController": true}, {"data": ["Delete Robin Bundle", 100, 0, 0.0, 786.95, 317, 4256, 565.5, 1561.3, 1941.9999999999984, 4241.619999999993, 0.07134194192765927, 0.0822104408932011, 0.27004039737461655], "isController": false}, {"data": ["Robin Bundle", 100, 0, 0.0, 878.1899999999999, 371, 2991, 695.0, 1590.6, 1859.1499999999992, 2990.77, 0.07172222270037036, 0.15999939125763482, 0.3151407225870493], "isController": false}, {"data": ["Debug Sampler", 100, 0, 0.0, 0.15000000000000005, 0, 3, 0.0, 1.0, 1.0, 2.9799999999999898, 0.07135538119471742, 0.3534279415007179, 0.0], "isController": false}, {"data": ["App Helm", 100, 0, 0.0, 930.91, 367, 9686, 647.0, 1736.5000000000002, 1999.7499999999993, 9618.069999999965, 0.07164144887666207, 0.1752696852791151, 0.3054808171065452], "isController": false}, {"data": ["Comment in Resubmit Mode Helm Collection", 100, 1, 1.0, 623.62, 301, 4225, 517.5, 1049.0000000000002, 1285.699999999999, 4199.289999999986, 0.07140607851383957, 0.12357296067810068, 0.287738603411354], "isController": true}, {"data": ["Robin Bundle Collection", 100, 1, 1.0, 9912.020000000002, 2730, 30616, 7123.5, 24463.40000000001, 27468.5, 30615.489999999998, 0.07143045923356546, 1.2475385510188484, 28.017585470339217], "isController": true}, {"data": ["Reject NS Bundle Collection", 100, 2, 2.0, 900.6199999999997, 319, 9885, 600.5, 1750.1000000000006, 1983.1999999999998, 9814.989999999965, 0.07141546159026521, 0.08211034541337768, 0.27126995705074136], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 18, 41.86046511627907, 0.3157894736842105], "isController": false}, {"data": ["500/Internal Server Error", 14, 32.55813953488372, 0.24561403508771928], "isController": false}, {"data": ["403/Forbidden", 5, 11.627906976744185, 0.08771929824561403], "isController": false}, {"data": ["404/Not Found", 4, 9.30232558139535, 0.07017543859649122], "isController": false}, {"data": ["429/Too Many Requests", 2, 4.651162790697675, 0.03508771929824561], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5700, 43, "502/Bad Gateway", 18, "500/Internal Server Error", 14, "403/Forbidden", 5, "404/Not Found", 4, "429/Too Many Requests", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Approve Helm Bundle", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Approve Bundle", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Trigger QA", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["file upload", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["CPE stepper", 100, 2, "502/Bad Gateway", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NS Bundle Submit", 100, 2, "502/Bad Gateway", 1, "403/Forbidden", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Comment by submitter", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Comment by submitter Helm", 100, 1, "500/Internal Server Error", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Bundle Submit Slice", 100, 2, "404/Not Found", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Helm Bundle Re-Submit", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["NS Comment by submitter", 100, 2, "500/Internal Server Error", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Bundle Re-Submit", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NS Approve Bundle", 100, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["App DATA NS", 100, 2, "502/Bad Gateway", 1, "429/Too Many Requests", 1, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["OBF/Mertrics-Logging", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NS file upload", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NS Bundle Re-Submit", 100, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["NS Comment by reviewer ", 100, 2, "502/Bad Gateway", 1, "500/Internal Server Error", 1, null, null, null, null, null, null], "isController": false}, {"data": ["Rakuten Values", 100, 12, "500/Internal Server Error", 10, "502/Bad Gateway", 2, null, null, null, null, null, null], "isController": false}, {"data": ["NS  Bundle Submit", 100, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NS icon/upload", 100, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Comment by reviewer Helm", 100, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Bundle Submit", 200, 1, "404/Not Found", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NS app Revision", 100, 1, "429/Too Many Requests", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["NS App node resources", 100, 1, "403/Forbidden", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Bundle Submit Helm", 200, 1, "502/Bad Gateway", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
