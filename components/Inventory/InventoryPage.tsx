//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-28 : Removing extraneous import

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonView from "../CustomComponents/ButtonView";
import LabelText from "../CustomComponents/LabelText";
import PageView from "../CustomComponents/PageView";
import InventorySearch from "./InventorySearch/InventorySearch";
import InventoryList from "./InventoryList/InventoryList";
import InventoryItemForm from "./InventoryItemForm/InventoryItemForm";

export default function IngredientsPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <PageView>
            <Text>Inventory Page</Text>
            <InventorySearch />
            <View >
                <ButtonView accessibilityRole="button" style={isFormVisible ? styles.addInventoryItemInvisible : {margin : 5}} onPress={() => setIsFormVisible(true)}>
                    <LabelText >Add Inventory Item</LabelText>
                </ButtonView>
                <InventoryItemForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
            </View>
            <InventoryList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}

const styles = StyleSheet.create({
    addInventoryItemInvisible: {
        display: "none",
    },
});