import React, { useEffect, useState } from 'react';

import './toolbar-group.scss';

export type ToolbarGroupProps = {
    position?: 'top' | 'bottom' | 'left' | 'right';
};

enum CLASS {
    HORIZONTAL_TOP = 'h-t',
    HORIZONTAL_BOTTOM = 'h-b',
    VERTICAL_LEFT = 'v-l',
    VERTICAL_RIGHT = 'v-r'
}

const ToolbarGroup: React.FC<ToolbarGroupProps> = (
    props: ToolbarGroupProps
) => {
    const { position } = props;
    const [domClassName, setDomClassName] = useState<string>(
        CLASS.VERTICAL_LEFT
    );

    useEffect(() => {
        setDomClassName((className: string) => {
            let newClassName = className;
            if (position === 'top') {
                newClassName = CLASS.HORIZONTAL_TOP;
            } else if (position === 'right') {
                newClassName = CLASS.VERTICAL_RIGHT;
            } else if (position === 'left') {
                newClassName = CLASS.VERTICAL_LEFT;
            } else {
                newClassName = CLASS.HORIZONTAL_BOTTOM;
            }
            return newClassName;
        });
    }, [position]);

    return <div className={`toolbar-group ${domClassName}`}></div>;
};

export default ToolbarGroup;
