/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


export const LightColours = {
    primary:          "#a09181",
    background:       "#c2b5a8",
    buttonBackground: "#817467",
    buttonBackgroundPressed: "#aaaaaa",
    inputBackground:  "#B09F8E",
    text:             "#000000",
    componentText:    "#ffffff",
    buttonText:       "#ffffff",
    placeholderText:  "#666666",
    errorText:        "#aa0000",
    tint:            "#817467",
} as ColoursType;

export const DarkColours = {
    primary:          "#31296c",
    background:       "#5648ba",
    buttonBackground: "#5648ba",
    buttonBackgroundPressed: "#c2b5a8",
    inputBackground:  "#B09F8E",
    text:             "#ffffff",
    componentText:    "#ffffff",
    buttonText:       "#ffffff",
    placeholderText:  "#666666",
    errorText:        "#aa0000",
    tint:            "#817467",
} as ColoursType;

export interface ColoursType {
    primary: string;
    background: string;
    buttonBackground: string;
    buttonBackgroundPressed: string;
    inputBackground: string;
    text: string;
    componentText: string;
    buttonText: string;
    placeholderText: string;
    errorText: string;
    tint: string;
}