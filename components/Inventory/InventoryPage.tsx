//2026-06-01 : FadeComponent with removal

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-28 : Removing extraneous import

import React, { useState } from "react";
import { StyleSheet } from "react-native";
import InventorySearch from "./InventorySearch/InventorySearch";
import InventoryList from "./InventoryList/InventoryList";
import InventoryItemForm from "./InventoryItemForm/InventoryItemForm";
import {ButtonView, FadeComponent, LabelText, PageView } from "@/ui/BestBeforeUI";
import { MountState } from "@/ui/Types/MountState";

export default function InventoryPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [mountState, setMountState] = useState(MountState.Mount);

    return (
        <PageView>
            <InventorySearch />
            {
                isFormVisible ? 
                <InventoryItemForm onCancel={() =>{ setMountState(MountState.Mount); setIsFormVisible(false); }} isFormVisible={isFormVisible} />
                :
                <FadeComponent mountState={mountState} onUnmountAnimationEnd={() =>  setIsFormVisible(true) } >
                    <ButtonView accessibilityRole="button" style={isFormVisible ? styles.addInventoryItemInvisible : {margin : 5}} onPress={() => setMountState(MountState.Unmount)} >
                        <LabelText >Add Inventory Item</LabelText>
                    </ButtonView>
                </FadeComponent>
            }
            <InventoryList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}

const styles = StyleSheet.create({
    addInventoryItemInvisible: {
        display: "none",
    },
});