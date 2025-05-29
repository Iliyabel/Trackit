import React from 'react';
import DashboardSection from '../components/DashboardSection';

function DashboardPage() {
    return (
        <div className="dashboard-page">
            <header className='logo-header'>
                <img className="logo" src={'src/assets/logoText.svg'} alt="Trackit logo" />
            </header>

            <div className='dashboard-container'>
                
                <DashboardSection title="Dashboard">
                    <p>This is where our overview content will go.</p>
                    <p>We can add charts.</p>
                </DashboardSection>

                <DashboardSection title="Applications">
                    <ul>
                        <li>Just filler test data 1.</li>
                        <li>Just filler test data 2.</li>
                        <li>Just filler test data 3.</li>
                    </ul>
                </DashboardSection>

            </div>

        </div>
    );
}

export default DashboardPage;