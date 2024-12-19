'use client';

import React, { useState, useEffect } from 'react';
import './StudentInformation.scss';
import { useFormState } from 'react-dom';
import { insertConsumptionForm } from '@/lib/consumption/consumptionLib';
import correct from '@/assets/correct.svg';
import Image from 'next/image';
import data from '@/assets/static_data/data.json';

const AnimatedForm = () => {
  const [governorate, setGovernorate] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [dispensers, setDispensers] = useState([
    { id: 'dispenser_1', label: 'Dispenser 1' },
  ]);
  const [dispensersValues, setDispensersValues] = useState({});
  const [state, formAction] = useFormState(insertConsumptionForm, {
    message: '',
    severity: '',
  });

  useEffect(() => {
    setTimeout(() => setFormVisible(true), 200);
  }, []);

  const addDispenser = () => {
    const newDispenserId = `dispenser_${dispensers.length + 1}`;
    setDispensers((prev) => [
      ...prev,
      { id: newDispenserId, label: `Dispenser ${dispensers.length + 1}` },
    ]);
    setDispensersValues((prev) => ({ ...prev, [newDispenserId]: 0 }));
  };

  const removeDispenser = (id) => {
    setDispensers((prev) => prev.filter((dispenser) => dispenser.id !== id));
    setDispensersValues((prev) => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
    });
  };

  const handleDispenserChange = (id, value) => {
    setDispensersValues((prev) => ({
      ...prev,
      [id]: value === '' ? 0 : Number(value),
    }));
  };

  const totalConsumption = Object.values(dispensersValues).reduce(
    (prev, acc) => prev + acc,
    0,
  );

  const governorates = [...new Set(data.map((col) => col.governorate))];

  const stations = data
    .filter((col) => col.governorate === governorate)
    .map((row) => row.station_name);

  return state.message !== 'Valid data' ? (
    <div className={`form-container ${formVisible ? 'visible' : ''}`}>
      <h2 className="form-title">ادخل الإستهلاك اليومي</h2>
      <form dir="rtl" className="form" action={formAction}>
        {/* Governorate Input */}
        <div className="input-wrapper">
          <label htmlFor="governorate_name">المحافظة</label>
          <select
            onChange={(e) => setGovernorate(e.target.value)}
            id="governorate_name"
            name="governorate_name"
            required
          >
            <option>اختر...</option>
            {governorates.map((gov) => (
              <option key={gov}>{gov}</option>
            ))}
          </select>
        </div>

        {/* Area Selection */}
        {/* <div className="input-wrapper">
          <label htmlFor="area">المنطقة</label>
          <select id="area" name="area_name" required>
            <option value="">اختر المنطقة</option>
            <option value="east_cairo">شرق القاهرة</option>
            <option value="west_cairo">غرب القاهرة</option>
          </select>
        </div> */}

        <div className="input-wrapper">
          <label htmlFor="station">المحافظة</label>
          <select id="station" name="station_name" required>
            <option>اختر...</option>
            {stations.map((station) => (
              <option key={station}>{station}</option>
            ))}
          </select>
        </div>

        {/* Add Dispenser Section */}
        <div className="dispenser-section">
          <label>الإستهلاك</label>
          {dispensers.map((dispenser) => (
            <div key={dispenser.id} className="dynamic-input-wrapper">
              <div className="input-container">
                <input
                  type="number"
                  placeholder={dispenser.label}
                  onChange={(e) =>
                    handleDispenserChange(dispenser.id, e.target.value)
                  }
                  value={dispensersValues[dispenser.id] || ''}
                  required
                />
                <button
                  type="button"
                  className="remove-button-icon"
                  onClick={() => removeDispenser(dispenser.id)}
                  aria-label={`Remove ${dispenser.label}`}
                >
                  {/* Remove Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="currentColor"
                  >
                    <path
                      d="M6 6L18 18M6 18L18 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="add-dispenser-btn"
            onClick={addDispenser}
          >
            + إضافة ديسبنسر
          </button>
        </div>

        <input
          name="total_consumption"
          style={{ display: 'none' }}
          value={totalConsumption}
          readOnly
        />

        {/* Submit Button */}
        <div className="form-footer">
          <button type="submit" className="submit-btn">
            إرسال
          </button>
        </div>
      </form>
    </div>
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image src={correct} alt="Correct" />
      تم تسجيل البيانات بنجاح
    </div>
  );
};

export default AnimatedForm;
