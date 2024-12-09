'use client'

import StudentInformation from './StudentInformation/StudentInformation';

const ProfileComponents = ({ student, testId }) => {

  return (
    <main>
      <StudentInformation student={student} testId={testId} />
    </main>
  );
};

export default ProfileComponents;
