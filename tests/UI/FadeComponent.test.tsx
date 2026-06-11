//2026-06-11 : Tests for FadeComponent

import FadeComponent from "@/ui/FadeComponent";

import React from "react";
import { render } from '@testing-library/react-native';
import { Text } from "react-native";

import { MountState } from "@/ui/Types/MountState";

describe("FadeComponent", () => {
    it("renders children correctly", () => {
        const { getByText } = render(
            <FadeComponent>
                <Text>Test Child</Text>
            </FadeComponent>
        );
        expect(getByText("Test Child")).toBeTruthy();
    });
    it("applies custom styles", () => {
        const { getByLabelText } = render(
            <FadeComponent style={{ backgroundColor: 'red' }} aria-label="fade-component">
                <Text>Styled Child</Text>
            </FadeComponent>
        );
        const fadeComponent = getByLabelText("fade-component");
        expect(fadeComponent.props.style).toMatchObject({ backgroundColor: 'red' });
    });
});
describe("FadeComponent mount and unmount animations", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it("calls onMountAnimationEnd after mount animation", () => {
        const onMountAnimationEnd = jest.fn();
        render(
            <FadeComponent 
                aria-label="fade-component-mount"
                mountState={MountState.Mount}
                onMountAnimationEnd={onMountAnimationEnd}
                duration={500}
            >
                <Text>Mount Test</Text>
            </FadeComponent>
        );
        expect(onMountAnimationEnd).not.toHaveBeenCalled();
        jest.advanceTimersByTime(500);
        expect(onMountAnimationEnd).toHaveBeenCalled();
    });
    it("calls onUnmountAnimationEnd after unmount animation", () => {
        const onUnmountAnimationEnd = jest.fn();
        render(
            <FadeComponent 
                aria-label="fade-component-unmount"
                mountState={MountState.Unmount}
                onUnmountAnimationEnd={onUnmountAnimationEnd}
                duration={500}
            >          
                <Text>Unmount Test</Text>
            </FadeComponent>
        );
        expect(onUnmountAnimationEnd).not.toHaveBeenCalled();
        jest.advanceTimersByTime(500);
        expect(onUnmountAnimationEnd).toHaveBeenCalled();
    });
});    