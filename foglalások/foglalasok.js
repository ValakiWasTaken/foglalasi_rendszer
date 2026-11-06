const byID = (id) => document.getElementById(id)

document.addEventListener("scroll", () => {
    const scrollUpButton = document.getElementById("scrollUp")
    if (window.scrollY > 0) {
        scrollUpButton.style.opacity = 1
    }
    else {
        scrollUpButton.style.opacity = 0
    }
})

let elorefoglalt = null
async function betolt() {
    try {
        const response = await fetch("/foglalasok.json")
        elorefoglalt = await response.json()
        feltolt()
    }
    catch {
        elorefoglalt = []
        feltolt()
    }
}
betolt()

let mode = "tablazat"
const valtas = byID("valtas")
const foglalasok = byID("foglalasok")

const nev_szures = byID("nev_szures")
const szolgaltatas_szures = byID("szolgaltatas_szures")

let rendezes_mezo = null
let rendezes_irany = "asc"

valtas.addEventListener("click", () => {
    if (mode == "tablazat") {
        mode = "kartya"
        valtas.innerText = "Váltás táblázatos nézetre"
    }
    else {
        mode = "tablazat"
        valtas.innerText = "Váltás kártyás nézetre"
    }
    feltolt()
})

if (nev_szures) nev_szures.addEventListener("input", feltolt)
if (szolgaltatas_szures) szolgaltatas_szures.addEventListener("change", feltolt)

foglalasok.addEventListener("click", (esemeny) => {
    if (esemeny.target.classList.contains("delete") || (esemeny.target.tagName === "BUTTON" && esemeny.target.classList.contains("btn-danger"))) {
        const torles_index = esemeny.target.getAttribute("data-index")
        const forras_tipus = esemeny.target.getAttribute("data-forras")
        
        if (torles_index !== null && forras_tipus !== null) {
            softTorles(parseInt(torles_index), forras_tipus)
        }
    }

    const fejlec_elem = esemeny.target.closest(".header-col")
    if (mode == "tablazat" && fejlec_elem) {
        const mezo_nev = fejlec_elem.getAttribute("data-mezo")
        if (mezo_nev) {
            if (rendezes_mezo === mezo_nev) {
                rendezes_irany = rendezes_irany === "asc" ? "desc" : "asc"
            } else {
                rendezes_mezo = mezo_nev
                rendezes_irany = "asc"
            }
            feltolt()
        }
    }
})

// Soft delete megvalósítása
function softTorles(index, forrasTipus) {
    if (forrasTipus === "manualis") {
        let manualis_foglalasok = JSON.parse(localStorage.getItem("foglalasok")) ?? []
        if (manualis_foglalasok[index]) {
            manualis_foglalasok[index].torolt = true // Megjelöljük töröltként
            localStorage.setItem("foglalasok", JSON.stringify(manualis_foglalasok))
        }
    } else if (forrasTipus === "elorefoglalt") {
        if (elorefoglalt && elorefoglalt[index]) {
            elorefoglalt[index].torolt = true // Memóriában megjelöljük töröltként
        }
    }
    feltolt()
}

