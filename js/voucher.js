const url = "http://localhost:4000/vouchers"
let voucher = {}
let items = []
const taxes = { hallMark: { sgst: 0, cgst: 0 }, items: { sgst: 0, cgst: 0 } }
let hallMark = { pcs: 0, rate: 0, total: 0 }
let totalWt = 0
let totalItems = 0
let AmtWithoutTaxes = 0
let totalAmt = 0
let jewelleryTotalwoTaxes = 0
let jewelleryTotal = 0

let rowNo = 0
const customerName = document.getElementById("customerName")
const address = document.getElementById("address")
const contactNo = document.getElementById("contactNo")
const date = document.getElementById("date")

const hallMarkTotal = document.getElementById("hallmark-total")
const hallMarkSgst = document.getElementById("hallmark-sgst")
const hallMarkCgst = document.getElementById("hallmark-cgst")
const hallMarkFinal = document.getElementById("hallmark-final")

const itemTotal = document.getElementById("item-total")
const itemSgst = document.getElementById("item-sgst")
const itemCgst = document.getElementById("item-cgst")
const itemFinal = document.getElementById("item-final")

const amtWoTaxes = document.getElementById("amt-wo-taxes")
const sgst = document.getElementById("sgst")
const cgst = document.getElementById("cgst")
const finalAmt = document.getElementById("total-amt")

const hallmarkPcs = document.getElementById('hallmark-pcs')
const hallmarkRate = document.getElementById('hallmark-rate')

document.getElementById("add-item-btn").addEventListener("click", addNewItem)
document.getElementById("add-hallmark-btn").addEventListener("click", addHallmarkCharges)


function addNewItem() {
    const itemDesc = $("#item-desc").val()
    const hsn = $("#hsn").val()
    const purity = Number($("#purity").val())
    const pcs = Number($("#quantity").val())
    const netWt = Number($("#net-wt").val())
    const rate = Number($("#rate").val())
    const makingCharges = Number($("#making-charges").val())
    const amt = Number((makingCharges + (rate / 10) * netWt).toFixed(2))
    items.push({ itemDesc, hsn, purity, pcs, netWt, rate, makingCharges, amt })

    totalWt += netWt
    totalItems += pcs

    jewelleryTotalwoTaxes += amt
    let itemEachTax = Number((amt * 0.015).toFixed(2))
    //round off
    itemEachTax = Number(itemEachTax.toFixed(2))

    jewelleryTotal += Number((amt + itemEachTax * 2).toFixed(2))
    AmtWithoutTaxes += Number(amt)
    totalAmt += Number((amt + itemEachTax * 2).toFixed(2))
    totalAmt = Number(totalAmt.toFixed(2))

    itemTotal.innerText = jewelleryTotalwoTaxes
    itemFinal.innerText = jewelleryTotal

    amtWoTaxes.innerText = AmtWithoutTaxes
    finalAmt.innerText = totalAmt

    taxes.items.sgst += Number(itemEachTax.toFixed(2))
    taxes.items.cgst += Number(itemEachTax.toFixed(2))

    itemSgst.innerText = "(1.50%)  " + taxes.items.sgst
    itemCgst.innerText = "(1.50%)  " + taxes.items.cgst

    sgst.innerText = Number((taxes.items.sgst + taxes.hallMark.sgst).toFixed(2))
    cgst.innerText = Number((taxes.items.cgst + taxes.hallMark.cgst).toFixed(2))

    rowNo++

    const newItemRow = `<tr id="R${rowNo}">
    <td >${itemDesc}</td>
    
    <td>${hsn}</td>
    <td>${purity}</td>
    <td>${pcs}</td>
    <td>${netWt}</td>
    <td>${rate}</td>
    <td>${makingCharges}</td>

    <td>${amt}</td>
    <td><button class="remove-item-btn"><i class="fa fa-trash primary"></i></button></td>
  </tr>`

    if (document.getElementById("hallmark-row"))
        $("#hallmark-row").before(newItemRow)
    else
        $("#add-form").before(newItemRow)


}

