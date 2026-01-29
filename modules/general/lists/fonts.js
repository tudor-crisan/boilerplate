import { Poppins } from "next/font/google";
import { Baloo_2 } from "next/font/google";
import { Quicksand } from "next/font/google";
import { Nunito } from "next/font/google";
import { Fredoka } from "next/font/google";
import { Kanit } from "next/font/google";
import { Rubik } from "next/font/google";
import { Montserrat } from "next/font/google";
import { Mulish } from "next/font/google";
import { Sora } from "next/font/google";
import { Manrope } from "next/font/google";
import { Urbanist } from "next/font/google";
import { Varela_Round } from "next/font/google";
import { Readex_Pro } from "next/font/google";
import { Asap } from "next/font/google";
import { Exo_2 } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Be_Vietnam_Pro } from "next/font/google";
import { Lato } from "next/font/google";
import { Inter } from "next/font/google";
import { Cabin } from "next/font/google";
import { Tajawal } from "next/font/google";
import { Sen } from "next/font/google";

const quicksand = Quicksand({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const baloo = Baloo_2({ weight: ["400", "600", "700"], subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "600", "700"], subsets: ["latin"] });
const nunito = Nunito({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});
const fredoka = Fredoka({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const kanit = Kanit({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const mulish = Mulish({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const sora = Sora({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});
const manrope = Manrope({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});
const urbanist = Urbanist({
  weight: ["300", "400", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const varelaRound = Varela_Round({ weight: "400", subsets: ["latin"] });
const readexPro = Readex_Pro({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const asap = Asap({ weight: ["300", "400", "600", "700"], subsets: ["latin"] });
const exo2 = Exo_2({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});
const dmSans = DM_Sans({ weight: ["400", "500", "700"], subsets: ["latin"] });
const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"] });
const inter = Inter({
  weight: ["300", "400", "600", "700"],
  subsets: ["latin"],
});
const cabin = Cabin({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const tajawal = Tajawal({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin"],
});
const sen = Sen({ weight: ["400", "600", "700", "800"], subsets: ["latin"] });

export const fontMap = {
  quicksand: "Quicksand",
  baloo: "Baloo 2",
  poppins: "Poppins",
  nunito: "Nunito",
  fredoka: "Fredoka",
  kanit: "Kanit",
  rubik: "Rubik",
  montserrat: "Montserrat",
  mulish: "Mulish",
  sora: "Sora",
  manrope: "Manrope",
  urbanist: "Urbanist",
  varelaRound: "Varela Round",
  readexPro: "Readex Pro",
  asap: "Asap",
  exo2: "Exo 2",
  dmSans: "DM Sans",
  beVietnam: "Be Vietnam Pro",
  lato: "Lato",
  inter: "Inter",
  cabin: "Cabin",
  tajawal: "Tajawal",
  sen: "Sen",
};

const fonts = {
  quicksand,
  baloo,
  poppins,
  nunito,
  fredoka,
  kanit,
  rubik,
  montserrat,
  mulish,
  sora,
  manrope,
  urbanist,
  varelaRound,
  readexPro,
  asap,
  exo2,
  dmSans,
  beVietnam,
  lato,
  inter,
  cabin,
  tajawal,
  sen,
};

export default fonts;
