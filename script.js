/* ==========================================
   DMart Dashboard V2
   Part 3.1
========================================== */

// ===============================
// Global Variables
// ===============================

let orders = [];
let filteredOrders = [];

let currentPage = 1;
let rowsPerPage = 10;

// ===============================
// Loading Screen
// ===============================

window.addEventListener("load", () => {

    setTimeout(() => {

        document.getElementById("loader").style.display = "none";

    }, 1200);

});

// ===============================
// Live Clock
// ===============================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleDateString("en-IN") +
        " | " +
        now.toLocaleTimeString("en-IN");

}

setInterval(updateClock, 1000);

updateClock();

// ===============================
// Last Updated
// ===============================

document.getElementById("lastUpdated").innerHTML =
"Last Updated : " +
new Date().toLocaleString("en-IN");

// ===============================
// Load CSV
// ===============================

Papa.parse("dmart_orders.csv", {

    download: true,

    header: true,

    skipEmptyLines: true,

    complete: function(results) {

        orders = results.data;

        filteredOrders = [...orders];

        loadKPIs();

        populateFilters();

        loadCharts();

        loadTable();

    }

});

// ===============================
// Animated Counter
// ===============================

function animateValue(id, start, end, duration, prefix = "") {

    let range = end - start;

    let current = start;

    let increment = range / 100;

    let stepTime = duration / 100;

    const obj = document.getElementById(id);

    let timer = setInterval(() => {

        current += increment;

        if (current >= end) {

            current = end;

            clearInterval(timer);

        }

        obj.innerHTML = prefix +
            Math.round(current).toLocaleString();

    }, stepTime);

}

// ===============================
// KPI Cards
// ===============================

function loadKPIs() {

    let revenue = 0;

    let ordersCount = filteredOrders.length;

    let customerSet = new Set();

    let productQty = 0;

    let profit = 0;

    filteredOrders.forEach(row => {

        revenue += Number(row.Amount);

        profit += Number(row.Profit);

        productQty += Number(row.Quantity);

        customerSet.add(row.Customer);

    });

    animateValue(
        "totalSales",
        0,
        revenue,
        1200,
        "₹"
    );

    animateValue(
        "totalOrders",
        0,
        ordersCount,
        1200
    );

    animateValue(
        "customers",
        0,
        customerSet.size,
        1200
    );

    animateValue(
        "products",
        0,
        productQty,
        1200
    );

    animateValue(
        "profit",
        0,
        profit,
        1200,
        "₹"
    );

}

/* ==========================================
        CHART VARIABLES
========================================== */

let monthlyChart;
let departmentChart;
let categoryChart;

/* ==========================================
        LOAD CHARTS
========================================== */

function loadCharts(){

loadMonthlyChart();

loadDepartmentChart();

loadCategoryChart();

}

/* ==========================================
        MONTHLY SALES CHART
========================================== */

function loadMonthlyChart(){

if(monthlyChart) monthlyChart.destroy();

const monthlySales={};

filteredOrders.forEach(row=>{

monthlySales[row.Month]=(monthlySales[row.Month]||0)+Number(row.Amount);

});

monthlyChart=new Chart(

document.getElementById("monthlyChart"),

{

type:"line",

data:{

labels:Object.keys(monthlySales),

datasets:[{

label:"Revenue",

data:Object.values(monthlySales),

borderColor:"#2ecc71",

backgroundColor:"rgba(46,204,113,.18)",

fill:true,

tension:.4,

pointRadius:5,

pointHoverRadius:8

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true

}

}

}

});

}

/* ==========================================
        DEPARTMENT SALES
========================================== */

