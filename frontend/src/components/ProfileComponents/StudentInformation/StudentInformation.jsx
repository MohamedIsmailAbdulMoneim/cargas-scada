'use client';

import React, { useState, useEffect } from 'react';
import './StudentInformation.scss';

const AnimatedForm = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [inputs, setInputs] = useState([]);

  useEffect(() => {
    // Trigger the animation after the component mounts
    setTimeout(() => setFormVisible(true), 200);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', inputs);
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    console.log(event.current);

    // Check if the input for the selected value already exists
    if (!inputs.find((input) => input.id === selectedValue)) {
      setInputs((prevInputs) => [
        ...prevInputs,
        {
          id: selectedValue,
          label: `إدخال مرتبط لـ ${selectedValue}`,
          index: event.target.getAttribute('index'),
        },
      ]);
    }
  };

  const removeInput = (id) => {
    setInputs((prevInputs) => prevInputs.filter((input) => input.id !== id));
  };

  return (
    <div className={`form-container ${formVisible ? 'visible' : ''}`}>
      <h2 className="form-title">حساب الإستهلاك اليومي</h2>
      <form dir="rtl" className="form" onSubmit={handleSubmit}>
        {/* Governorate Input */}
        <div className="input-wrapper">
          <label htmlFor="governorate">المحافظة</label>
          <input id="governorate" name="governorate" required />
        </div>

        {/* Area Selection */}
        <div className="input-wrapper">
          <label htmlFor="area">المنطقة</label>
          <select id="area" name="area" onChange={handleSelectChange} required>
            <option value="">اختر المنطقة</option>
            <option value="east_cairo">شرق القاهرة</option>
            <option value="west_cairo">غرب القاهرة</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label htmlFor="governorate">المحطة</label>
          <input id="governorate" name="governorate" required />
        </div>

        {/* Dispenser Selection */}
        <div className="input-wrapper">
          <label htmlFor="dispenser">ديسبنسر</label>
          <select
            id="dispenser"
            name="dispenser"
            onChange={handleSelectChange}
            required
          >
            <option value="">اختر ديسبنسر</option>
            <option index="1" value="dispenser_1">
              ديسبنسر 1
            </option>
            <option index="2" value="dispenser_2">
              ديسبنسر 2
            </option>
            <option index="3" value="dispenser_3">
              ديسبنسر 3
            </option>
            <option index="4" value="dispenser_4">
              ديسبنسر 4
            </option>
          </select>
        </div>

        {/* Dynamically Added Inputs */}
        {inputs
          .map((input) => (
            <div key={input.id} className="dynamic-input-wrapper">
              <label htmlFor={input.id}>{input.label}</label>
              <input
                type="text"
                id={input.id}
                name={input.id}
                placeholder={`أدخل قيمة لـ ${input.label}`}
                required
              />
              <button
                type="button"
                className="remove-button"
                onClick={() => removeInput(input.id)}
              >
                إزالة
              </button>
            </div>
          ))
          .sort((a, b) => a.index - b.index)}

        {/* Submit Button */}
        <div className="form-footer">
          <button type="submit" className="submit-btn">
            إرسال
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnimatedForm;
