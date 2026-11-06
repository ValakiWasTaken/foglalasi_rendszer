const byID = (id) => document.getElementById(id)

let elorefoglalt = null
async function betolt() {
    try {
        const response = await fetch("/foglalasok.json")
        elorefoglalt = await response.json()
        
    }
    catch {
        
    }
}

let manualis = JSON.parse(localStorage.getItem("foglalasok")) ?? []