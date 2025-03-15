import  i18n  from "i18next";
import { initReactI18next } from "react-i18next";


i18n.use(initReactI18next).init({
    resources:{
        en:{
            translation: {
                title:"Rick and Morty Characters",
                status:"Status",
                species:"Species",
                sortBy:"Sort by",
                apply:"Apply",
                loadingMore:"Loading...",
                language:"Language",
                All:"All",
                Alive:"Alive",
                Dead:"Dead",
                unknown:"unknown",
                None:"None",
                Name:"Name",
                Origin:"Origin",
                enterSpecies: "Enter Species",
                Gender:"Gender",

            },
        },
        de:{
            translation: {
                title:"Rick und Morty Charaktere",
                status:"Status",
                species:"Spezies",
                sortBy:"Sortieren nach",
                apply:"Anwenden",
                loadingMore:"Ladt...",
                language:"Sprache",
                All:"Alle",
                Alive:"Lebendig",
                Dead:"Tot",
                unknown:"unbekannt",
                None:"Keiner",
                Name:"Name",
                Origin:"Herkunft",
                enterSpecies: "Geben Sie die Spezies",
                Gender:"Geschlecht",
            },
        },
    },
    lng:localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: {escapeValue: false},
});


export default i18n;