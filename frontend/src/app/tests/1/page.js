'use server';

import MainComponent from '@/components/MainComponent/MainComponent';

const TestPage = async ({ searchParams }) => {

  return <MainComponent duration={90} testId={1} searchParams={searchParams} />;
};

export default TestPage;
