//2026-07-20 : Using aria-label to indicate role
//2026-07-16 : Added function description

//2026-07-01 : Adding Cancel and Submit Icons

//2026-06-19 : allow submission of items on today's date

//2026-06-18 : Added validation for form fields

//2026-06-18 : Item quantity now starts undefined

//2026-06-01 : feat: use FadeComponent, consolidate UI

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Updated to useIngredient context, simplified a terary operator

import React, {useState} from 'react'
import { StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Inventory_Item from "@/Types/Inventory_Item";
import { ButtonView, LabelText, FormTextInput, RowContainer, FadeComponent } from '@/ui/BestBeforeUI';
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";
import { MountState } from '@/ui/Types/MountState';
import { CancelIcon, SubmitInventoryIcon } from '@/ui/ReactIcon';

/**
 * InventoryItemForm component
 * @param inventoryItem - The inventory item to edit (optional)
 * @param onCancel - Callback function to call when the form is cancelled (optional)
 * @param isFormVisible - Boolean indicating whether the form is visible (default: false)
 * @returns A form for adding or editing an inventory item
 */

export default function InventoryItemForm({inventoryItem, onCancel, isFormVisible = false} : {inventoryItem?: Inventory_Item, onCancel?: () => void, isFormVisible?: boolean}) {

    const blankInventoryItem : Inventory_Item = {
        Inventory_Item_Name: "",
        Inventory_Item_Quantity: null,
        Inventory_Item_Date: new Date(),
    }
    const [formInventoryItem, setFormInventoryItem] = useState<Inventory_Item>( inventoryItem || blankInventoryItem);
    const [pickerVisible, setPickerVisible] = useState(false);
    const {addInventoryItem, updateInventoryItem} = useInventory();
    const [mountState, setMountState] = useState<MountState>(MountState.Mount);

    /*
        When the cancel button is pressed, reset the form to either the passed in inventory item or a blank item, and set the mount state to unmount. 
        With both of those set, if an onCancel callback is provided it will be called after the unmount animation ends.
     */
    const cancelHandler = () => {
        if(formInventoryItem.Inventory_Item_ID) 
            setFormInventoryItem(inventoryItem || blankInventoryItem);
        else
            setFormInventoryItem(blankInventoryItem);

        setMountState(MountState.Unmount);
    }

    /*
        When the submit button is pressed, validate the form fields. 
        If valid, either update the existing inventory item or add a new one. 
        After submission, set the mount state to unmount.
     */
    const submitHandler = () => {
        if(validateName(formInventoryItem.Inventory_Item_Name || "") !== true || validateQuantity(formInventoryItem.Inventory_Item_Quantity?.toString() || "") !== true || validateDate(formInventoryItem.Inventory_Item_Date || undefined) !== true){
            return;
        }
        if(formInventoryItem?.Inventory_Item_ID)  
            updateInventoryItem(formInventoryItem) 
        else{ 
            addInventoryItem(formInventoryItem);
            setFormInventoryItem(blankInventoryItem);
        }
        
        setMountState(MountState.Unmount);
    }


    /**
     * Form validation functions:
     * validateName - Ensures the item name is not empty
     * validateQuantity - Ensures the quantity is not empty and is a number
     * validateDate - Ensures the date is not empty and is not in the past
     */
    const validateName = (text: string) => {
        if(text.trim() === "") return "Item name cannot be empty";
        return true;
    }

    const validateQuantity = (text: string) => {
        if(text.trim() === "") return "Quantity cannot be empty";
        if(isNaN(parseInt(text))) return "Quantity must be a number";
        return true;
    }

    const validateDate = (date: Date | undefined) => {
        if(!date) return "Date cannot be empty";
        const today = new Date();
        if(date.getFullYear() < today.getFullYear() || 
            (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth()) ||
            (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() < today.getDate())) 
            return "Date cannot be in the past";
        return true;
    }

    return (
        <FadeComponent aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible} mountState={mountState} onUnmountAnimationEnd={() => {if(onCancel) onCancel()}} >
            <RowContainer  >
                <FormTextInput
                    validationFunction={validateName}
                    defaultValue={formInventoryItem.Inventory_Item_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormInventoryItem({...formInventoryItem, Inventory_Item_Name: event.nativeEvent.text})}
                    placeholder="Item Name"
                    aria-label="name-input"
                />
            </RowContainer>
                
            <RowContainer  >
                <ButtonView
                    onPress={() => setPickerVisible(!pickerVisible)}
                    style={{width: "100%", padding:0}}
                    aria-label="date-input-button"
                >
                    <LabelText aria-label="date-button-label">
                        {`Use By: ${formInventoryItem.Inventory_Item_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}`}
                    </LabelText>
                </ButtonView>
                {pickerVisible ? <DateTimePicker
                    value={formInventoryItem.Inventory_Item_Date || new Date()}
                    minimumDate={new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, date) => {setFormInventoryItem({...formInventoryItem, Inventory_Item_Date: date}); setPickerVisible(false)}}
                    aria-label="date-input"
                /> : null}
            </RowContainer>
            <RowContainer  >
                <FormTextInput
                    validationFunction={validateQuantity}
                    defaultValue={formInventoryItem.Inventory_Item_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormInventoryItem({...formInventoryItem, Inventory_Item_Quantity: parseInt(event.nativeEvent.text) ? parseInt(event.nativeEvent.text) : null})}
                    placeholder="Quantity"
                    aria-label="quantity-input"
                />
            </RowContainer>
            <RowContainer style={{justifyContent:"space-around"}} >
                <ButtonView onPress={cancelHandler} style={{flexGrow:1, marginRight: 5}} aria-label="cancel-button">
                    <CancelIcon />
                </ButtonView>
                <ButtonView onPress={submitHandler} style={{flexGrow:1, marginLeft: 5}} aria-label="submit-button">
                    <SubmitInventoryIcon />
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
