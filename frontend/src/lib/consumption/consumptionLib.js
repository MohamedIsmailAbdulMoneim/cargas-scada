'use server';

import { unstable_noStore as noStore } from 'next/cache';

const insertConsumptionForm = async (prevState, formData) => {
  const consumptionFormData = {
    governorate_name: formData.get('governorate_name'),
    area_name: formData.get('area_name'),
    station_name: formData.get('station_name'),
    total_consumption: formData.get('total_consumption'),
  };

  const isInvalidText = (text) => {
    return !text || text.trim().length < 3;
  };

  const validateConsumptionData = () => {
    if (
      isInvalidText(consumptionFormData.governorate_name) ||
      consumptionFormData.governorate_name === 'Select'
    ) {
      return { message: 'اسم المحافظة غير صحيح', severity: 'error' };
    }

    if (
      isInvalidText(consumptionFormData.area_name) ||
      consumptionFormData.area_name === 'Select'
    ) {
      return { message: 'اسم المنطقة غير صحيح', severity: 'error' };
    }

    if (
      isInvalidText(consumptionFormData.station_name) ||
      consumptionFormData.station_name === 'Select'
    ) {
      return { message: 'اسم المحطة غير صحيح', severity: 'error' };
    }

    return { message: 'Valid data', severity: 'success' };
  };

  try {
    const formValidation = validateConsumptionData();

    if (formValidation.message === 'Valid data') {
      noStore();

      const response = await fetch(
        `http://localhost:3005/api/v1/consumption/insert`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...consumptionFormData }),
        },
      );

      console.log('ok');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
    }

    return formValidation;
  } catch (error) {
    console.log(error);
  }
};

export { insertConsumptionForm };
