import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar';
import './AppShell.css';

export default function AppShell() {
    return (
        <div className='app-shell'>
            <a className='skip-link' href='#main-content'>
                Skip to main content
            </a>

            <NavBar />

            <div
                id="main-content"
                className="app-shell__content"
                tabIndex={-1}
            >
                <Outlet />
            </div>
        </div>
    );
}
