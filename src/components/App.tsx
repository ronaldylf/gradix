import TimeTableProvider from '@utils/TimeTableContext'
import InputChair from './InputChair'
import MainTable from './MainTable'
import Introduction from './Introduction'
import Amount from './Amount'
import VerticalLine from './ui/vertical-line'
import ClearTable from './ClearTable'
import { Button } from './ui/button'
import { Github, Mail } from 'lucide-react'
import Menu from './Menu'

function App() {
  return (
    <div className='flex flex-col w-max mx-auto mt-10'> 
      <Menu/>
      
      <div className='
      flex
      justify-around
      gap-10
        '>
        <TimeTableProvider>
          <div className='
            flex
            flex-col
            gap-4
            font-sans
          '>
            <InputChair />
            <div className='flex gap-3 items-center'>
              <Amount/>
              <ClearTable/>
            </div>
            <MainTable/>
          </div>
        </TimeTableProvider>
        <VerticalLine/>
        <Introduction/>
      </div>
    </div>
  )
}

export default App
