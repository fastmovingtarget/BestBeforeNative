import {ScrollView} from "react-native";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

type ListViewProps = PropsWithChildren<{style? : ViewStyle}>

const ListView : React.FC<ListViewProps> = props => {
    return (
        <ScrollView style={{ 
            ...props.style,
            ...listViewStyles

        }}>
            {props.children}
        </ScrollView>
    );
}

const listViewStyles = {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    borderRadius: 10,
    marginBottom: 80,//scales with tab bar
} as ViewStyle;


export default ListView;