function loadDepartmentChart(){

if(departmentChart) departmentChart.destroy();

const departmentSales={};

filteredOrders.forEach(row=>{

departmentSales[row.Department]=(departmentSales[row.Department]||0)+Number(row.Amount);

});

departmentChart=new Chart(

document.getElementById("departmentChart"),

{

type:"bar",

data:{

labels:Object.keys(departmentSales),

datasets:[{

label:"Department Revenue",

data:Object.values(departmentSales),

backgroundColor:[

"#118C4F",

"#2ecc71",

"#27ae60",

"#58d68d"

],

borderRadius:10

}]

},

options:{

responsive:true,

plugins:{

legend:{

display:false

}

},

scales:{

y:{

beginAtZero:true

}

}

}

});

}

/* ==========================================
        CATEGORY DISTRIBUTION
========================================== */

function loadCategoryChart(){

if(categoryChart) categoryChart.destroy();

const categorySales={};

filteredOrders.forEach(row=>{

categorySales[row.Category]=(categorySales[row.Category]||0)+1;

});

categoryChart=new Chart(

document.getElementById("categoryChart"),

{

type:"doughnut",

data:{

labels:Object.keys(categorySales),

datasets:[{

data:Object.values(categorySales),

backgroundColor:[

"#118C4F",

"#2ecc71",

"#16a085",

"#27ae60",

"#58d68d",

"#82e0aa",

"#a9dfbf",

"#d5f5e3"

],

borderWidth:2,

borderColor:"#ffffff"

}]

},

options:{

responsive:true,

cutout:"65%",

plugins:{

legend:{

position:"bottom"

}

}

}

});

}

/* ==========================================
        MORE CHART VARIABLES
========================================== */

let paymentChart;
let productChart;
let cityChart;
let stateChart;
let profitChart;

/* ==========================================
        UPDATE loadCharts()
========================================== */

function loadCharts(){

loadMonthlyChart();

loadDepartmentChart();

loadCategoryChart();

loadPaymentChart();

loadProductChart();

loadCityChart();

loadStateChart();

loadProfitChart();

}

/* ==========================================
        PAYMENT METHODS
========================================== */

function loadPaymentChart(){

if(paymentChart) paymentChart.destroy();

const paymentData={};

filteredOrders.forEach(row=>{

paymentData[row.Payment]=(paymentData[row.Payment]||0)+1;

});

paymentChart=new Chart(

document.getElementById("paymentChart"),{

type:"pie",

data:{

labels:Object.keys(paymentData),

datasets:[{

data:Object.values(paymentData),

backgroundColor:[

"#2ecc71",

"#3498db",

"#9b59b6",

"#f39c12"

]

}]

},

options:{

responsive:true,

plugins:{

legend:{position:"bottom"}

}

}

});

}

/* ==========================================
        TOP PRODUCTS
========================================== */

function loadProductChart(){

if(productChart) productChart.destroy();

const productData={};

filteredOrders.forEach(row=>{

productData[row.Product]=(productData[row.Product]||0)+Number(row.Quantity);

});

const labels=Object.keys(productData).slice(0,10);

const values=Object.values(productData).slice(0,10);

productChart=new Chart(

document.getElementById("productChart"),{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Products Sold",

data:values,

backgroundColor:"#118C4F",

borderRadius:8

}]

},

options:{

responsive:true,

plugins:{legend:{display:false}}

}

});

}

/* ==========================================
        TOP CITIES
========================================== */

function loadCityChart(){

if(cityChart) cityChart.destroy();

const cityData={};

filteredOrders.forEach(row=>{

cityData[row.City]=(cityData[row.City]||0)+Number(row.Amount);

});

cityChart=new Chart(

document.getElementById("cityChart"),{

type:"bar",

data:{

labels:Object.keys(cityData),

datasets:[{

label:"Revenue",

data:Object.values(cityData),

backgroundColor:"#27ae60",

borderRadius:8

}]

},

options:{

responsive:true,

plugins:{legend:{display:false}}

}

});

}

/* ==========================================
        REVENUE BY STATE
========================================== */

