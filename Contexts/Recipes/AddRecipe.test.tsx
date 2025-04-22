import { render, screen, act } from '@testing-library/react';
import { addRecipeData } from './AddRecipe';
import Recipe from '../../Types/Recipe'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})