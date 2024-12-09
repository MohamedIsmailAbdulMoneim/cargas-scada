'use server';

import MainComponent from '@/components/MainComponent/MainComponent';

const TestPage = async ({ searchParams }) => {
  const part = searchParams.part;

  return (
    part ?
      <MainComponent testId={4} part={part} duration={part === "1" ? 90 : 45} />
      :
      <h1 style={{ textAlign: "center" }}>Link has been manipulated</h1>

  );
};

export default TestPage;