function loadStateChart(){

const canvas=document.getElementById("stateChart");

if(!canvas) return;

if(stateChart) stateChart.destroy();

const stateData={};

filteredOrders.forEach(row=>{

stateData[row.State]=(stateData[row.State]||0)+Number(row.Amount);

});

stateChart=new Chart(canvas,{

type:"bar",

data:{

labels:Object.keys(stateData),

datasets:[{

label:"Revenue by State",

data:Object.values(stateData),

backgroundColor:"#16a085",

borderRadius:8

}]

},

options:{

responsive:true,

plugins:{legend:{display:false}}

}

});

}

/* ==========================================
        PROFIT TREND
========================================== */


function loadProfitChart(){

const canvas=document.getElementById("profitChart");

if(!canvas) return;

if(profitChart) profitChart.destroy();

const profitData={};

filteredOrders.forEach(row=>{

const month=row.Month;

profitData[month]=(profitData[month]||0)+Number(row.Profit);

});

profitChart=new Chart(canvas,{

type:"line",

data:{

labels:Object.keys(profitData),

datasets:[{

label:"Profit Trend",

data:Object.values(profitData),

borderColor:"#27ae60",

backgroundColor:"rgba(39,174,96,0.15)",

fill:true,

tension:0.4,

pointRadius:4

}]

},

options:{

responsive:true,

plugins:{ legend:{display:false}
}

}

});

}

/* ==========================================
   PART 3.3
   FILTERS + SEARCH + RESET
========================================== */

function populateFilters(){

fillSelect("cityFilter","City");
fillSelect("stateFilter","State");
fillSelect("departmentFilter","Department");
fillSelect("categoryFilter","Category");
fillSelect("paymentFilter","Payment");
fillSelect("statusFilter","Status");

document.getElementById("cityFilter").onchange=applyFilters;
document.getElementById("stateFilter").onchange=applyFilters;
document.getElementById("departmentFilter").onchange=applyFilters;
document.getElementById("categoryFilter").onchange=applyFilters;
document.getElementById("paymentFilter").onchange=applyFilters;
document.getElementById("statusFilter").onchange=applyFilters;

}

function fillSelect(id,column){

const select=document.getElementById(id);

select.innerHTML="<option value='All'>All</option>";

const values=[...new Set(orders.map(x=>x[column]))];

values.sort();

values.forEach(v=>{

if(v){

select.innerHTML+=`<option value="${v}">${v}</option>`;

}

});

}

/* ==========================================
   SEARCH
========================================== */

document.getElementById("searchBox").addEventListener("keyup",applyFilters);

/* ==========================================
   APPLY FILTERS
========================================== */

function applyFilters(){

const city=document.getElementById("cityFilter").value;

const state=document.getElementById("stateFilter").value;

const department=document.getElementById("departmentFilter").value;

const category=document.getElementById("categoryFilter").value;

const payment=document.getElementById("paymentFilter").value;

const status=document.getElementById("statusFilter").value;

const search=document.getElementById("searchBox").value.toLowerCase();

filteredOrders=orders.filter(row=>{

return(

(city==="All"||row.City===city)

&&

(state==="All"||row.State===state)

&&

(department==="All"||row.Department===department)

&&

(category==="All"||row.Category===category)

&&

(payment==="All"||row.Payment===payment)

&&

(status==="All"||row.Status===status)

&&

(

(row.Customer||"").toLowerCase().includes(search)

||

(row.Product||"").toLowerCase().includes(search)

||

(row.City||"").toLowerCase().includes(search)

||

(row.Category||"").toLowerCase().includes(search)

)

);

});

currentPage=1;

loadKPIs();

loadCharts();

loadTable();

// ==========================
// Highlight Selected City
// ==========================

document.querySelectorAll("circle[id^='marker-']").forEach(marker=>{
    marker.classList.remove("city-active");
});

const selectedCity=document.getElementById("cityFilter").value.toLowerCase().trim();

if(selectedCity!=="all"){

const activeMarker=document.getElementById("marker-"+selectedCity);

if(activeMarker){
activeMarker.classList.add("city-active");
}

}

}
/* ==========================================
   RESET
========================================== */

