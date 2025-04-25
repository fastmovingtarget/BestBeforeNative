import { render, screen, act } from '@testing-library/react';
import { deleteShoppingListItemData } from './DeleteShoppingListItem';
import Shopping_List_Item from '../../Types/Shopping_List_Item'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})

test("placeholder", () => {
    expect(true).toBe(true);
})