function feltolt() {
    let manualis_foglalasok = JSON.parse(localStorage.getItem("foglalasok")) ?? []
    
    // Előkészítjük az adatokat a forrás és index beállításával
    const elorefoglalt_adatok = (elorefoglalt ?? []).map((elem, index) => ({ 
        ...elem, 
        _forrasTipus: "elorefoglalt", 
        _eredetiIndex: index 
    }))

    const manualis_adatok = manualis_foglalasok.map((elem, index) => ({ 
        ...elem, 
        _forrasTipus: "manualis", 
        _eredetiIndex: index 
    }))

    let osszes_foglalas = [...elorefoglalt_adatok, ...manualis_adatok]

    const kereses_szoveg = nev_szures ? nev_szures.value.toLowerCase() : ""
    const szolgaltatas_kivalasztott = szolgaltatas_szures ? szolgaltatas_szures.value : ""

    let szurt_foglalasok = osszes_foglalas.filter(foglalas => {
        // Soft delete ellenőrzés: ha a torolt tulajdonság true, kiszűrjük!
        if (foglalas.torolt === true) {
            return false
        }

        const nev_egyezik = foglalas["nev"].toLowerCase().includes(kereses_szoveg) || foglalas["email"].toLowerCase().includes(kereses_szoveg)
        const szolgaltatas_egyezik = szolgaltatas_kivalasztott === "" || foglalas["szolgaltatas"] === szolgaltatas_kivalasztott
        return nev_egyezik && szolgaltatas_egyezik
    })

    if (rendezes_mezo) {
        szurt_foglalasok.sort((foglalas_a, foglalas_b) => {
            let ertek_a = ""
            let ertek_b = ""

            if (rendezes_mezo === "nev") {
                ertek_a = foglalas_a["nev"] || ""
                ertek_b = foglalas_b["nev"] || ""
            } else if (rendezes_mezo === "idopont") {
                ertek_a = `${foglalas_a["datum"]} ${foglalas_a["idopont"]}`
                ertek_b = `${foglalas_b["datum"]} ${foglalas_b["idopont"]}`
            } else if (rendezes_mezo === "szolgaltatas") {
                ertek_a = foglalas_a["szolgaltatas"] || ""
                ertek_b = foglalas_b["szolgaltatas"] || ""
            } else if (rendezes_mezo === "email") {
                ertek_a = foglalas_a["email"] || ""
                ertek_b = foglalas_b["email"] || ""
            }

            const osszehasonlitas = ertek_a.localeCompare(ertek_b, "hu", { numeric: true })
            return rendezes_irany === "asc" ? osszehasonlitas : -osszehasonlitas
        })
    }

    foglalasok.innerHTML = ""

    if (mode == "tablazat") {
        foglalasok.classList.remove("cards")
        
        const nyillistazas = (mezo_nev) => {
            if (rendezes_mezo === mezo_nev) {
                return rendezes_irany === "asc" 
                    ? '<span style="display: inline-flex; flex-direction: column; vertical-align: middle; line-height: 0.7; font-size: 0.65em; margin-left: 4px;"><span>▲</span><span style="opacity: 0.2;">▼</span></span>'
                    : '<span style="display: inline-flex; flex-direction: column; vertical-align: middle; line-height: 0.7; font-size: 0.65em; margin-left: 4px;"><span style="opacity: 0.2;">▲</span><span>▼</span></span>'
            }
            return '<span style="display: inline-flex; flex-direction: column; vertical-align: middle; line-height: 0.7; opacity: 0.4; font-size: 0.65em; margin-left: 4px;"><span>▲</span><span>▼</span></span>'
        }

        foglalasok.innerHTML += `
        <div class="row header_row">
        <div class="col header-col" data-mezo="nev" style="cursor:pointer; user-select:none;">Név${nyillistazas("nev")}</div>
        <div class="col header-col" data-mezo="idopont" style="cursor:pointer; user-select:none;">Időpont${nyillistazas("idopont")}</div>
        <div class="col header-col" data-mezo="szolgaltatas" style="cursor:pointer; user-select:none;">Szolgáltatás${nyillistazas("szolgaltatas")}</div>
        <div class="col header-col" data-mezo="email" style="cursor:pointer; user-select:none;">Adatok${nyillistazas("email")}</div>
        <div class="col">Törlés</div>
        </div>
        `
        szurt_foglalasok.forEach(foglalas => {
            foglalasok.innerHTML += `
            <div class="row body_row">
            <div class="col">${foglalas["nev"]}</div>
            <div class="col">${foglalas["datum"]}; ${foglalas["idopont"]}</div>
            <div class="col">${foglalas["szolgaltatas"]}, ${foglalas["hajhossz"]} haj${foglalas["mosas"] ? ", +mosás/szárítás" : ""}${foglalas["szakall"] ? ", +szakálligazítás" : ""}${foglalas["gondorites"] ? ", +göndörítés" : ""}${foglalas["festes"] ? ", +festés" : ""}, összesen: ${foglalas["osszeg"]}</div>
            <div class="col">${foglalas["email"]}, ${foglalas["telefon"]}</div>
            <div class="col"><button class="btn btn-danger delete" data-index="${foglalas._eredetiIndex}" data-forras="${foglalas._forrasTipus}" style="width: 3em; height:3em">X</button></div>
            </div>
            `
        });
    }
    else if (mode == "kartya") {
        foglalasok.classList.add("cards")
        szurt_foglalasok.forEach(foglalas => {
            foglalasok.innerHTML += `
            <div class="card" style="width: 22rem;">
            <div class="card-body">
            <h5 class="card-title">${foglalas["nev"]}</h5>
            <p class="card-text">${foglalas["datum"]}; ${foglalas["idopont"]}</p>
            <p class="card-text">${foglalas["szolgaltatas"]}, ${foglalas["hajhossz"]} haj${foglalas["mosas"] ? ", +mosás/szárítás" : ""}${foglalas["szakall"] ? ", +szakálligazítás" : ""}${foglalas["gondorites"] ? ", +göndörítés" : ""}${foglalas["festes"] ? ", +festés" : ""}, összesen: ${foglalas["osszeg"]}</p>
            <p class="card-text">${foglalas["email"]}, ${foglalas["telefon"]}</p>
            </div>
            <input type="button" class="btn btn-danger delete" data-index="${foglalas._eredetiIndex}" data-forras="${foglalas._forrasTipus}" value="Törlés">
            </div>
            `
        })
    }
}