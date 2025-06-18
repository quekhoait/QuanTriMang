
import './App.css';
import {Route, Routes} from 'react-router-dom'
import routes from './routes';

function App() {
  return (
    <div className="App h-[100%] bg-[#ebebeb]">
      <Routes>
        {routes.map((route, index)=>(
           <Route
            key={index}
            path={route.path}
            element={<route.page/>}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
