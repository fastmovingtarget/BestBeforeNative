//2026-07-01 : Moving Add button onto the Search bar

//2026-06-30 : Icon for Add to Shopping List

//2026-06-01 : Using FadeComponent for animations

//2025-11-21 : Moving common UI elements into their own folder

//2025-10-23 : Converted to use Shopping List Context

//2025-05-27 : Initial implementation of shopping list page

import React, { useState } from "react";
import ShoppingListSearch from "./ShoppingListSearch/ShoppingListSearch";
import ShoppingList from "./ShoppingList/ShoppingList";
import ShoppingListForm from "./ShoppingListForm/ShoppingListForm";
import { PageView} from '@/ui/BestBeforeUI';

export default function ShoppingListPage() {
    const [isFormVisible, setIsFormVisible] = useState(false);

    return (
        <PageView>
            <ShoppingListSearch setIsFormVisible={setIsFormVisible} />
                {isFormVisible &&
                    <ShoppingListForm onCancel={() => setIsFormVisible(false)} isFormVisible={isFormVisible} />
                }
            <ShoppingList onEdit={() => setIsFormVisible(false)} />
        </PageView>
    );
}