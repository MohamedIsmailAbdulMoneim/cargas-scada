export class LocalStorageManager {
  constructor(itemName) {
    this.data = {
      ENGLISH_quiz: [],
      MATH_quiz: [],
      PRACTICE_quiz: [],
      SAT_quiz: []
    };
    this.itemName = itemName;
  }

  saveToLocalStorage() {
    try {
      const isKeyExist = localStorage.getItem(this.itemName);
      if (
        this.data[this.itemName].length === 0 &&
        JSON.parse(isKeyExist)?.length > 0
      ) {
        this.data[this.itemName] = [
          ...this.data[this.itemName],
          ...JSON.parse(isKeyExist),
        ];
      }
      localStorage.setItem(
        this.itemName,
        JSON.stringify(this.data[this.itemName]),
      );
    } catch (error) {
      console.error('Error saving quiz data to local storage:', error);
    }
  }

  handleAnswerChange(questionId, optionId, studentTestId) {

    // Validate input
    let updatedData = [...this.data[this.itemName]];

    const currentQuestion = updatedData.find(
      (question) => question.question_id === questionId,
    );

    if (currentQuestion) {
      currentQuestion.student_answer = optionId;
    }

    if (!currentQuestion) {
      updatedData = [
        ...updatedData,
        {
          question_id: questionId,
          student_answer: optionId ? optionId : 'Null',
          student_test_id: studentTestId,
        },
      ];
    }
    this.data[this.itemName] = updatedData;

    // Optional: Save updated data to local storage
    this.saveToLocalStorage();
  }

  removeItem() {
    this.data[this.itemName] = [];
    localStorage.removeItem(this.itemName);
  }
}
