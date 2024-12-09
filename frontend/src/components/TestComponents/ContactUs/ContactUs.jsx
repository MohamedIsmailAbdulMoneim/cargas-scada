import styles from "./ContactUS.module.scss"
import Image from "next/image"
import TurFlag from "@/assets/trflag.jpg"
import sudFlag from "@/assets/sudflag.png"
import whatsappIcon from "@/assets/whatsapp.svg"

const ContactUs = () => {
    return (
        <>
            <h1>Contact apostrophe to know your results</h1>
            <h1>تواصل مع أبوستروفي لمعرفة نتائجك</h1>
            <div className={styles["container"]}>
                <div className={styles["card"]}>
                    <Image src={TurFlag} alt="Turkey Flag" className={styles["flag"]} />
                    <h2 className={styles["title"]}>TURKEY</h2>
                    <p className={styles["contact-info"]}>
                        <a href="tel:4448231" className={styles["contact-number"]}>444 8 231</a>
                        <a href="https://wa.me/4448231" className={styles["whatsapp-icon"]} target="_blank">
                            <Image src={whatsappIcon} alt="whatsapp" />
                        </a>
                    </p>
                </div>
                <div className={styles["card"]}>
                    <Image src={sudFlag} alt="Saudi Arabia Flag" className={styles["flag"]} />
                    <h2 className={styles["title"]}>SAUDI ARABIA</h2>
                    <p className={styles["contact-info"]}>
                        <a href="tel:+966566917299" className={styles["contact-number"]}>+966 56 691 7299</a>
                        <a href="https://wa.me/966566917299" className={styles["whatsapp-icon"]} target="_blank">
                            <Image src={whatsappIcon} alt="whatsapp" />
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default ContactUs