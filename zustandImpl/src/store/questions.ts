import { create } from 'zustand'
import { type Question } from '../types'

interface State {
  questions: Question[]
  currentQuestion: number
  fetchQuestions: (limit: number) => Promise<void>
  selectAnswer: (questionId: number, answerIndex: number) => void
}

export const useQuestionsStore = create<State>((set, get) => {
  return {
    questions: [],
    currentQuestion: 0,

    fetchQuestions: async (limit: number) => {
      const res = await fetch('http://localhost:5173/data.json')
      const json = await res.json()

      const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)
      set({ questions })
    },

    selectAnswer: (questionId: number, answerIndex: number) => {
      const { questions } = get()
      // use structureClone to clone a object
      const newQuestions = structuredClone(questions)
      // find the index of the question
      const questionIndex = newQuestions.findIndex(q => q.id == questionId)
      // get the information of the question
      const questionInfo = newQuestions[questionIndex]
      // figure it out if the user selected the correct answer
      const isCorrecUserAnswer = questionInfo.correctAnswer == answerIndex
      // change the information of the question copy
      newQuestions[questionIndex] = {
        ...questionInfo,
        isCorrecUserAnswer,
        userSelectedAnswer: answerIndex,
      }
      // update the estatus
      set({ questions: newQuestions })
    },
  }
})
