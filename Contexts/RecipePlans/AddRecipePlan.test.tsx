import { render, screen, act } from '@testing-library/react';
import { addRecipePlanData } from './AddRecipePlan';
import RecipePlan from '../../Types/RecipePlan'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetch.resetMocks();
})