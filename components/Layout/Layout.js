import { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import RecordButton from "@/components/recordButton/recordButton";
import RecordModal from "@/components/recordModal/recordModal";

export default function Layout({ children }) {
  const router = useRouter();
  const [isOpenRecord, setIsOpenRecord] = useState(false);
  const openModalRecord = () => setIsOpenRecord(true);
  const hideModalRecord = () => setIsOpenRecord(false);

  // if (router.pathname === "/records/[id]" || router.pathname === "/help" || router.pathname === "/settings") {
  //   return(
  //     <div className="layout noPadding">
  //       <Header />
  //       {children}
  //     </div>
  //   );
  // }

  if (router.pathname === "/reports/[id]") {
    return (
      <>
        <Header />
        <div className="layout noFooter">
          <RecordModal isOpen={isOpenRecord} hide={hideModalRecord} />
          <>{children}</>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="layout">
        <RecordModal isOpen={isOpenRecord} hide={hideModalRecord} />
        <>{children}</>
      </div>
      <RecordButton openModalRecord={openModalRecord} />
    </>
  );
}
