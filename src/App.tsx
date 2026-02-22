import { Button } from './components/Button'

export default function App() {
  return (
    <div className="app">
      <h1>COS 420</h1>
      <Button
        name="Click me"
        textColor="#1a1a2e"
        backgroundColor="#eee"
        activeColor="#ccc"
      />
    </div>
  )
}
