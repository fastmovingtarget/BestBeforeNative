//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list page

import React, { useState } from "react";
import { View, Text } from "react-native";
import ButtonView from "../../ui/ButtonView";
import LabelText from "../../ui/LabelText";
import PageView from "../../ui/PageView";
import ShoppingListSearch from "./ShoppingListSearch/ShoppingListSearch";
import ShoppingList from "./ShoppingList/ShoppingList";
import ShoppingListForm from "./ShoppingListForm/ShoppingListForm";

export default function ShoppingListPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <PageView>
            <Text>Shopping List Page</Text>
            <ShoppingListSearch />
            <View >
                {!isFormVisible ?
                    <ButtonView accessibilityRole="button" onPress={() => setIsFormVisible(true)} style={{margin:5}}>
                        <LabelText >Add Item</LabelText>
                    </ButtonView> 
                    :
                    <ShoppingListForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
            }
            </View>
            <ShoppingList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}