// src/App.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routes';
import { DateProvider } from './context/DateContext';
function App() {
  return (
    <BrowserRouter>
<DateProvider>
<AppRoutes />
</DateProvider>
    </BrowserRouter>
  );
}

export default App;
