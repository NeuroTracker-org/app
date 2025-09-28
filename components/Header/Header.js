//components/Header/Header.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Header.module.css";
import { useRouter } from "next/router";

import InstallPWAButton from "@/components/InstallPWAButton/InstallPWAButton";

export default function Header() {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);
    const [installable, setInstallable] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navigateTo = (path) => {
        router.push(path);
    };

    return (
        <header className={`${styles.globalHeader} ${isScrolled ? styles.scrolled : ""} ${installable ? styles.showInstall : ""}`}>
            <nav className={styles.nav}>
                <div className={styles.logo} onClick={() => navigateTo("/")}>
                    <img src="/monogram.svg" alt="NeuroTracker Logo monogram" />
                    <img src="/wordmark.svg" alt="NeuroTracker Logo wordmark" />
                </div>
                <InstallPWAButton onInstallableChange={setInstallable} />
            </nav>
        </header>
    );
}