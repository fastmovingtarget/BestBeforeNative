import { render, screen, act } from '@testing-library/react';
import { getIngredientsData } from './GetIngredients';
import Ingredient, {IngredientSearchOptions} from '../../Types/Ingredient'; // Adjust the import path as necessary
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mocking the fetch function
beforeEach(() => {
    fetchMock.resetMocks();
})

describe('getIngredientsData', () => {
    test('should fetch ingredients data and update state', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;

        const now = new Date();
        const tomorrow = new Date(now.getUTCMilliseconds() + 86400000); // 1 day later
        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetchMock.mockResponseOnce(JSON.stringify([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            mockSetIngredients,
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Date: now,
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Date: tomorrow,
                Ingredient_Quantity: 2,
            },
        ]);
    }),
    test('test get ingredients works when date isn\'t in the fetched data', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;

        //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
        
        fetchMock.mockResponseOnce(JSON.stringify([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Quantity: 2,
            },
        ])
        );

        await getIngredientsData(
            mockServerProps,
            userID,
            mockSetIngredients,
        );

        expect(mockSetIngredients).toHaveBeenCalledWith([
            {
                Ingredient_ID: 1,
                Ingredient_Name: 'Ingredient 1',
                Ingredient_Quantity: 1,
            },
            {
                Ingredient_ID: 2,
                Ingredient_Name: 'Ingredient 2',
                Ingredient_Quantity: 2,
            },
        ]);
    }),
    test('should handle fetch error', async () => {
        const mockSetIngredients = jest.fn();
        const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
        const userID = 1;
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });

        await getIngredientsData(
            mockServerProps,
            userID,
            mockSetIngredients,
        );

        expect(mockSetIngredients).not.toHaveBeenCalled(); // Check if setIngredients was not called
    });
    describe("Should be called with options", () => {
        test('search string', async () => {
            const mockSetIngredients = jest.fn();
            const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
            const userID = 1;
    
            const now = new Date();

            const searchOptions : IngredientSearchOptions = {
                searchText: 'Ingredient 1',
            }
    
            //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
            fetchMock.mockResponseOnce(JSON.stringify([
                {
                    Ingredient_ID: 1,
                    Ingredient_Name: 'Ingredient 1',
                    Ingredient_Date: now,
                    Ingredient_Quantity: 1,
                }
            ])
            );
    
            await getIngredientsData(
                mockServerProps,
                userID,
                mockSetIngredients,
                searchOptions
            );
    
            expect(mockSetIngredients).toHaveBeenCalledWith([
                {
                    Ingredient_ID: 1,
                    Ingredient_Name: 'Ingredient 1',
                    Ingredient_Date: now,
                    Ingredient_Quantity: 1,
                }
            ]);

            expect(fetch).toHaveBeenCalledWith(
                `http://${mockServerProps.DatabaseServer}:${mockServerProps.DatabasePort}/ingredients/${userID}?searchText=Ingredient%201`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            expect(mockSetIngredients.mock.calls[0][0]).toHaveLength(1); // Check if the length of the array is 2  
        })
        test('search called with all options', async () => {
            const mockSetIngredients = jest.fn();
            const mockServerProps = { DatabaseServer: 'localhost', DatabasePort: '3000' };
            const userID = 1;
    
            const now = new Date();

            const searchOptions : IngredientSearchOptions = {
                searchText: 'Ingredient 1',
                sortBy: 'Ingredient_Name',
                sortOrder: 'asc',
                amount: 100,
            }
    
            //if I instance the dates seperately in the call and response, I get different timestamps 'cos the test takes time, so I'll just make 'em here
            fetchMock.mockResponseOnce(JSON.stringify([
                {
                    Ingredient_ID: 1,
                    Ingredient_Name: 'Ingredient 1',
                    Ingredient_Date: now,
                    Ingredient_Quantity: 1,
                }
            ])
            );
    
            await getIngredientsData(
                mockServerProps,
                userID,
                mockSetIngredients,
                searchOptions
            );
    
            expect(mockSetIngredients).toHaveBeenCalledWith([
                {
                    Ingredient_ID: 1,
                    Ingredient_Name: 'Ingredient 1',
                    Ingredient_Date: now,
                    Ingredient_Quantity: 1,
                }
            ]);

            expect(fetch).toHaveBeenCalledWith(
                `http://${mockServerProps.DatabaseServer}:${mockServerProps.DatabasePort}/ingredients/${userID}?searchText=Ingredient%201&sortBy=Ingredient_Name&sortOrder=asc&amount=100`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

            expect(mockSetIngredients.mock.calls[0][0]).toHaveLength(1); // Check if the length of the array is 2  
        })
    })
})