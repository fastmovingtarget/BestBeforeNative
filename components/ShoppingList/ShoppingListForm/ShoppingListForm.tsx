//2025-10-23 : Converted to use Shopping List Context

//2025-05-22 : Initial implementation and basic tests using ingredients form as a template

import { StyleSheet } from 'react-native';
import Shopping_List_Item from '@/Types/Shopping_List_Item';
import FormFieldContainer from '@/components/CustomComponents/FormFieldContainer';
import LabelText from '@/components/CustomComponents/LabelText';
import FormTextInput from '@/components/CustomComponents/FormTextInput';
import ButtonView from '@/components/CustomComponents/ButtonView';
import ComponentView from '@/components/CustomComponents/ComponentView';
import { useState } from 'react';
import { useShoppingList } from '@/Contexts/ShoppingList/ShoppingListDataProvider';

const blankItem : Shopping_List_Item = {
    Item_Name: "",
    Item_Quantity: 0
}

export default function ShoppingListForm({item = blankItem, isFormVisible, onCancel} : {item? : Shopping_List_Item, isFormVisible : boolean, onCancel? : () => void}) {

    const blankItem : Shopping_List_Item = {
        Item_Name: "",
        Item_Quantity: 0,
    }
    const [formItem, setFormItem] = useState<Shopping_List_Item>( item || blankItem);//gets 
    const {addShoppingItem, updateShoppingItem} = useShoppingList();

    const cancelHandler = () => {
        if(item.Item_ID)  
            setFormItem(item || blankItem) 
        else
            setFormItem(blankItem);

        if (onCancel) {
            onCancel();
        }
    }

    const submitHandler = () => {
        if(item?.Item_ID)  
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
        <ComponentView aria-label="formContainer" style={isFormVisible ? styles.formVisible : styles.formInvisible} >
            <FormFieldContainer  >
                <LabelText >Item: </LabelText> 
                <FormTextInput
                    defaultValue={formItem.Item_Name || ""}
                    inputMode='text'
                    onChange={(event) => setFormItem({...formItem, Item_Name: event.nativeEvent.text})}
                    aria-label="name-input"
                />
            </FormFieldContainer>

            <FormFieldContainer  >
                <LabelText >Quantity: </LabelText>
                <FormTextInput
                    defaultValue={formItem.Item_Quantity?.toString() || ""}
                    inputMode='numeric'
                    onChange={(event) => setFormItem({...formItem, Item_Quantity: parseInt(event.nativeEvent.text)})}
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
