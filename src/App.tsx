import { BrowserRouter } from 'react-router-dom'
import { Header } from '@/layout/Header'
import { Main } from '@/layout/Main'
import { Footer } from '@/layout/Footer'
import { ThemeProvider } from '@/theme/ThemeProvider'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-dvh flex flex-col font-sans w-full">
          <Header />
          <Main />
          <Footer />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  )
}
