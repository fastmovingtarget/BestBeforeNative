//2026-10-09 : Improvements made to avoid act error message
//2026-06-12 : Resize component created

import ResizeComponent from "@/ui/ResizeComponent";

import { act } from "react";
import { render } from '@testing-library/react-native';
import { Text } from "react-native";

beforeEach(() => {
    jest.resetAllMocks();
});

describe("ResizeComponent", () => {
    it("renders children correctly", async () => {
        const { getByText } = await render(
            <ResizeComponent targetHeight={0}
                duration={0}>
                <Text>Test Child</Text>
            </ResizeComponent>
        );
        expect(getByText("Test Child")).toBeTruthy();
    });
    it("applies custom styles", async () => {
        const { getByLabelText } = await render(
            <ResizeComponent targetHeight={0} 
                duration={0} style={{ backgroundColor: 'red' }} aria-label="resize-component">
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
    it("calls onResizeAnimationEnd after animation", async () => {
        const onResizeAnimationEnd = jest.fn();
        await render(
            <ResizeComponent 
                targetHeight={100}
                onResizeAnimationEnd={onResizeAnimationEnd}
                duration={500}
                aria-label="resize-component-animation"
            >
                <Text>Animation Test</Text>
            </ResizeComponent>
        );
        act(async () => {
            jest.advanceTimersByTime(500);
        });
        expect(onResizeAnimationEnd).toHaveBeenCalled();
    });
});