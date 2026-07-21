//2026-07-20 : Adding aria-labels to iconised components
//2026-07-16 : Added function descriptions
//2026-07-01 : Icons for Submit and Cancel

//2026-06-18 : Quantity now starts undefined, adds validation

//2026-06-15 : Correctly validating input forms

//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests using ingredients form as a template

import { StyleSheet } from 'react-native';
import Shopping_List_Item from '@/Types/Shopping_List_Item';
import { useState } from 'react';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import {RowContainer, ButtonView, FormTextInput, FadeComponent} from '@/ui/BestBeforeUI';
import { CancelIcon, SubmitShoppingListIcon } from '@/ui/ReactIcon';

const blankItem : Shopping_List_Item = {
    Shopping_Item_Name: "",
    Shopping_Item_Quantity: undefined,
}

/**
 * ShoppingListForm component
 * @param item - The shopping list item to edit (optional)
 * @param isFormVisible - Boolean indicating whether the form is visible
 * @param onCancel - Callback function to call when the form is cancelled (optional)
 * @returns A form for adding or editing a shopping list item
 */
export default function ShoppingListForm({item = blankItem, isFormVisible, onCancel} : {item? : Shopping_List_Item, isFormVisible : boolean, onCancel? : () => void}) {

    const blankItem : Shopping_List_Item = {
        Shopping_Item_Name: "",
        Shopping_Item_Quantity: undefined,
    }
    const [formItem, setFormItem] = useState<Shopping_List_Item>( item || blankItem);//gets 
    const {addShoppingItem, updateShoppingItem} = useShoppingList();

    const itemNameValidation = (text: string) => {
        if(text.trim() === "") return "Item name cannot be empty";
        return true;
    }

    const quantityValidation = (text: string) => {
        if(text.trim() === "") return "Quantity cannot be empty";
        if(isNaN(parseInt(text))) return "Quantity must be a number";
        return true;
    }

    const cancelHandler = () => {
        if(item?.Shopping_Item_ID)  
            setFormItem(item || blankItem) 
        else
            setFormItem(blankItem);

        if (onCancel) {
            onCancel();
        }
    }

    const submitHandler = () => {
        if(itemNameValidation(formItem.Shopping_Item_Name) !== true || quantityValidation(formItem.Shopping_Item_Quantity?.toString() || "") !== true){
            return;
        }
        if(item?.Shopping_Item_ID)  
            updateShoppingItem(formItem) 
        else{ 
            addShoppingItem(formItem);
            setFormItem(blankItem);
        }
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <FadeComponent aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible} >
            <RowContainer style={{justifyContent: "space-between"}} >
                <FormTextInput
                    placeholder="Item Name"
                    defaultValue={formItem.Shopping_Item_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormItem({...formItem, Shopping_Item_Name: event.nativeEvent.text})}
                    validationFunction={itemNameValidation}
                    aria-label="name-input"
                />
            </RowContainer>

            <RowContainer style={{alignItems: "center", justifyContent: "space-between"}} >
                <FormTextInput
                    placeholder="Quantity"
                    defaultValue={formItem.Shopping_Item_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormItem({...formItem, Shopping_Item_Quantity: parseInt(event.nativeEvent.text) ? parseInt(event.nativeEvent.text) : undefined})}
                    validationFunction={quantityValidation}
                    aria-label="quantity-input"
                />
            </RowContainer>
            <RowContainer style={{justifyContent:"space-around", marginTop: 10}} >
                <ButtonView onPress={cancelHandler} style={{flexGrow:1, marginRight: 5}} aria-label="cancel-button">
                    <CancelIcon />
                </ButtonView>
                <ButtonView onPress={submitHandler} style={{flexGrow:1, marginLeft: 5}} aria-label="submit-button">
                    <SubmitShoppingListIcon />
                </ButtonView>
            </RowContainer>

        </FadeComponent>
    )
}

const styles = StyleSheet.create({
    formVisible: {
        display: "flex",
        flexDirection: "column",
        padding: 10,
        borderRadius: 5,
    },
    formInvisible: {
        display: "none",
    },
});
