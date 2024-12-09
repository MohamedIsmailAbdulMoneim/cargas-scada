'use client'

import { useRouter } from 'next/navigation';
import styles from "./page.module.scss"
import { useEffect } from 'react';

const MainPageComponent = ({ examLInkData, examParam }) => {
  const router = useRouter()

  const testName = examLInkData?.data?.bitrix_request



  useEffect(() => {
    if (testName === "MATH") router.push(`/tests/1/?a=${examParam}`)
    else if (testName === "ENGLISH") router.push(`/tests/2/?a=${examParam}`)
    else if (testName === "PRACTICE") router.push(`/tests/3/?a=${examParam}`)
    else if (testName === "SAT") router.push(`/tests/SAT/?a=${examParam}`)
  }, [])

  return (
    examLInkData?.message === "the requested id is not found" ?
      <div style={{ margin: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h1>This is an invalid link</h1>
        <h1>هذا الرابط غير صحيح</h1>

      </div>
      :
      <div className={styles["parent-container"]}>
        <div className={styles["spinner"]}></div>
      </div>
  )
}

export default MainPageComponent