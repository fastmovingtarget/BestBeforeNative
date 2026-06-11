//2026-06-01 : Using FadeComponent and RowContainer

//2025-11-21 : Moving common UI elements into their own folder

//2025-11-19 : Item_... fields now have Shopping_ as a prefix

//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests using ingredients form as a template

import { StyleSheet } from 'react-native';
import Shopping_List_Item from '@/Types/Shopping_List_Item';
import { useState } from 'react';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';
import {RowContainer, ButtonView, LabelText, FormTextInput, FadeComponent} from '@/ui/BestBeforeUI';

const blankItem : Shopping_List_Item = {
    Shopping_Item_Name: "",
    Shopping_Item_Quantity: 0
}

export default function ShoppingListForm({item = blankItem, isFormVisible, onCancel} : {item? : Shopping_List_Item, isFormVisible : boolean, onCancel? : () => void}) {

    const blankItem : Shopping_List_Item = {
        Shopping_Item_Name: "",
        Shopping_Item_Quantity: 0,
    }
    const [formItem, setFormItem] = useState<Shopping_List_Item>( item || blankItem);//gets 
    const {addShoppingItem, updateShoppingItem} = useShoppingList();

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
            <RowContainer  >
                <LabelText >Item: </LabelText> 
                <FormTextInput
                    defaultValue={formItem.Shopping_Item_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormItem({...formItem, Shopping_Item_Name: event.nativeEvent.text})}
                    aria-label="name-input"
                />
            </RowContainer>

            <RowContainer  >
                <LabelText >Quantity: </LabelText>
                <FormTextInput
                    defaultValue={formItem.Shopping_Item_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormItem({...formItem, Shopping_Item_Quantity: parseInt(event.nativeEvent.text)})}
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
