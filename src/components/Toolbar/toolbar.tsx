import React from 'react';
// import { icons } from './icons';

import './toolbar.scss';

export type ToolbarProps = {
    children?: any;
};

const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
    console.log(props);
    return <div className='toobar'></div>;
};

export default Toolbar;
