import { Open_Sans, Roboto, Alegreya, Montserrat_Alternates } from "next/font/google";

//fonts 
export const headers = Montserrat_Alternates({weight: "400", subsets: [ `latin`, `latin-ext`]})
export const title = Roboto({weight: "400", subsets: ["latin", "latin-ext"]})
export const navs = Alegreya({weight:"400", subsets: [ "latin", "latin-ext"]})
export const weighted_title = Roboto ({weight: "variable", subsets: [ "latin", "latin-ext"]})
export const body_text = Open_Sans ({weight: "variable", subsets: [ "latin", "latin-ext"]})