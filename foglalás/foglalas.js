const byID = (id) => document.getElementById(id)

const szolgaltatas = byID("szolgaltatas")
const hajhossz = document.querySelectorAll("input[name='hajhossz']")
// extrák
const mosas = byID("mosas")
const szakall = byID("szakall")
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

szakall.addEventListener("change", () => {
    if (szakall.checked) {
        extra += Number(szakall.value)
    }
    else {
        extra -= Number(szakall.value)
    }
    updateOsszeg()
})

function updateOsszeg() {
    if (alap != 0) {
        osszeg.innerHTML = alap * szorzo + extra * szorzo + " Ft"
    }
}

function validacio() {
    const date = new Date()
    const today = new Date(date.toISOString().split("T")[0])
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && /^(\+36|06)[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}$/.test(telefon.value) && new Date(datum.value) > today) {
        return true
    }
    else {
        return false
    }
}

foglalas.addEventListener("click", () => {
    if (validacio()) {
        let storage = JSON.parse(localStorage.getItem("foglalasok")) ?? []
        let uj = {
            "nev": nev.value,
            "email": email.value,
            "telefon": telefon.value,
            "datum": datum.value,
            "idopont": idopont.value,
            "szolgaltatas": szolgaltatas.selectedOptions[0].innerText,
            "hajhossz": document.querySelector(`label[for="${document.querySelector("input[name='hajhossz']:checked").id}"]`).innerText,
            "mosas": mosas.checked,
            "szakall": szakall.checked,
            "gondorites": gondorites.checked,
            "osszeg": osszeg.innerText
        }
        alert(`Sikeres foglalás!\nFoglalás adatai:\nNév: ${uj["nev"]}\nEmail: ${uj["email"]}\nTelefonszám: ${uj["telefon"]}\nDátum: ${uj["datum"]}\nIdőpont: ${uj["idopont"]}\nSzolgáltatás: ${uj["szolgaltatas"]}\nHajhossz: ${uj["hajhossz"]}\nExtrák:${uj["mosas"] ? "\n\tMosás/Szárítás" : ""}${uj["szakall"] ? "\n\tSzakálligazítás" : ""}${uj["gondorites"] ? "\n\tGöndörítés" : ""}\nÁr: ${uj["osszeg"]}`)
        storage.push(storage)
        localStorage.setItem("foglalasok", JSON.stringify(storage))
    }
})
















// foglalas.addEventListener("click", () => {
//     if (validacio()) {
//         let storage = JSON.parse(localStorage.getItem("foglalasok")) ?? []
        
//         // Előkészítjük az új foglalás objektumát
//         let ujFoglalas = {
//             "nev": nev.value,
//             "email": email.value,
//             "telefon": telefon.value,
//             "datum": datum.value,
//             "idopont": idopont.value,
//             "szolgaltatas": szolgaltatas.selectedOptions[0].innerText,
//             "hajhossz": document.querySelector(`label[for="${document.querySelector("input[name='hajhossz']:checked").id}"]`).innerText,
//             "mosas": mosas.checked,
//             "szakall": szakall.checked,
//             "gondorites": gondorites.checked,
//             "osszeg": osszeg.innerText,
//             "torolt": false // Soft delete miatt érdemes alapból false-ra állítani
//         }

//         storage.push(ujFoglalas)
//         localStorage.setItem("foglalasok", JSON.stringify(storage))

//         // Szolgáltatások (extrák) szöveges összefoglalója
//         let extrak = []
//         if (ujFoglalas.mosas) extrak.push("mosás/szárítás")
//         if (ujFoglalas.szakall) extrak.push("szakálligazítás")
//         if (ujFoglalas.gondorites) extrak.push("göndörítés")
//         let extrakSzoveg = extrak.length > 0 ? `, Extrák: ${extrak.join(", ")}` : ""

//         // Szép, olvasható visszajelzés a felhasználónak
//         alert(`Sikeres foglalás!

// Foglalás adatai:
// • Név: ${ujFoglalas.nev}
// • Időpont: ${ujFoglalas.datum} ${ujFoglalas.idopont}
// • Szolgáltatás: ${ujFoglalas.szolgaltatas} (${ujFoglalas.hajhossz} haj${extrakSzoveg})
// • Elérhetőség: ${ujFoglalas.email}, ${ujFoglalas.telefon}
// • Végösszeg: ${ujFoglalas.osszeg}`)
//     }
// })