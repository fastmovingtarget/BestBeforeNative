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
    const cancelHandler = () => {
        if(formInventoryItem.Inventory_Item_ID) 
            setFormInventoryItem(inventoryItem || blankInventoryItem);
        else
            setFormInventoryItem(blankInventoryItem);

        setMountState(MountState.Unmount);
    }

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
                >
                    <LabelText aria-label="date-input-button">
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
                <ButtonView onPress={cancelHandler}>
                    <LabelText >Cancel</LabelText>
                </ButtonView>
                <ButtonView onPress={submitHandler}>
                    <LabelText >Submit</LabelText>
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
