//2025-11-19 : Renamed "Ingredient(s)" to "Inventory(_Items)"

//2025-10-20 : Updated to useIngredient context, simplified a terary operator

import React, {useState} from 'react'
import { StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Inventory_Item from "@/Types/Inventory_Item";
import ComponentView from '@/components/CustomComponents/ComponentView';
import ButtonView from '@/components/CustomComponents/ButtonView';
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import LabelText from '@/components/CustomComponents/LabelText';
import FormTextInput from '@/components/CustomComponents/FormTextInput';
import { useInventory } from "@/Contexts/Inventory/InventoryDataProvider";

export default function InventoryItemForm({inventoryItem, onCancel, isFormVisible = false} : {inventoryItem?: Inventory_Item, onCancel?: () => void, isFormVisible?: boolean}) {

    const blankInventoryItem : Inventory_Item = {
        Inventory_Item_Name: "",
        Inventory_Item_Quantity: 0,
        Inventory_Item_Date: new Date(),
    }
    const [formInventoryItem, setFormInventoryItem] = useState<Inventory_Item>( inventoryItem || blankInventoryItem);
    const [pickerVisible, setPickerVisible] = useState(false);
    const {addInventoryItem, updateInventoryItem} = useInventory();
    const cancelHandler = () => {
        if(formInventoryItem.Inventory_Item_ID) 
            setFormInventoryItem(inventoryItem || blankInventoryItem);
        else
            setFormInventoryItem(blankInventoryItem);

        if (onCancel) {
            onCancel();
        }
    }

    const submitHandler = () => {
        if(formInventoryItem?.Inventory_Item_ID)  
            updateInventoryItem(formInventoryItem) 
        else{ 
            addInventoryItem(formInventoryItem);
            setFormInventoryItem(blankInventoryItem);
        }
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <ComponentView aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible} >
            <FormFieldContainer  >
                <LabelText >Ingredient: </LabelText> 
                <FormTextInput
                    defaultValue={formInventoryItem.Inventory_Item_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormInventoryItem({...formInventoryItem, Inventory_Item_Name: event.nativeEvent.text})}
                    aria-label="name-input"
                />
            </FormFieldContainer>
                
            <FormFieldContainer  >
                <LabelText aria-label="date-input-label" >Use By: </LabelText>
                <ButtonView
                    onPress={() => setPickerVisible(!pickerVisible)}
                    style={{width: "70%", padding:0}}
                >
                    <LabelText aria-label="date-input-button">
                        {formInventoryItem.Inventory_Item_Date?.toLocaleDateString("en-UK", { year: "numeric", month: "2-digit", day: "2-digit" })}
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
            </FormFieldContainer>
            <FormFieldContainer  >
                <LabelText >Quantity: </LabelText>
                <FormTextInput
                    defaultValue={formInventoryItem.Inventory_Item_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormInventoryItem({...formInventoryItem, Inventory_Item_Quantity: parseInt(event.nativeEvent.text)})}
                    aria-label="quantity-input"
                />
            </FormFieldContainer>
            <FormFieldContainer style={{justifyContent:"space-around"}} >
                <ButtonView onPress={cancelHandler}>
                    <LabelText >Cancel</LabelText>
                </ButtonView>
                <ButtonView onPress={submitHandler}>
                    <LabelText >Submit</LabelText>
                </ButtonView>
            </FormFieldContainer>

        </ComponentView>
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
