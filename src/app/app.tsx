import React from 'react';
import ToolbarGroup from '../components/ToolbarGroup/toolbar-group';

import './app.scss';

const App: React.FC = () => {
    return (
        <div className='app-content'>
            <ToolbarGroup />
        </div>
    );
};

export default App;
