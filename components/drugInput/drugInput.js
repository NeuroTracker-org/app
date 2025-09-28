import styles from "./drugInput.module.css";

function DrugInput({drugInfos, decNum, incNum, handleChange}){

  return(
  <div className={styles.drugInput}>
    <p>{drugInfos.molecule}</p>
    <div className={styles.inputGroup}>
      <button className={styles.btnCounter} type="button" onClick={() => decNum(drugInfos.id)}><i className="fas fa-minus"></i></button>
      <span>{drugInfos.num || 0}</span>
      <input type="number" className={styles.formControl} value={drugInfos.num} onChange={(e) => handleChange(e, drugInfos.id)} disabled/>
      <button className={styles.btnCounter} type="button" onClick={() => incNum(drugInfos.id)}><i className="fas fa-plus"></i></button>
    </div>
  </div>
  );
}

export default DrugInput;
