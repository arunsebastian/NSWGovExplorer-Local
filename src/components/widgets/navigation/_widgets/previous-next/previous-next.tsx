import React, { useRef, useEffect } from 'react';

import { CalciteAction } from '@esri/calcite-components-react';
import type MapView from '@arcgis/core/views/MapView';
import type SceneView from '@arcgis/core/views/SceneView';
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';

import strings from './strings';
import './previous-next.scss';
import next from '@assets/images/next.svg';
import previous from '@assets/images/previous.svg';

type PreviousNextProps = {
    view: MapView | SceneView;
};

const PreviousNext: React.FC<PreviousNextProps> = (
    props: PreviousNextProps
) => {
    const { view } = props;
    const nextRef = useRef<HTMLCalciteActionElement>();
    const prevRef = useRef<HTMLCalciteActionElement>();
    const previousNextConfig = useRef({
        isPrevExtent: false,
        isNextExtent: false,
        prevExtent: null,
        currentExtent: null,
        extentHistory: [],
        extentHistoryIndx: -1
    });

    const storeInitialExtent = () => {
        const currentState = { ...previousNextConfig.current };
        currentState.currentExtent = view.extent;
        previousNextConfig.current = currentState;
    };

    const handleNextClicked = () => {
        const currentState = { ...previousNextConfig.current };
        currentState.isNextExtent = true;
        currentState.extentHistoryIndx = currentState.extentHistoryIndx + 1;
        if (
            currentState.extentHistoryIndx >
            currentState.extentHistory.length - 1
        ) {
            // this might happen if the user clicks the zoomNext button too often too fast
            currentState.extentHistoryIndx =
                currentState.extentHistory.length - 1;
        }
        previousNextConfig.current = currentState;
        view.goTo(
            currentState.extentHistory[currentState.extentHistoryIndx]
                .currentExtent
        );
    };

    const handlePreviousClicked = () => {
        const currentState = { ...previousNextConfig.current };
        const history = currentState.extentHistory;
        const index = currentState.extentHistoryIndx;
        if (history[index].prevExtent) {
            currentState.isPrevExtent = true;
            currentState.extentHistoryIndx = index - 1;
            previousNextConfig.current = currentState;
            view.goTo(history[index].prevExtent);
        }
    };

    const handleExtentChanges = () => {
        const currentState = { ...previousNextConfig.current };
        if (currentState.isPrevExtent || currentState.isNextExtent) {
            currentState.currentExtent = view.extent;
        } else {
            currentState.prevExtent = currentState.currentExtent;
            currentState.currentExtent = view.extent;
            currentState.extentHistory.push({
                prevExtent: currentState.prevExtent,
                currentExtent: currentState.currentExtent
            });
            currentState.extentHistoryIndx =
                currentState.extentHistory.length - 1;
        }
        currentState.isPrevExtent = currentState.isNextExtent = false;
        previousNextConfig.current = currentState;
        updateNavigationButtonState();
    };

    const updateNavigationButtonState = () => {
        const currentState = previousNextConfig.current;
        const extentHistory = currentState.extentHistory;
        const extentHistoryIdx = currentState.extentHistoryIndx;

        if (extentHistory.length === 0 || extentHistoryIdx === -1) {
            prevRef.current.setAttribute('disabled', 'true');
        } else {
            prevRef.current.removeAttribute('disabled');
        }
        if (
            extentHistory.length === 0 ||
            extentHistoryIdx === extentHistory.length - 1
        ) {
            nextRef.current.setAttribute('disabled', 'true');
        } else {
            nextRef.current.removeAttribute('disabled');
        }
    };

    useEffect(() => {
        if (view) {
            view.when(() => {
                storeInitialExtent();
                reactiveUtils.when(
                    () => view.stationary === true,
                    () => {
                        handleExtentChanges();
                    }
                );
            });
        }
    }, [view]);

    return (
        <>
            <CalciteAction
                disabled
                ref={prevRef}
                className='nav-previous'
                title={strings.previous}
                label={strings.previous}
                text={strings.previous}
                onClick={handlePreviousClicked}
            >
                <img src={previous}></img>
            </CalciteAction>
            <CalciteAction
                disabled
                ref={nextRef}
                className='nav-next'
                title={strings.next}
                label={strings.next}
                text={strings.next}
                onClick={handleNextClicked}
            >
                <img src={next}></img>
            </CalciteAction>
        </>
    );
};

export default PreviousNext;
