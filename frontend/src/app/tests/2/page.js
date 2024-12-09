'use server';

import MainComponent from '@/components/MainComponent/MainComponent';

const TestPage = async ({ searchParams }) => {

  return <MainComponent duration={45} testId={2} searchParams={searchParams} />;
};

export default TestPage;
