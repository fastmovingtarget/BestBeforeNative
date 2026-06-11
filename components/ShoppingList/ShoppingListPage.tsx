//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list page

import React, { useState } from "react";
import ShoppingListSearch from "./ShoppingListSearch/ShoppingListSearch";
import ShoppingList from "./ShoppingList/ShoppingList";
import ShoppingListForm from "./ShoppingListForm/ShoppingListForm";
import { PageView, ButtonView, LabelText, FadeComponent} from '@/ui/BestBeforeUI';

export default function ShoppingListPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <PageView>
            <ShoppingListSearch />
                {!isFormVisible ?
                    <FadeComponent>
                        <ButtonView accessibilityRole="button" onPress={() => setIsFormVisible(true)} style={{margin:5}}>
                            <LabelText >Add Item</LabelText>
                        </ButtonView> 
                    </FadeComponent>
                    :
                    <ShoppingListForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
                }
            <ShoppingList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}