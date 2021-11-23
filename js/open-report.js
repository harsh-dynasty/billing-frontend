var url = "http://localhost:4000/vouchers"
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const voucherid = urlParams.get('id');


const totalItems = document.getElementById("total-items")
const totalWeight = document.getElementById("total-weight")
const amtWoTaxes = document.getElementById("amt-wo-taxes")
const sgst = document.getElementById("sgst")
const cgst = document.getElementById("cgst")
const totalAmt = document.getElementById("total-amt")

const customerName = document.getElementById("customerName")
const address = document.getElementById("address")
const contactno = document.getElementById("contactno")
const voucherDate = document.getElementById("voucher-date")

const itemTable = document.getElementById("items-table")

fetch(url + "/" + voucherid)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        const billingTotal = data.billingTotal
        const taxes = data.billingTotal.taxes

        amtWoTaxes.innerText = billingTotal.AmtWithoutTaxes
        // totalWeight.innerText = billingTotal.totalWt
        // totalItems.innerText = billingTotal.totalItems
        sgst.innerText = taxes.hallMark.sgst + taxes.items.sgst
        cgst.innerText = taxes.hallMark.cgst + taxes.items.cgst
        totalAmt.innerText = billingTotal.totalAmt

        customerName.innerText = data.customerName
        address.innerText = data.address
        contactno.innerText = data.contactNo
        voucherDate.innerText = new Date(data.date).toDateString()
        let totalGoldAmt = 0
        let totalSilverAmt = 0

        data.items.forEach(({ itemDesc, hsn, purity, pcs, netWt, rate, makingCharges, amt }, index) => {
            console.log(amt)
            // if (hsn == 71139)
            //     totalGoldAmt += amt
            // else
            totalGoldAmt += amt
            itemTable.innerHTML += `<tr>
           <th scope="row">${index + 1}</th>
           <td>${itemDesc}</td>
           <td>${hsn}</td>
           <td>${purity}</td>
           <td>${pcs}</td>
           <td>${netWt}</td>
           <td>${rate}</td>
           <td>${makingCharges}</td>
           <td>${amt}</td>


         </tr>`
        });
        const hallMark = data.hallMark
        itemTable.innerHTML += `<tr>
       <td></td>
           <th scope="row">Hallmark Charges</th>
           
           <td></td>
           <td></td>
           <td>${hallMark.pcs}</td>
           <td></td>
           <td>${hallMark.rate}</td>
           <td></td>
           <td>${hallMark.total}</td>


         </tr>`
        document.getElementById("hallmark-total").innerText = hallMark.total
        document.getElementById("item-total").innerText = totalGoldAmt

        document.getElementById("item-sgst").innerText += "  " + taxes.items.sgst
        document.getElementById("item-cgst").innerText += "  " + taxes.items.sgst

        document.getElementById("hallmark-sgst").innerText += "  " + taxes.hallMark.sgst
        document.getElementById("hallmark-cgst").innerText += "  " + taxes.hallMark.cgst

        document.getElementById("hallmark-final").innerText = hallMark.total + 2 * taxes.hallMark.sgst
        document.getElementById("item-final").innerText = totalGoldAmt + 2 * taxes.items.sgst




    })