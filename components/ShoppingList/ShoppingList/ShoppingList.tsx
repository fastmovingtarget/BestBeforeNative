//2025-05-22 : Initial implementation and basic tests

import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import Shopping_List_Item from "@/Types/Shopping_List_Item";
import { useData } from "@/Contexts/DataProvider";
import { useState } from "react";
import ShoppingListForm from "../ShoppingListForm/ShoppingListForm";
import ShoppingListItem from "./ShoppingListItem/ShoppingListItem";
import ListView from "@/components/CustomComponents/ListView";

export default function ShoppingList({onEdit}: {onEdit: () => void}) {
    const [editId, setEditId] = useState<number | undefined>(undefined);

    return (
        <ListView >
            {useData().shoppingList.map((item: Shopping_List_Item) => (
                editId !== item.Item_ID ?
                    <ShoppingListItem key={`item-${item.Item_ID}`} item={item} onEdit={(id) => {
                        setEditId(id);
                        onEdit();
                    }}/> :
                    <ShoppingListForm key={`item-form-${item.Item_ID}`} item={item} onCancel={() => {setEditId(undefined)}} isFormVisible={true}/>
            ))}
        </ListView>
    );
}