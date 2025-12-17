import { useState } from 'react'
import Routing from './routes/Routing'
import TokenWatcher from './components/sesionModal/TokenWatcher'

function App() {

  return (
    <div>
      <TokenWatcher />
      <Routing/>
    </div>
  )
}

export default App


