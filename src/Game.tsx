import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useQuestionsStore } from './store/questions'
import { type Question as QuestionType } from './types'

const getBackgroundColor = (info: QuestionType, index: number) => {
  const { userSelectedAnswer, correctAnswer } = info

  // user haven't selected any yet
  if (userSelectedAnswer == null) return 'transparent'
  // user selected but is wrong
  if (index != correctAnswer && index != userSelectedAnswer)
    return 'transparent'
  // correct answer
  if (index == correctAnswer) return 'green'
  // wrong
  if (index == userSelectedAnswer) return 'red'
  // none of the above
  return 'transparent'
}

const Question = ({ info }: { info: QuestionType }) => {
  const selectAnswer = useQuestionsStore(state => state.selectAnswer)

  const createHandleClick = (answerIndex: number) => () => {
    selectAnswer(info.id, answerIndex)
  }

  return (
    <Card
      variant="outlined"
      sx={{ bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}
    >
      <Typography variant="h5">{info.question}</Typography>

      <SyntaxHighlighter language="javascript" style={gradientDark}>
        {info.code}
      </SyntaxHighlighter>

      <List sx={{ bgcolor: '#333' }} disablePadding>
        {info.answers.map((answer, index) => (
          <ListItem key={index} disablePadding divider>
            <ListItemButton
              disabled={info.userSelectedAnswer != null}
              onClick={createHandleClick(index)}
              sx={{ backgroundColor: getBackgroundColor(info, index) }}
            >
              <ListItemText primary={answer} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

export const Game = () => {
  const questions = useQuestionsStore(state => state.questions)
  const currentQuestion = useQuestionsStore(state => state.currentQuestion)

  const questionInfo = questions[currentQuestion]
  return (
    <>
      <Question info={questionInfo} />
    </>
  )
}