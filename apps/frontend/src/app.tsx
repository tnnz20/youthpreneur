import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/about';
import HomePage from './pages/home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
