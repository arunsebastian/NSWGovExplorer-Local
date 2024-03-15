import React, { useEffect, useRef } from 'react';
import './map-toolbar.scss';

export type MapToolbarProps = {
    position?: 'top' | 'bottom' | 'left' | 'right';
    stack?: 'horizontal' | 'vertical';
    children?: any;
};

enum CLASS {
    HORIZONTAL_TOP = 'h-top',
    HORIZONTAL_BOTTOM = 'h-bottom',
    VERTICAL_LEFT = 'v-left',
    VERTICAL_RIGHT = 'v-right'
}

enum STACK {
    HORIZONTAL = 's-h',
    VERTICAL = 's-v'
}

const MapToolbar: React.FC<MapToolbarProps> = (props: MapToolbarProps) => {
    const { position = 'bottom', stack, children } = props;
    const domClassRef = useRef<string>(CLASS.HORIZONTAL_BOTTOM);

    useEffect(() => {
        if (position === 'top') {
            domClassRef.current = `${CLASS.HORIZONTAL_TOP} ${
                stack === 'vertical' ? STACK.VERTICAL : ''
            }`;
            // if (stack === 'vertical') {
            //     domClassRef.current = `${CLASS.HORIZONTAL_TOP} `;
            // }
        } else if (position === 'right') {
            domClassRef.current = `${CLASS.VERTICAL_RIGHT} ${
                stack === 'horizontal' ? STACK.HORIZONTAL : ''
            }`;
            // if (stack === 'horizontal') {
            //     domClassRef.current = `${CLASS.VERTICAL_LEFT} ${STACK.HORIZONTAL}`;
            // }
        } else if (position === 'left') {
            domClassRef.current = `${CLASS.VERTICAL_LEFT} ${
                stack === 'horizontal' ? CLASS.VERTICAL_LEFT : ''
            }`;
            // if (stack === 'horizontal') {
            //     domClassRef.current = `${CLASS.VERTICAL_LEFT} ${STACK.HORIZONTAL}`;
            // }
        } else {
            domClassRef.current = `${CLASS.HORIZONTAL_BOTTOM} ${
                stack === 'vertical' ? CLASS.HORIZONTAL_BOTTOM : ''
            }`;
            // if (stack === 'vertical') {
            //     domClassRef.current = `${CLASS.HORIZONTAL_BOTTOM} ${STACK.VERTICAL}`;
            // }
        }
    }, [position, stack]);

    return (
        <div className={`map-toolbar ${domClassRef.current}`}>{children}</div>
    );
};

export default MapToolbar;
