const byID = (id) => document.getElementById(id)

const szolgaltatas = byID("szolgaltatas")
const hajhossz = document.querySelectorAll("input[name='hajhossz']")
// extrák
const mosas = byID("mosas")
const festes = byID("festes")
const gondorites = byID("gondorites")
// idő
const datum = byID("datum")
const idopont = document.querySelector("input[name='ido']")
// adatok
const nev = byID("nev")
const email = byID("email")
const telefon = byID("telefon")
//kimenet
const osszeg = byID("osszeg")
const foglalas = byID("foglalas")

let alap = 0
let szorzo = 1
let extra = 0

szolgaltatas.addEventListener("change", () => {
    alap = szolgaltatas.value
    updateOsszeg()
})

hajhossz.forEach(radio => {
    radio.addEventListener("change", () => {
        szorzo = radio.value
        updateOsszeg()
    })
});

mosas.addEventListener("change", () => {
    if (mosas.checked) {
        extra += Number(mosas.value)
    }
    else {
        extra -= Number(mosas.value)
    }
    updateOsszeg()
})

gondorites.addEventListener("change", () => {
    if (gondorites.checked) {
        extra += Number(gondorites.value)
    }
    else {
        extra -= Number(gondorites.value)
    }
    updateOsszeg()
})

festes.addEventListener("change", () => {
    if (festes.checked) {
        extra += Number(festes.value)
    }
    else {
        extra -= Number(festes.value)
    }
    updateOsszeg()
})

function updateOsszeg() {
    if (alap != 0) {
        osszeg.innerHTML = alap * szorzo + extra *szorzo + " Ft"
    }
}