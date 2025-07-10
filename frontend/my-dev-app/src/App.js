
import './App.css';
import {Route, Routes} from 'react-router-dom'
import routes from './routes';
import { UserProvider } from './contexts/UserContext';
import { FileProvider } from './contexts/FileContext';

function App() {
  return (
    <div className="App h-[100%] bg-[#ebebeb]">
      <UserProvider>
        <FileProvider>
            <Routes>
        {routes.map((route, index)=>(
           <Route
            key={index}
            path={route.path}
            element={<route.page/>}
          />
        ))}
      </Routes>
        </FileProvider>
      </UserProvider>
      
    </div>
  );
}

export default App;
