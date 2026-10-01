"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import { company, type Product } from "@/config/company";
import imgPadrao from "@/assets/images/p-padrao.jpg";
import imgPersonalizada from "@/assets/images/p-personalizada.jpg";
import imgMoto from "@/assets/images/p-moto.jpg";
import imgOutros from "@/assets/images/p-outros.jpg";
import { gsap, useGSAP } from "@/lib/gsap";
import { HorizontalScroll, useHorizontalAnimation } from "@/motion/HorizontalScroll";
import { RevealText } from "@/motion/RevealText";
import { Plate } from "@/components/Plate/Plate";
import { RequestButton } from "@/components/Request/RequestButton";
import styles from "./ProductsHorizontal.module.css";

const IMAGES: Record<Product["image"], StaticImageData> = {
  padrao: imgPadrao,
  personalizada: imgPersonalizada,
  moto: imgMoto,
  outros: imgOutros,
};

function Panel({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const tween = useHorizontalAnimation();

  // Parallax interno atrelado ao deslocamento horizontal (containerAnimation).
  useGSAP(
    () => {
      if (!tween) return;
      const q = gsap.utils.selector(ref);
      const st = { containerAnimation: tween, trigger: ref.current, start: "left right", end: "right left", scrub: true };
      gsap.fromTo(q("[data-img]"), { xPercent: -9 }, { xPercent: 9, ease: "none", scrollTrigger: st });
      gsap.fromTo(q("[data-num]"), { xPercent: 60 }, { xPercent: -30, ease: "none", scrollTrigger: st });
      const mini = q("[data-mini]");
      if (mini.length) {
        gsap.fromTo(mini, { y: 40, rotate: -3 }, { y: -30, rotate: 2, ease: "none", scrollTrigger: st });
      }
    },
    { scope: ref, dependencies: [tween], revertOnUpdate: true },
  );

  return (
    <article ref={ref} className={styles.panel} aria-labelledby={`p-${product.id}`}>
      <div className={styles.media} data-cursor="view">
        <div className={styles.imgWrap} data-img>
          <Image
            src={IMAGES[product.image]}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 900px) 62vw, 86vw"
            placeholder="blur"
            className={styles.img}
          />
        </div>
        <div className={styles.shade} />
        {product.plate && (
          <div className={`${styles.mini} ${product.plate.variant === "moto" ? styles.miniMoto : ""}`} data-mini>
            <Plate code={product.plate.code} variant={product.plate.variant} />
          </div>
        )}
      </div>
      <span className={styles.num} data-num aria-hidden>
        {product.number}
      </span>
      <div className={styles.info}>
        <p className="mono faint">{product.number} / {String(company.products.length).padStart(2, "0")}</p>
        <h3 id={`p-${product.id}`} className={`${styles.name} h3`}>
          {product.name}
        </h3>
        <p className={styles.desc}>{product.description}</p>
        <RequestButton productId={product.id} variant="ghost">
          Solicitar este modelo
        </RequestButton>
      </div>
    </article>
  );
}

export function ProductsHorizontal() {
  const bar = useRef<HTMLSpanElement>(null);
  const section = useRef<HTMLElement>(null);

  // Os painéis ficam fora da tela na horizontal: o lazy-load nativo só os buscaria
  // no último instante. Quando a seção se aproxima, as fotos passam a carregar.
  useEffect(() => {
    const el = section.current!;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => (img.loading = "eager"));
        io.disconnect();
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={section} id="modelos" className={styles.section} aria-labelledby="modelos-title">
      <HorizontalScroll
        className={styles.pin}
        trackClassName={styles.track}
        onProgress={(p) => bar.current && (bar.current.style.transform = `scaleX(${p})`)}
        header={
          <div className={styles.progress} aria-hidden>
            <span ref={bar} />
          </div>
        }
      >
        <div className={styles.intro}>
          <RevealText as="h2" id="modelos-title" className="h2" text={"Escolha o\nacabamento."} />
          <p className={`${styles.introText} lead`}>
            Da placa padrão Mercosul à placa de moto. Deslize para ver cada modelo e peça o seu direto daqui.
          </p>
          <p className={`${styles.hint} mono faint`} aria-hidden>
            Deslize →
          </p>
        </div>
        {company.products.map((p) => (
          <Panel key={p.id} product={p} />
        ))}
      </HorizontalScroll>
    </section>
  );
}
