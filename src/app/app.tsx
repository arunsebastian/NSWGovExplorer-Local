import React from 'react';
import ToolbarGroup from '../components/ToolbarGroup/toolbar-group';
import './app.scss';

const App: React.FC = () => {
    return (
        <div className='app-content'>
            <ToolbarGroup>
                <div> GIS</div>
                <div> GIS AI</div>
                <div> GIS AI Tools</div>
            </ToolbarGroup>
        </div>
    );
};

export default App;
