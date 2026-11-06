import Image from "next/image";

import basHeader from "../IMGS/bas_header.png";
import footerBand from "../IMGS/footer.png";

/** Frise de parts de pizza, entre le hero et la carte. */
export function HeaderBotaniqueBandeau() {
  return (
    <div aria-hidden className="relative z-20 mt-12 sm:mt-16 lg:mt-20">
      <div
        className="relative mx-auto w-[min(94%,52rem)] overflow-hidden sm:w-[min(88%,68rem)]"
        style={{ aspectRatio: "2136 / 324" }}
      >
        <Image
          src={basHeader}
          alt=""
          className="absolute h-auto max-w-none"
          style={{ width: "101.69%", left: "-0.7%", top: "-16.67%" }}
          sizes="100vw"
        />
      </div>
    </div>
  );
}

/** Frise de parts de pizza, en haut du pied de page. */
export function FooterPizzaBandeau() {
  return (
    <div aria-hidden className="relative mx-auto h-9 w-[min(88%,36rem)] overflow-hidden sm:h-11 sm:w-[min(70%,42rem)]">
      <Image
        src={footerBand}
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
}
