var url = 'http://localhost:4000/vouchers'
const voucherTable = document.getElementById('vouchers-table')
const customerName = document.getElementById('customerName')
const fromDate = document.getElementById('from')
const toDate = document.getElementById('to')
const dateFilter = document.getElementById('datefilter')


function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

customerName.addEventListener('keyup', debounce(() => getVouchers()))
fromDate.addEventListener('change', debounce(() => getVouchers()))
toDate.addEventListener('change', debounce(() => getVouchers()))
dateFilter.addEventListener('change', debounce(() => getVouchers()))
getVouchers()
function getVouchers() {
    var newUrl = url
    voucherTable.innerHTML = ``
    if (dateFilter.checked)
        newUrl += `?from=${fromDate.value}&to=${toDate.value}`

    if (customerName.value.length > 0) {
        if (dateFilter.checked) newUrl += `&`
        else newUrl += `?`
        newUrl += `customerName=${customerName.value}`
    }
    console.log(newUrl)
    fetch(newUrl)
        .then(res => res.json())
        .then(data => {
            if (data.length == 0) voucherTable.innerHTML = `<p>No records found</p></div>`;
            else
                data.forEach(row => {
                    voucherTable.innerHTML += `
                <tr>
               
                          <td>${new Date(row.date).toDateString()}</td>
                          <td>${row.customerName}</td>
                          <td>${row.totalItems}</td>
                          <td>${row.totalWt}</td>
                          <td>${row.totalAmt}</td>
                          
                          <td>
                            <a class="btn" href="./open-report.html?id=${row.id}"
                              ><i class="fa fa-search"></i
                            ></a>
                          </td>
                        </tr>`
                });
        })
}

