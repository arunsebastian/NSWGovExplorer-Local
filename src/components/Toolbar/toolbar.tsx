import React from 'react';
import './toolbar.scss';

export type ToolbarProps = {
    children?: any;
};
// onClick={(evt) => evt.stopImmediatePropagation();evt.preventDefault()}
const Toolbar: React.FC<ToolbarProps> = (props: ToolbarProps) => {
    const { children } = props;
    return <div className='toolbar'>{children}</div>;
};

export default Toolbar;
