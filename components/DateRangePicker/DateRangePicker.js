import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // styles de base
import styles from "./DateRangePicker.module.css";

export default function DateRangePicker({ label, value, onChange }) {
  const [startDate, setStartDate] = useState(
    value?.start ? new Date(value.start) : null
  );
  const [endDate, setEndDate] = useState(
    value?.end ? new Date(value.end) : null
  );

  useEffect(() => {
    if (value?.start) setStartDate(new Date(value.start));
    if (value?.end) setEndDate(new Date(value.end));
  }, [value]);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange?.({
      start: start ? start.toISOString().slice(0, 10) : "",
      end: end ? end.toISOString().slice(0, 10) : "",
    });
  };

  return (
    <div className={styles.dateRange}>
      {label && <label>{label}</label>}
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        isClearable
        dateFormat="dd/MM/yyyy"
        placeholderText="Choisir une période"
        className={styles.input}
        calendarClassName={styles.calendar}
      />
    </div>
  );
}
