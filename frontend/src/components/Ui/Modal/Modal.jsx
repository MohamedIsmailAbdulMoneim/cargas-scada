"use client";

import Image from "next/image";

import styles from "./Modal.module.scss";
// import closeIcon from "@/assets/close.svg";
// import Button from "../UI/Button/Button";

const Modal = ({ isOpen, children }) => {


    if (!isOpen) return null;

    return (
        <div className={styles["modal-overlay"]}>
            <form className={styles["modal-content"]}>
                Uploading File
                {children}

            </form>
        </div>
    );
};

export default Modal;