import type React from 'react';
import NavBar from './features/NavBar';
import { Outlet } from 'react-router';

const App: React.FC = () => {
    return (
        <div className="pb-[100px] relative">
            <Outlet />

            <NavBar />
        </div>
    );
};

export default App;