document.getElementById("resetBtn").addEventListener("click",()=>{

document.getElementById("cityFilter").value="All";

document.getElementById("stateFilter").value="All";

document.getElementById("departmentFilter").value="All";

document.getElementById("categoryFilter").value="All";

document.getElementById("paymentFilter").value="All";

document.getElementById("statusFilter").value="All";

document.getElementById("searchBox").value="";

filteredOrders=[...orders];

currentPage=1;

loadKPIs();

loadCharts();

loadTable();

});

/* ==========================================
   PART 3.4
   TABLE + PAGINATION
========================================== */

function loadTable(){

const tbody=document.getElementById("tableBody");

tbody.innerHTML="";

const start=(currentPage-1)*rowsPerPage;

const end=start+rowsPerPage;

const pageData=filteredOrders.slice(start,end);

pageData.forEach(row=>{

tbody.innerHTML+=`

<tr>

<td>${row.OrderID}</td>

<td>${row.Customer}</td>

<td>${row.State}</td>

<td>${row.City}</td>

<td>${row.Department}</td>

<td>${row.Category}</td>

<td>₹${Number(row.Amount).toLocaleString("en-IN")}</td>

<td>${row.Payment}</td>

<td>

<span class="status ${row.Status.toLowerCase()}">

${row.Status}

</span>

</td>

<td>${row.Date}</td>

</tr>

`;

});

updatePagination();

}

/* ==========================================
   PAGINATION
========================================== */

function updatePagination(){

const totalPages=Math.ceil(filteredOrders.length/rowsPerPage);

document.getElementById("pageInfo").innerHTML=

`Page ${currentPage} of ${totalPages}`;

}

document.getElementById("rowsPerPage").addEventListener("change",function(){

rowsPerPage=Number(this.value);

currentPage=1;

loadTable();

});

document.getElementById("prevBtn").addEventListener("click",()=>{

if(currentPage>1){

currentPage--;

loadTable();

}

});

document.getElementById("nextBtn").addEventListener("click",()=>{

const totalPages=Math.ceil(filteredOrders.length/rowsPerPage);

if(currentPage<totalPages){

currentPage++;

loadTable();

}

});

/* ==========================================
   PART 3.5
   EXPORT + TABLE SORT + FINAL POLISH
========================================== */

// ===============================
// EXPORT CSV
// ===============================

document.getElementById("csvBtn").addEventListener("click",()=>{

const csv=Papa.unparse(filteredOrders);

const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="DMart_Filtered_Report.csv";

a.click();

URL.revokeObjectURL(url);

});

// ===============================
// EXPORT PDF
// ===============================

document.getElementById("pdfBtn").addEventListener("click",()=>{

window.print();

});

// ===============================
// TABLE SORTING
// ===============================

const table=document.querySelector("table");

if(table){

const headers=table.querySelectorAll("th");

headers.forEach((header,index)=>{

header.style.cursor="pointer";

header.addEventListener("click",()=>{

sortTable(index);

});

});

}

function sortTable(col){

filteredOrders.sort((a,b)=>{

const keys=[

"OrderID",

"Customer",

"State",

"City",

"Department",

"Category",

"Amount",

"Payment",

"Status",

"Date"

];

const key=keys[col];

let x=a[key];

let y=b[key];

if(!isNaN(x)&&!isNaN(y)){

return Number(x)-Number(y);

}

return String(x).localeCompare(String(y));

});

loadTable();

}

// ===============================
// INDIA MAP PLACEHOLDER
// ===============================

const map = document.getElementById("indiaMap");

if (map) {
    map.innerHTML = `
        <img src="assets/india-map.svg"

style="width:100%;height:100%;object-fit:contain;">
    `;
}
// ===============================
// CONSOLE
// ===============================

console.log("===================================");

console.log("DMart Dashboard V2 Loaded");

console.log("Designed by Sanjay");

console.log("===================================");