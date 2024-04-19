import React, {Children} from 'react';
import {Link} from 'react-router-dom';

interface DefaultLayoutProps {
    children: React.ReactNode;
}



export default function DefaultSignup({ children}: DefaultLayoutProps ) { 
    return (
        <>
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/Login">Login</Link>
                    </li>
                </ul>
            </nav>
        </header>
        


        <main>
            {children}
        </main>
        </>
    );
    }