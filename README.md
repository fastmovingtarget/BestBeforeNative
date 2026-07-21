# BestBeforeNative

## A web and mobile application designed to help users keep track of what's in their fridge, recipes that they can use, a calendar to plan and a shopping list to keep track of what's still needed

### How does it work?
- BestBeforeNative uses, as the title might indicate, a React Native Frontend to display the user's data in 4 tabs
- The Frontend interacts with an ASP.NET Core Controller API, sited in the imaginatively named BestBeforeCore repository
- The API queries a MySQL database hosted on Microsoft Azure

### Tab 1: Inventory
- Represented in-app by a fridge
- Lists what cooking ingredients are available to the user, how much of each there is (in grams) and when the ingredient expires
- If the ingredient is being used in a planned recipe, then ingredient will also show when it's being used, and in what recipe

### Tab 2: Recipes
- Represented by a steaming pot icon
- Shows a searchable list of recipes the user has stored
- Allows the user to press a recipe in order to view the recipe in more detail
- Selected recipes allow editing or deletion

### Tab 3: Planner
- Represented by a calendar icon
- Initially shows a calendar with the names of recipes that the user has already planned
- By selecting a date on the calendar, the user can more to a page where they are able to add a recipe (selected from a searchable list) that they intend to cook that day
- Recipes that have been planned on that day can also be selected in order to view the ingredients that will be required
- Required ingredients can have one of three states: Accounted for (green), On Shopping List (yellow) or Unaccounted For (red)
- Ingredients that are Unaccounted for can be paired with an existing ingredient (for instance if the user wants to substitute an ingredient in their recipe) or added to the Shopping List
- If a recipe ingredient paired with an existing inventory item uses less quantity than exists, the existing inventory item will be split, with one portion being fully used in the recipe and the remainder being unused.

### Tab 4: Shopping List
- Represented by a basket icon
- Shows a searchable list of items on the user's shopping list
- Shopping list items show the item name and the quantity required. Shopping list items added from the Planner tab also contain the date and recipe that they will be required for
- Shopping list items have a "Buy" button (indicated by the Inventory icon with an add marker) that transfers the shopping list item over to the Inventory with the same name and quantity (and plan information) but an unfilled expiry date
