//2026-06-12 : Resize component created

import ResizeComponent from "@/ui/ResizeComponent";

import React from "react";
import { render } from '@testing-library/react-native';
import { Text } from "react-native";

describe("ResizeComponent", () => {
    it("renders children correctly", () => {
        const { getByText } = render(
            <ResizeComponent targetHeight={100}>
                <Text>Test Child</Text>
            </ResizeComponent>
        );
        expect(getByText("Test Child")).toBeTruthy();
    });
    it("applies custom styles", () => {
        const { getByLabelText } = render(
            <ResizeComponent targetHeight={100} style={{ backgroundColor: 'red' }} aria-label="resize-component">
                <Text>Styled Child</Text>
            </ResizeComponent>
        );
        const resizeComponent = getByLabelText("resize-component");
        expect(resizeComponent.props.style).toMatchObject({ backgroundColor: 'red' });
    });
});

describe("ResizeComponent animations", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it("calls onResizeAnimationEnd after animation", () => {
        const onResizeAnimationEnd = jest.fn();
        render(
            <ResizeComponent 
                targetHeight={100}
                onResizeAnimationEnd={onResizeAnimationEnd}
                duration={500}
                aria-label="resize-component-animation"
            >
                <Text>Animation Test</Text>
            </ResizeComponent>
        );
        jest.advanceTimersByTime(500);
        expect(onResizeAnimationEnd).toHaveBeenCalled();
    });
});