function addHallmarkCharges() {
    const pcs = Number(hallmarkPcs.value)
    const rate = Number(hallmarkRate.value)
    const total = pcs * rate
    let hallMarkEachtax = total * (0.09)

    //roundoff
    hallMarkEachtax = Number(hallMarkEachtax.toFixed(2))

    hallMark = { pcs, rate, total }
    hallMarkTotal.innerText = total
    hallMarkSgst.innerText = "(9.00%)  " + hallMarkEachtax
    hallMarkCgst.innerText = "(9.00%)  " + hallMarkEachtax
    hallMarkFinal.innerText = total + hallMarkEachtax * 2

    AmtWithoutTaxes += total
    totalAmt += Number((total + hallMarkEachtax * 2).toFixed(2))
    console.log(typeof (hallMarkEachtax))

    amtWoTaxes.innerText = AmtWithoutTaxes
    finalAmt.innerText = totalAmt
    taxes.hallMark.sgst = Number(hallMarkEachtax.toFixed(2))
    taxes.hallMark.cgst = Number(hallMarkEachtax.toFixed(2))

    sgst.innerText = taxes.items.sgst + taxes.hallMark.sgst
    cgst.innerText = taxes.items.cgst + taxes.hallMark.cgst


    $("#add-form").before(`<tr id="hallmark-row">
    <th scope="row" colspan="3">Hallmark Charges</th>
    
    <td>${pcs}</td>
    <td></td>
    <td>${rate}</td>
    <td></td>
    <td>${total}</td>
    <td><button onclick="removeHallmark()"><i class="fa fa-trash primary"></i></button></td>
  </tr>`)

    $("#hallmark-form").hide()
}

document.getElementById("submit-btn").addEventListener('click', postVoucher)
function postVoucher() {
    voucher = {
        customerName: customerName.value,
        address: address.value,
        contactNo: contactNo.value,
        date: date.value,
        hallMark,
        billingTotal: {
            totalItems,
            totalWt,
            AmtWithoutTaxes,
            taxes,
            totalAmt

        },
        items
    }
    // console.log(voucher)
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(voucher),
        headers: {
            'Content-Type': 'application/json'
        }

    }).then(res => res.json())
        .then(({ id }) => {
            alert("New Voucher Added.")
            window.location.href = `./open-report.html?id=${id}`
        })
}


function removeHallmark() {
    $("#hallmark-row").remove()
    $("#hallmark-form").show()

    AmtWithoutTaxes = Number(jewelleryTotalwoTaxes.toFixed(2))
    totalAmt = Number(jewelleryTotal.toFixed(2))

    hallMark = { pcs: 0, rate: 0, total: 0 }
    taxes.hallMark = { sgst: 0, cgst: 0 }

    hallMarkTotal.innerText = 0
    hallMarkSgst.innerText = "(9.00%)  0"
    hallMarkCgst.innerText = "(9.00%)  0"
    hallMarkFinal.innerText = 0

    amtWoTaxes.innerText = AmtWithoutTaxes
    sgst.innerText = Number((taxes.items.sgst).toFixed(2))
    cgst.innerText = Number((taxes.items.cgst).toFixed(2))
    finalAmt.innerText = totalAmt

}

function removeItem(index) {
    console.log(index)
    totalItems--
    const removedItem = items[index]
    items.splice(index, 1)

    const list = document.getElementById("items-table")
    list.removeChild(list.childNodes[index])

}

$(document).on('click', ".remove-item-btn", function () {

    const id = $(this).parent().parent().attr('id')
    $(`#${id}`).remove()
    var index = id.slice(1) - 1
    var { amt, pcs, netWt } = items[index]
    items.splice(index, 1)

    jewelleryTotalwoTaxes -= amt
    jewelleryTotalwoTaxes = Number(jewelleryTotalwoTaxes.toFixed(2))

    let itemTax = amt * (0.015)
    let itemAmtWithTax = amt + itemTax * 2

    jewelleryTotal -= itemAmtWithTax
    jewelleryTotal = Number(jewelleryTotal.toFixed(2))

    totalamt = jewelleryTotal + hallMark.total + taxes.hallMark.sgst * 2
    AmtWithoutTaxes = jewelleryTotalwoTaxes + hallMark.total

    totalAmt = Number(totalAmt.toFixed(2))
    AmtWithoutTaxes = Number(AmtWithoutTaxes.toFixed(2))

    totalItems -= pcs
    totalWt -= netWt
    totalWt = Number(totalWt.toFixed(2))

    let newTax = taxes.items.sgst - itemTax
    newTax = Number(newTax.toFixed(2))

    taxes.items = { sgst: newTax, cgst: newTax }

    itemTotal.innerText = jewelleryTotalwoTaxes
    itemFinal.innerText = jewelleryTotal
    itemSgst.innerText = "(1.50%) " + newTax
    itemCgst.innerText = "(1.50%) " + newTax

    amtWoTaxes.innerText = AmtWithoutTaxes
    sgst.innerText = newTax + taxes.hallMark.sgst * 2
    cgst.innerText = newTax + taxes.hallMark.sgst * 2
    finalAmt.innerText = totalAmt



    //re-assign ids to rows
    // var rows = $("#items-table").children()
    // for (var i = 0; i < items.length - 1; i++) {
    //     console.log($(rows[i]).attr('id'))
    // }

})

