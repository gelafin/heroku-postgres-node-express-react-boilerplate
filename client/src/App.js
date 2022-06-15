import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ExampleRouteComponent from './ExampleRoute';
import MainApplication from './MainApplication';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ExampleRoute/*" element={<ExampleRouteComponent />} />
        <Route path="/*" element={<MainApplication />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
